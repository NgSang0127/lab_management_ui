import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    TextField,
    Button,
    MenuItem,
    FormControl,
    Select,
    InputLabel,
    Typography,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Card,
    CardContent,
    CardHeader,
    Alert,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../state/store.ts';
import { createTimetable, fetchTimetableByDate } from '../../state/timetable/thunk.ts';
import { periods } from '../../utils/utilsTimetable.ts';
import LoadingIndicator from '../../components/support/LoadingIndicator.tsx';
import CustomAlert from '../../components/support/CustomAlert.tsx';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import InstructorAutocomplete from '../../components/semester/InstructorAutocomplete.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, Locale, isToday, isFuture } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import i18n from 'i18next';
import { Timetable } from '../../state/timetable/timetableSlice.ts';
import PendingTimetablePanel from './PendingTimetablePanel';

const FormContainer = styled(Box)(({ theme }) => ({
    maxWidth: '1200px',
    margin: '0 auto',
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5),
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: theme.spacing(1),
    transition: 'background-color 0.3s, transform 0.2s',
    '&:disabled': {
        backgroundColor: theme.palette.action.disabledBackground,
        color: theme.palette.action.disabled,
    },
}));

const RoomCard = styled(Card)(({ theme, selected }: { theme: any; selected: boolean }) => ({
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: selected ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
    backgroundColor: selected ? theme.palette.primary.light : theme.palette.background.paper,
    '&:hover': {
        boxShadow: theme.shadows[4],
        transform: 'translateY(-2px)',
    },
    height: '100%',
}));

const PeriodChip = styled(Chip)(({ theme, available }: { theme: any; available: boolean }) => ({
    margin: theme.spacing(0.25),
    backgroundColor: available ? theme.palette.success.light : theme.palette.error.light,
    color: available ? theme.palette.success.contrastText : theme.palette.error.contrastText,
    fontSize: '0.75rem',
    height: '24px',
    '&:hover': {
        backgroundColor: available ? theme.palette.success.main : theme.palette.error.main,
    },
}));

interface RoomSchedule {
    roomName: string;
    timetables: Timetable[];
    availablePeriods: { start: number; end: number }[];
    bookedPeriods: number[];
}

