import React, { useState } from 'react';
import {
    TextField,
    Button,
    MenuItem,
    FormControl,
    Select,
    Typography,
    InputLabel,
} from '@mui/material';
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from '../../state/store';
import { createTimetable } from '../../state/Timetable/Reducer';
import { periods, rooms } from "../../utils/utilsTimetable";
import LoadingIndicator from "../Support/LoadingIndicator.tsx";
import CustomAlert from "../Support/CustomAlert.tsx";


const CreateTimetable: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading, error } = useSelector((state: RootState) => state.timetable);

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
            handleAlert('Please fill in all the required fields.', 'error');
            return;
        }

        if (Number(startLesson) >= Number(endLesson)) {
            handleAlert('End lesson must be after start lesson.', 'error');
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
            await dispatch(createTimetable(timetableData)).unwrap();
            handleAlert('Timetable created successfully!', 'success');
            // Reset form
            setTimetableName('');
            setRoomName('');
            setStartLesson('');
            setEndLesson('');
            setDate('');
            setInstructorId('');
            setDescription('');
        } catch (err: any) {
            handleAlert(`Error creating timetable: ${err.message || err}`, 'error');
        }
    };

    // Handle end lesson change with validation
    const handleEndLessonChange = (value: number) => {
        if (startLesson !== '' && value <= Number(startLesson)) {
            handleAlert('End lesson must be greater than start lesson.', 'error');
            setEndLesson('');
        } else {
            setEndLesson(value);
        }
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px' }}>
            <Typography variant="h4" align="center" gutterBottom color="primary">
                Create Timetable
            </Typography>
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                <TextField
                    label="Timetable Name"
                    value={timetableName}
                    onChange={(e) => setTimetableName(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                />

                {/* Room Selection */}
                <FormControl fullWidth required margin="normal">
                    <InputLabel>Room</InputLabel>
                    <Select
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value as string)}
                        label="Room"
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
                    <InputLabel>Start Lesson</InputLabel>
                    <Select
                        value={startLesson}
                        onChange={(e) => setStartLesson(e.target.value as number)}
                        label="Start Lesson"
                    >
                        {periods.map((period, index) => (
                            <MenuItem key={index} value={period}>
                                {`Lesson ${period}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* End Lesson Selection */}
                <FormControl fullWidth required margin="normal">
                    <InputLabel>End Lesson</InputLabel>
                    <Select
                        value={endLesson}
                        onChange={(e) => handleEndLessonChange(e.target.value as number)}
                        label="End Lesson"
                    >
                        {periods.map((period, index) => (
                            <MenuItem key={index} value={period}>
                                {`Lesson ${period}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Date Selection */}
                <TextField
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                    slotProps={{
                        inputLabel:{
                        shrink: true,
                    }}}
                />

                {/* Instructor ID */}
                <TextField
                    label="Instructor ID"
                    value={instructorId}
                    onChange={(e) => setInstructorId(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                />

                {/* Description */}
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    required
                    multiline
                    rows={4}
                    margin="normal"
                />

                {/* Loading Indicator */}
                <LoadingIndicator open={isLoading} />

                {/* Error Message */}
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
                    style={{ marginTop: '20px' }}
                >
                    {isLoading ? 'Submitting...' : 'Create Timetable'}
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
    );

};

export default CreateTimetable;