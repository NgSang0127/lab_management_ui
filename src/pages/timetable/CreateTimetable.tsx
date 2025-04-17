import React, {useState} from 'react';
import {
    TextField,
    Button,
    MenuItem,
    FormControl,
    Select,
    Typography,
    InputLabel,
} from '@mui/material';
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from '../../state/store.ts';
import {createTimetable} from '../../state/timetable/thunk.ts';
import {periods, rooms} from "../../utils/utilsTimetable.ts";
import LoadingIndicator from "../../components/support/LoadingIndicator.tsx";
import CustomAlert from "../../components/support/CustomAlert.tsx";
import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet-async";


const CreateTimetable: React.FC = () => {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const {isLoading, error} = useSelector((state: RootState) => state.timetable);

    // Form state
    const [timetableName, setTimetableName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [startLesson, setStartLesson] = useState<number | ''>('');
    const [endLesson, setEndLesson] = useState<number | ''>('');
    const [date, setDate] = useState('');
    const [instructorId, setInstructorId] = useState('');
    const [description, setDescription] = useState('');

    // Alert state
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

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

        // Prepare data
        const timetableData = {
            timetableName,
            roomName,
            startLesson: Number(startLesson),
            endLesson: Number(endLesson),
            date,
            instructorId,
            description,
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
            setDate('');
            setInstructorId('');
            setDescription('');
        } catch (err: any) {
            handleAlert((t('timetable.createTimetable.errors.allFields', {error: (err.message || err)})), 'error');
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
        <>
            <Helmet>
                <title>Create Timetable | Lab Management IT</title>
            </Helmet>
            <div style={{maxWidth: '700px', margin: '0 auto', padding: '40px 20px'}}>
                <Typography variant="h4" align="center" gutterBottom color="primary">
                    {t('timetable.createTimetable.title')}
                </Typography>
                <form onSubmit={handleSubmit} style={{
                    backgroundColor: 'background.default',
                    padding: '30px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                    <TextField
                        label={t('timetable.createTimetable.name')}
                        value={timetableName}
                        onChange={(e) => setTimetableName(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />

                    {/* Room Selection */}
                    <FormControl fullWidth required margin="normal">
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

                    {/* Start Lesson Selection */}
                    <FormControl fullWidth required margin="normal">
                        <InputLabel>{t('timetable.createTimetable.startLesson')}</InputLabel>
                        <Select
                            value={startLesson}
                            onChange={(e) => setStartLesson(e.target.value as number)}
                            label={t('timetable.createTimetable.startLesson')}
                        >
                            {periods.map((period, index) => (
                                <MenuItem key={index} value={period}>
                                    {t('timetable.createTimetable.period')} {period}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* End Lesson Selection */}
                    <FormControl fullWidth required margin="normal">
                        <InputLabel>{t('timetable.createTimetable.endLesson')}</InputLabel>
                        <Select
                            value={endLesson}
                            onChange={(e) => handleEndLessonChange(e.target.value as number)}
                            label={t('timetable.createTimetable.endLesson')}
                        >
                            {periods.map((period, index) => (
                                <MenuItem key={index} value={period}>
                                    {t('timetable.createTimetable.period')} {period}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Date Selection */}
                    <TextField
                        label={t('timetable.createTimetable.date')}
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            }
                        }}
                    />

                    {/* Instructor ID */}
                    <TextField
                        label={t('timetable.createTimetable.instructorId')}
                        value={instructorId}
                        onChange={(e) => setInstructorId(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />

                    {/* Description */}
                    <TextField
                        label={t('timetable.createTimetable.description')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        required
                        multiline
                        rows={4}
                        margin="normal"
                    />

                    {/* Loading Indicator */}
                    <LoadingIndicator open={isLoading}/>

                    {/* error Message */}
                    {error && (
                        <Typography color="error" variant="body2" align="center">
                            {error}
                        </Typography>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={isLoading}
                        style={{marginTop: '20px'}}
                    >
                        {isLoading ? t('timetable.createTimetable.submit_button') : t('timetable.createTimetable.create_button')}
                    </Button>
                </form>

                {/* Custom Alert for Notifications */}
                <CustomAlert
                    open={alertOpen}
                    onClose={handleCloseAlert}
                    message={alertMessage}
                    severity={alertSeverity}
                />
            </div>
        </>
    );

};

export default CreateTimetable;