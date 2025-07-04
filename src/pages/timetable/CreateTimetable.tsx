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
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../state/store.ts';
import { createTimetable, fetchTimetableByDateAndRoom } from '../../state/timetable/thunk.ts';
import { periods, rooms } from '../../utils/utilsTimetable.ts';
import LoadingIndicator from '../../components/support/LoadingIndicator.tsx';
import CustomAlert from '../../components/support/CustomAlert.tsx';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { fetchSemesters } from '../../services/semester/semesterApi.ts';
import InstructorAutocomplete from '../../components/semester/InstructorAutocomplete.tsx';
import SemesterAutocomplete from '../../components/semester/SemesterAutocomplete.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, Locale } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import i18n from 'i18next';
import { Timetable } from '../../state/timetable/timetableSlice.ts';
import PendingTimetablePanel from './PendingTimetablePanel'; // Import component mới

const FormContainer = styled(Box)(({ theme }) => ({
    maxWidth: '800px',
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

interface Semester {
    id: number;
    name: string;
    academicYear: string;
    startDate: string;
    endDate: string;
}

const CreateTimetable: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { isLoading, error } = useSelector((state: RootState) => state.timetable);
    const { user } = useSelector((state: RootState) => state.auth);

    // Form state
    const [timetableName, setTimetableName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [startLesson, setStartLesson] = useState<number | ''>('');
    const [endLesson, setEndLesson] = useState<number | ''>('');
    const [date, setDate] = useState<Date | null>(null);
    const [instructorId, setInstructorId] = useState<number | null>(null);
    const [description, setDescription] = useState('');
    const [semesterId, setSemesterId] = useState<number | ''>('');
    const [existingTimetables, setExistingTimetables] = useState<Timetable[]>([]);
    const [isLoadingTimetables, setIsLoadingTimetables] = useState(false);

    // Semester state
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [isLoadingSemesters, setIsLoadingSemesters] = useState(false);

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

    useEffect(() => {
        const loadSemesters = async () => {
            setIsLoadingSemesters(true);
            try {
                const response = await fetchSemesters(0, 10);
                setSemesters(response.content);
            } catch (err: any) {
                handleAlert(t('timetable.createTimetable.errors.fetchSemesters', {
                    error: err.message || err,
                    defaultValue: 'Failed to load semesters: {{error}}'
                }), 'error');
            } finally {
                setIsLoadingSemesters(false);
            }
        };
        loadSemesters();
    }, [t]);

    useEffect(() => {
        const loadTimetables = async () => {
            if (date && roomName) {
                setIsLoadingTimetables(true);
                try {
                    const formattedDate = format(date, 'yyyy-MM-dd');
                    const action = await dispatch(fetchTimetableByDateAndRoom({ date: formattedDate, roomName }));
                    const timetables = action.payload as Timetable[];
                    setExistingTimetables(timetables);
                } catch (err: any) {
                    handleAlert(t('timetable.createTimetable.errors.fetchTimetables', {
                        error: err.message || err,
                        defaultValue: 'Failed to load timetables: {{error}}'
                    }), 'error');
                } finally {
                    setIsLoadingTimetables(false);
                }
            } else {
                setExistingTimetables([]);
            }
        };
        loadTimetables();
    }, [date, roomName, dispatch, t]);

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

    const getAvailablePeriods = () => {
        const totalPeriods = 16;
        const bookedPeriods: boolean[] = new Array(totalPeriods).fill(false);

        existingTimetables.forEach((timetable) => {
            for (let i = timetable.startLesson; i <= timetable.endLessonTime.lessonNumber; i++) {
                bookedPeriods[i - 1] = true;
            }
        });

        const availablePeriods: { start: number; end: number }[] = [];
        let start = 1;
        for (let i = 0; i < totalPeriods; i++) {
            if (!bookedPeriods[i]) {
                if (i === 0 || bookedPeriods[i - 1]) start = i + 1;
                if (i === totalPeriods - 1 || bookedPeriods[i + 1]) availablePeriods.push({ start, end: i + 1 });
            }
        }
        return availablePeriods;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!timetableName || !roomName || startLesson === '' || endLesson === '' || !date || !instructorId || !description || !semesterId) {
            handleAlert(t('timetable.createTimetable.errors.allFields', { defaultValue: 'Please fill in all required fields' }), 'error');
            return;
        }

        if (Number(startLesson) >= Number(endLesson)) {
            handleAlert(t('timetable.createTimetable.errors.startLesson_big_endLesson', { defaultValue: 'Start lesson must be less than end lesson' }), 'error');
            return;
        }

        const isConflict = existingTimetables.some(
            (timetable) => timetable.startLesson <= Number(endLesson) && timetable.endLessonTime.lessonNumber >= Number(startLesson)
        );
        if (isConflict) {
            handleAlert(t('timetable.createTimetable.errors.conflict', { defaultValue: 'Time conflict with existing timetable' }), 'error');
            return;
        }

        const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
        const timetableData = {
            timetableName,
            roomName,
            startLesson: Number(startLesson),
            endLesson: Number(endLesson),
            date: formattedDate,
            instructorId: String(instructorId),
            description,
            semesterId: Number(semesterId),
        };

        try {
            // @ts-ignore
            await dispatch(createTimetable(timetableData)).unwrap();
            handleAlert(t('timetable.createTimetable.success.create', { defaultValue: 'Timetable created successfully' }), 'success');
            setTimetableName('');
            setRoomName('');
            setStartLesson('');
            setEndLesson('');
            setDate(null);
            // Don't reset instructorId for teachers
            if (!isTeacher) {
                setInstructorId(null);
            }
            setDescription('');
            setSemesterId('');
            setExistingTimetables([]);
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

    const handlePeriodSelect = (start: number, end: number) => {
        setStartLesson(start);
        setEndLesson(end);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={currentLocale}>
            <Helmet>
                <title>Create Timetable | Lab Management IT</title>
            </Helmet>
            <PendingTimetablePanel/>
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
                    Select a date and timetable to book
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

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth required variant="outlined">
                                <SemesterAutocomplete
                                    selectedSemesterId={semesterId as number}
                                    setSelectedSemesterId={(id) => setSemesterId(id)}
                                />
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth required variant="outlined">
                                <InputLabel>{t('timetable.createTimetable.room', { defaultValue: 'Room' })}</InputLabel>
                                <Select
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value as string)}
                                    label={t('timetable.createTimetable.room', { defaultValue: 'Room' })}
                                >
                                    {rooms.map((room, index) => (
                                        <MenuItem key={index} value={room}>
                                            {room}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <DatePicker
                                format="dd/MM/yyyy"
                                label={t('timetable.createTimetable.date', { defaultValue: 'Date' })}
                                value={date}
                                onChange={(newValue) => {
                                    setDate(newValue);
                                    setStartLesson('');
                                    setEndLesson('');
                                }}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        required: true,
                                        variant: 'outlined',
                                        slotProps: { inputLabel: { shrink: true } },
                                    },
                                }}
                            />
                        </Grid>

                        {date && roomName && (
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                    {t('timetable.createTimetable.schedule', { defaultValue: 'Current Schedule' })}
                                </Typography>
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
                                            {existingTimetables.map((timetable) => (
                                                <TableRow key={timetable.id}>
                                                    <TableCell>{getTimetableDisplayName(timetable)}</TableCell>
                                                    <TableCell>{timetable.startLesson}</TableCell>
                                                    <TableCell>{timetable.endLessonTime.lessonNumber}</TableCell>
                                                    <TableCell>
                                                        {
                                                            timetable.instructor.user.fullName
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                                    {t('timetable.createTimetable.availablePeriods', { defaultValue: 'Available Periods' })}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                    {getAvailablePeriods().length > 0 ? (
                                        getAvailablePeriods().map((period, index) => (
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
                                    disabled={getAvailablePeriods().length === 0}
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
                                    disabled={getAvailablePeriods().length === 0}
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
                                disabled={isLoading || isLoadingSemesters || isLoadingTimetables}
                            >
                                {isLoading
                                    ? t('timetable.createTimetable.submit_button', { defaultValue: 'Creating...' })
                                    : t('timetable.createTimetable.create_button', { defaultValue: 'Create Timetable' })
                                }
                            </SubmitButton>
                        </Grid>
                    </Grid>
                </form>

                <LoadingIndicator open={isLoading || isLoadingSemesters || isLoadingTimetables} />

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