const CreateTimetable: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { isLoading, error } = useSelector((state: RootState) => state.timetable);
    const { user } = useSelector((state: RootState) => state.auth);

    // All possible rooms - replace with your actual room list
    const ALL_ROOMS = ['LA1.604', 'LA1.605', 'LA1.606', 'LA1.607', 'LA1.608', 'AI'];

    // Form state
    const [timetableName, setTimetableName] = useState('');
    const [selectedRoomName, setSelectedRoomName] = useState('');
    const [startLesson, setStartLesson] = useState<number | ''>('');
    const [endLesson, setEndLesson] = useState<number | ''>('');
    const [date, setDate] = useState<Date | null>(null);
    const [instructorId, setInstructorId] = useState<number | null>(null);
    const [description, setDescription] = useState('');
    const [roomSchedules, setRoomSchedules] = useState<RoomSchedule[]>([]);
    const [isLoadingTimetables, setIsLoadingTimetables] = useState(false);

    // Alert state
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

    const localeMap: { [key: string]: Locale } = {
        en: enUS,
        vi: vi,
    };

    const [currentLocale, setCurrentLocale] = useState<Locale>(enUS);

    // Check if user is teacher
    const isTeacher = user?.role === 'TEACHER';

    useEffect(() => {
        const initializeI18n = () => {
            const savedLanguage = localStorage.getItem('language');
            const defaultLanguage = 'en';
            const languageToUse = savedLanguage || defaultLanguage;

            if (!savedLanguage) {
                localStorage.setItem('language', defaultLanguage);
            }

            i18n.changeLanguage(languageToUse);
            setCurrentLocale(localeMap[languageToUse] || enUS);
        };

        initializeI18n();

        const handleStorageChange = () => {
            const newLanguage = localStorage.getItem('language') || 'en';
            i18n.changeLanguage(newLanguage);
            setCurrentLocale(localeMap[newLanguage] || enUS);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Auto-set instructor for TEACHER role
    useEffect(() => {
        if (isTeacher && user?.username) {
            setInstructorId(user.id);
        }
    }, [isTeacher, user]);

    // Load timetables when date changes
    useEffect(() => {
        const loadTimetables = async () => {
            if (date) {
                setIsLoadingTimetables(true);
                try {
                    const formattedDate = format(date, 'yyyy-MM-dd');
                    const action = await dispatch(fetchTimetableByDate({ date: formattedDate }));
                    const timetables = action.payload as Timetable[];

                    // Process room schedules
                    const schedules: RoomSchedule[] = ALL_ROOMS.map(roomName => {
                        const roomTimetables = timetables.filter(t => t.room.name === roomName);
                        const bookedPeriods = getBookedPeriods(roomTimetables);
                        const availablePeriods = getAvailablePeriods(bookedPeriods);

                        return {
                            roomName,
                            timetables: roomTimetables,
                            availablePeriods,
                            bookedPeriods
                        };
                    });

                    setRoomSchedules(schedules);
                } catch (err: any) {
                    handleAlert(t('timetable.createTimetable.errors.fetchTimetables', {
                        error: err.message || err,
                        defaultValue: 'Failed to load timetables: {{error}}'
                    }), 'error');
                } finally {
                    setIsLoadingTimetables(false);
                }
            } else {
                setRoomSchedules([]);
            }
        };
        loadTimetables();
    }, [date, dispatch, t]);

    const getBookedPeriods = (timetables: Timetable[]): number[] => {
        const bookedPeriods: number[] = [];
        timetables.forEach((timetable) => {
            for (let i = timetable.startLesson; i <= timetable.endLessonTime.lessonNumber; i++) {
                bookedPeriods.push(i);
            }
        });
        return bookedPeriods.sort((a, b) => a - b);
    };

    const getAvailablePeriods = (bookedPeriods: number[]): { start: number; end: number }[] => {
        const totalPeriods = 16;
        const isBooked: boolean[] = new Array(totalPeriods).fill(false);

        bookedPeriods.forEach(period => {
            if (period >= 1 && period <= totalPeriods) {
                isBooked[period - 1] = true;
            }
        });

        const availablePeriods: { start: number; end: number }[] = [];
        let start = 1;

        for (let i = 0; i < totalPeriods; i++) {
            if (!isBooked[i]) {
                if (i === 0 || isBooked[i - 1]) {
                    start = i + 1;
                }
                if (i === totalPeriods - 1 || isBooked[i + 1]) {
                    availablePeriods.push({ start, end: i + 1 });
                }
            }
        }

        return availablePeriods;
    };

    const handleAlert = (message: string, severity: 'success' | 'error') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };

    const handleCloseAlert = () => setAlertOpen(false);

    const getTimetableDisplayName = (timetable: Timetable): string => {
        if (timetable.timetableName && timetable.timetableName.trim()) return timetable.timetableName;
        if (timetable.courses && timetable.courses.length > 0) {
            const courseName = timetable.courses[0].name;
            if (courseName && courseName.trim()) return courseName;
        }
        return t('timetable.createTimetable.defaultTimetableName', { defaultValue: 'Unnamed Timetable' });
    };

    const handleRoomSelect = (roomSchedule: RoomSchedule) => {
        setSelectedRoomName(roomSchedule.roomName);
        setStartLesson('');
        setEndLesson('');

        // Log room information for debugging
        console.log('Selected room:', roomSchedule.roomName);
        console.log('Room timetables:', roomSchedule.timetables);
        console.log('Available periods:', roomSchedule.availablePeriods);
        console.log('Booked periods:', roomSchedule.bookedPeriods);
    };

    const handlePeriodSelect = (start: number, end: number) => {
        setStartLesson(start);
        setEndLesson(end);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!timetableName || !selectedRoomName || startLesson === '' || endLesson === '' || !date || !instructorId || !description) {
            handleAlert(t('timetable.createTimetable.errors.allFields', { defaultValue: 'Please fill in all required fields' }), 'error');
            return;
        }

        if (Number(startLesson) >= Number(endLesson)) {
            handleAlert(t('timetable.createTimetable.errors.startLesson_big_endLesson', { defaultValue: 'Start lesson must be less than end lesson' }), 'error');
            return;
        }

        const selectedRoomSchedule = roomSchedules.find(rs => rs.roomName === selectedRoomName);
        if (selectedRoomSchedule) {
            const isConflict = selectedRoomSchedule.timetables.some(
                (timetable) => timetable.startLesson <= Number(endLesson) && timetable.endLessonTime.lessonNumber >= Number(startLesson)
            );
            if (isConflict) {
                handleAlert(t('timetable.createTimetable.errors.conflict', { defaultValue: 'Time conflict with existing timetable' }), 'error');
                return;
            }
        }

        const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
        const timetableData = {
            timetableName,
            roomName: selectedRoomName,
            startLesson: Number(startLesson),
            endLesson: Number(endLesson),
            date: formattedDate,
            instructorId: String(instructorId),
            description,
        };

        try {
            // @ts-ignore
            await dispatch(createTimetable(timetableData)).unwrap();
            handleAlert(t('timetable.createTimetable.success.create', { defaultValue: 'Timetable created successfully' }), 'success');

            // Reset form
            setTimetableName('');
            setSelectedRoomName('');
            setStartLesson('');
            setEndLesson('');
            setDate(null);
            if (!isTeacher) {
                setInstructorId(null);
            }
            setDescription('');
            setRoomSchedules([]);
        } catch (err: any) {
            handleAlert(t('timetable.createTimetable.errors.create', { error: err.message || err, defaultValue: 'Failed to create timetable: {{error}}' }), 'error');
        }
    };

    const handleEndLessonChange = (value: number) => {
        if (startLesson !== '' && value <= Number(startLesson)) {
            handleAlert(t('timetable.createTimetable.errors.startLesson_big_endLesson', { defaultValue: 'Start lesson must be less than end lesson' }), 'error');
            setEndLesson('');
        } else {
            setEndLesson(value);
        }
    };

    // Check if date is valid (today or future)
    const isDateValid = (date: Date | null): boolean => {
        if (!date) return false;
        return isToday(date) || isFuture(date);
    };

    const selectedRoomSchedule = roomSchedules.find(rs => rs.roomName === selectedRoomName);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={currentLocale}>
            <Helmet>
                <title>Create Timetable | Lab Management IT</title>
            </Helmet>
            <PendingTimetablePanel />
            <FormContainer>
                <Typography
                    variant="h3"
                    gutterBottom
                    align="center"
                    sx={{
                        fontWeight: 800,
                        fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                        background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: { xs: 1, sm: 2 },
                        letterSpacing: -0.5,
                    }}
                >
                    {t("timetable.createTimetable.title")}
                </Typography>

                <Typography
                    variant="body1"
                    align="center"
                    sx={{
                        color: "rgba(0, 0, 0, 0.6)",
                        mb: { xs: 2, sm: 3, md: 4 },
                        fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                    }}
                >
                    Select a date and room to book timetable
                </Typography>

                {isTeacher && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                        <Typography variant="body2" color="info.contrastText">
                            {t('timetable.createTimetable.teacherNote', {
                                defaultValue: 'As a teacher, you can only create timetables for yourself. The instructor field is automatically set to your account.',
                                name: user?.fullName
                            })}
                        </Typography>
                    </Box>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label={t('timetable.createTimetable.name', { defaultValue: 'Timetable Name' })}
                                value={timetableName}
                                onChange={(e) => setTimetableName(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <DatePicker
                                format="dd/MM/yyyy"
                                label={t('timetable.createTimetable.date', { defaultValue: 'Date' })}
                                value={date}
                                onChange={(newValue) => {
                                    if (newValue && isDateValid(newValue)) {
                                        setDate(newValue);
                                        setSelectedRoomName('');
                                        setStartLesson('');
                                        setEndLesson('');
                                    } else if (newValue) {
                                        handleAlert('Cannot select past dates. Please select today or a future date.', 'error');
                                    } else {
                                        setDate(newValue);
                                    }
                                }}
                                shouldDisableDate={(date) => !isDateValid(date)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        required: true,
                                        variant: 'outlined',
                                        slotProps: { inputLabel: { shrink: true } },
                                        error: date && !isDateValid(date),
                                        helperText: date && !isDateValid(date) ? 'Please select today or a future date' : '',
                                    },
                                }}
                            />
                        </Grid>

                        {date && isDateValid(date) && (
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                    {t('timetable.createTimetable.roomSelection', { defaultValue: 'Room Selection' })}
                                </Typography>

                                {isLoadingTimetables ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                        <Typography>Loading room schedules...</Typography>
                                    </Box>
                                ) : (
                                    <Grid container spacing={2}>
                                        {roomSchedules.map((roomSchedule) => (
                                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={roomSchedule.roomName}>
                                                <RoomCard
                                                    selected={selectedRoomName === roomSchedule.roomName}
                                                    onClick={() => handleRoomSelect(roomSchedule)}
                                                >
                                                    <CardHeader
                                                        title={
                                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                                {roomSchedule.roomName}
                                                            </Typography>
                                                        }
                                                        subheader={
                                                            <Typography variant="body2" color="text.secondary">
                                                                {roomSchedule.availablePeriods.length > 0
                                                                    ? `${roomSchedule.availablePeriods.length} available slots`
                                                                    : 'Fully booked'
                                                                }
                                                            </Typography>
                                                        }
                                                    />
                                                    <CardContent sx={{ pt: 0 }}>
                                                        <Box sx={{ mb: 2 }}>
                                                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                                                                Available Periods:
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                {roomSchedule.availablePeriods.length > 0 ? (
                                                                    roomSchedule.availablePeriods.map((period, index) => (
                                                                        <PeriodChip
                                                                            key={index}
                                                                            label={`${period.start}-${period.end}`}
                                                                            size="small"
                                                                            available={true}
                                                                        />
                                                                    ))
                                                                ) : (
                                                                    <Typography variant="body2" color="error">
                                                                        No available periods
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        </Box>

                                                        {roomSchedule.timetables.length > 0 && (
                                                            <Box>
                                                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                                                                    Booked Periods:
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                    {roomSchedule.bookedPeriods.map((period, index) => (
                                                                        <PeriodChip
                                                                            key={index}
                                                                            label={period.toString()}
                                                                            size="small"
                                                                            available={false}
                                                                        />
                                                                    ))}
                                                                </Box>
                                                            </Box>
                                                        )}
                                                    </CardContent>
                                                </RoomCard>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Grid>
                        )}

                        {selectedRoomSchedule && (
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                    {t('timetable.createTimetable.schedule', { defaultValue: `Current Schedule for ${selectedRoomName}` })}
                                </Typography>

                                {selectedRoomSchedule.timetables.length > 0 ? (
                                    <TableContainer component={Paper} sx={{ maxHeight: 300, mb: 2 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>{t('timetable.createTimetable.timetableName', { defaultValue: 'Name' })}</TableCell>
                                                    <TableCell>{t('timetable.createTimetable.startLesson', { defaultValue: 'Start' })}</TableCell>
                                                    <TableCell>{t('timetable.createTimetable.endLesson', { defaultValue: 'End' })}</TableCell>
                                                    <TableCell>{t('timetable.createTimetable.instructor', { defaultValue: 'Teacher' })}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedRoomSchedule.timetables.map((timetable) => (
                                                    <TableRow key={timetable.id}>
                                                        <TableCell>{getTimetableDisplayName(timetable)}</TableCell>
                                                        <TableCell>{timetable.startLesson}</TableCell>
                                                        <TableCell>{timetable.endLessonTime.lessonNumber}</TableCell>
                                                        <TableCell>
                                                            {timetable.instructor.user.fullName}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        No existing timetables for this room on selected date.
                                    </Alert>
                                )}

                                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                                    {t('timetable.createTimetable.selectPeriod', { defaultValue: 'Select Available Period' })}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                    {selectedRoomSchedule.availablePeriods.length > 0 ? (
                                        selectedRoomSchedule.availablePeriods.map((period, index) => (
                                            <Chip
                                                key={index}
                                                label={`Period ${period.start} - ${period.end}`}
                                                color="primary"
                                                variant={startLesson === period.start && endLesson === period.end ? 'filled' : 'outlined'}
                                                onClick={() => handlePeriodSelect(period.start, period.end)}
                                                sx={{ cursor: 'pointer' }}
                                            />
                                        ))
                                    ) : (
                                        <Typography color="error">
                                            {t('timetable.createTimetable.noAvailablePeriods', { defaultValue: 'No available periods' })}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>
                        )}

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth required variant="outlined">
                                <InputLabel>{t('timetable.createTimetable.startLesson', { defaultValue: 'Start Lesson' })}</InputLabel>
                                <Select
                                    value={startLesson}
                                    onChange={(e) => setStartLesson(e.target.value as number)}
                                    label={t('timetable.createTimetable.startLesson', { defaultValue: 'Start Lesson' })}
                                    disabled={!selectedRoomSchedule || selectedRoomSchedule.availablePeriods.length === 0}
                                >
                                    {periods.map((period, index) => (
                                        <MenuItem key={index} value={period}>
                                            Period {period}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth required variant="outlined">
                                <InputLabel>{t('timetable.createTimetable.endLesson', { defaultValue: 'End Lesson' })}</InputLabel>
                                <Select
                                    value={endLesson}
                                    onChange={(e) => handleEndLessonChange(e.target.value as number)}
                                    label={t('timetable.createTimetable.endLesson', { defaultValue: 'End Lesson' })}
                                    disabled={!selectedRoomSchedule || selectedRoomSchedule.availablePeriods.length === 0}
                                >
                                    {periods.map((period, index) => (
                                        <MenuItem key={index} value={period}>
                                            Period {period}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            {isTeacher ? (
                                <TextField
                                    label={t('timetable.createTimetable.instructor', { defaultValue: 'Instructor' })}
                                    value={user?.fullName || ''}
                                    fullWidth
                                    disabled
                                    variant="outlined"
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    helperText={t('timetable.createTimetable.instructorHelperText', {
                                        defaultValue: 'As a teacher, you can only create timetables for yourself'
                                    })}
                                />
                            ) : (
                                <InstructorAutocomplete
                                    selectedInstructorId={instructorId}
                                    setSelectedInstructorId={(id) => setInstructorId(id)}
                                />
                            )}
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label={t('timetable.createTimetable.description', { defaultValue: 'Description' })}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                required
                                multiline
                                rows={4}
                                variant="outlined"
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                        </Grid>

                        {error && (
                            <Grid size={{ xs: 12 }}>
                                <Typography color="error" variant="body2" align="center">
                                    {error}
                                </Typography>
                            </Grid>
                        )}

                        <Grid size={{ xs: 12 }}>
                            <SubmitButton
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={isLoading || isLoadingTimetables}
                            >
                                {isLoading
                                    ? t('timetable.createTimetable.submit_button', { defaultValue: 'Creating...' })
                                    : t('timetable.createTimetable.create_button', { defaultValue: 'Create Timetable' })
                                }
                            </SubmitButton>
                        </Grid>
                    </Grid>
                </form>

                <LoadingIndicator open={isLoading || isLoadingTimetables} />

                <CustomAlert
                    open={alertOpen}
                    onClose={handleCloseAlert}
                    message={alertMessage}
                    severity={alertSeverity}
                />
            </FormContainer>
        </LocalizationProvider>
    );
};

export default CreateTimetable;