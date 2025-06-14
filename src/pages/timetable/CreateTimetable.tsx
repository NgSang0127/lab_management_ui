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
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../state/store.ts';
import { createTimetable } from '../../state/timetable/thunk.ts';
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
import Semester from '../semester/Semester.tsx';
import i18n from 'i18next'; // Import i18n để thay đổi ngôn ngữ

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

const CreateTimetable: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { isLoading, error } = useSelector((state: RootState) => state.timetable);

    // Form state
    const [timetableName, setTimetableName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [startLesson, setStartLesson] = useState<number | ''>('');
    const [endLesson, setEndLesson] = useState<number | ''>('');
    const [date, setDate] = useState<Date | null>(null);
    const [instructorId, setInstructorId] = useState<number | null>(null);
    const [description, setDescription] = useState('');
    const [semesterId, setSemesterId] = useState<number | ''>('');

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

    const [currentLocale, setCurrentLocale] = useState<Locale>(
        localeMap[localStorage.getItem('language') || 'en'] || enUS
    );

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'en';
        i18n.changeLanguage(savedLanguage);
        setCurrentLocale(localeMap[savedLanguage] || enUS);

        const handleStorageChange = () => {
            const newLanguage = localStorage.getItem('language') || 'en';
            i18n.changeLanguage(newLanguage);
            setCurrentLocale(localeMap[newLanguage] || enUS);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const loadSemesters = async () => {
            setIsLoadingSemesters(true);
            try {
                const response = await fetchSemesters(0, 10);
                setSemesters(response.content);
            } catch (err: any) {
                handleAlert(t('timetable.createTimetable.errors.fetchSemesters', { error: err.message || err }), 'error');
            } finally {
                setIsLoadingSemesters(false);
            }
        };
        loadSemesters();
    }, [t]);

    // Function to open alert
    const handleAlert = (message: string, severity: 'success' | 'error') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!timetableName || !roomName || startLesson === '' || endLesson === '' || !date || !instructorId || !description) {
            handleAlert(t('timetable.createTimetable.errors.allFields'), 'error');
            return;
        }

        if (Number(startLesson) >= Number(endLesson)) {
            handleAlert(t('timetable.createTimetable.errors.startLesson_big_endLesson'), 'error');
            return;
        }

        // Format date to YYYY-MM-DD
        const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';

        // Prepare data
        const timetableData = {
            timetableName,
            roomName,
            startLesson: Number(startLesson),
            endLesson: Number(endLesson),
            date: formattedDate,
            instructorId: String(instructorId),
            description,
            semesterId: semesterId !== '' ? Number(semesterId) : undefined,
        };

        try {
            // @ts-ignore
            await dispatch(createTimetable(timetableData)).unwrap();
            handleAlert(t('timetable.createTimetable.success.create'), 'success');
            // Reset form
            setTimetableName('');
            setRoomName('');
            setStartLesson('');
            setEndLesson('');
            setDate(null);
            setInstructorId(null);
            setDescription('');
            setSemesterId('');
        } catch (err: any) {
            handleAlert(t('timetable.createTimetable.errors.allFields', { error: err.message || err }), 'error');
        }
    };

    // Handle end lesson change with validation
    const handleEndLessonChange = (value: number) => {
        if (startLesson !== '' && value <= Number(startLesson)) {
            handleAlert(t('timetable.createTimetable.errors.startLesson_big_endLesson'), 'error');
            setEndLesson('');
        } else {
            setEndLesson(value);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={currentLocale}>
            <Helmet>
                <title>Create Timetable | Lab Management IT</title>
            </Helmet>
            <FormContainer>
                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: 700, color: 'primary.main', mb: 4 }}
                >
                    {t('timetable.createTimetable.title')}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label={t('timetable.createTimetable.name')}
                                value={timetableName}
                                onChange={(e) => setTimetableName(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth variant="outlined">
                                <SemesterAutocomplete
                                    selectedSemesterId={semesterId as number}
                                    setSelectedSemesterId={(id) => setSemesterId(id)}
                                />
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth required variant="outlined">
                                <InputLabel>{t('timetable.createTimetable.room')}</InputLabel>
                                <Select
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value as string)}
                                    label={t('timetable.createTimetable.room')}
                                >
                                    {rooms.map((room, index) => (
                                        <MenuItem key={index} value={room}>
                                            {room}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth required variant="outlined">
                                <InputLabel>{t('timetable.createTimetable.startLesson')}</InputLabel>
                                <Select
                                    value={startLesson}
                                    onChange={(e) => setStartLesson(e.target.value as number)}
                                    label={t('timetable.createTimetable.startLesson')}
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
                                <InputLabel>{t('timetable.createTimetable.endLesson')}</InputLabel>
                                <Select
                                    value={endLesson}
                                    onChange={(e) => handleEndLessonChange(e.target.value as number)}
                                    label={t('timetable.createTimetable.endLesson')}
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
                            <DatePicker
                                label={t('timetable.createTimetable.date')}
                                value={date}
                                onChange={(newValue) => setDate(newValue)}
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

                        <Grid size={{ xs: 12 }}>
                            <InstructorAutocomplete
                                selectedInstructorId={instructorId}
                                setSelectedInstructorId={(id) => setInstructorId(id)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label={t('timetable.createTimetable.description')}
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
                                disabled={isLoading || isLoadingSemesters}
                            >
                                {isLoading ? t('timetable.createTimetable.submit_button') : t('timetable.createTimetable.create_button')}
                            </SubmitButton>
                        </Grid>
                    </Grid>
                </form>

                <LoadingIndicator open={isLoading || isLoadingSemesters} />

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