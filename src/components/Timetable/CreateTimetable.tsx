import React, { useState } from 'react';
import { TextField, Button, MenuItem, FormControl, Select, CircularProgress, Typography, InputLabel, Snackbar } from '@mui/material';
import { RootState, useAppDispatch } from '../../state/store';
import { createTimetable } from '../../state/Timetable/Reducer';
import { useSelector } from "react-redux";
import {periods, rooms} from "../../utils/utilsTimetable";

const CreateTimetable: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading, error } = useSelector((state: RootState) => state.timetable);

    // Các state để lưu thông tin form
    const [timetableName, setTimetableName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [startLesson, setStartLesson] = useState<number | ''>('');
    const [endLesson, setEndLesson] = useState<number | ''>('');
    const [date, setDate] = useState('');
    const [instructorId, setInstructorId] = useState('');
    const [description, setDescription] = useState('');
    const [isLoadingLocal, setIsLoadingLocal] = useState(false); // Local loading state for submitting
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Hàm để mở snackbar với thông báo
    const handleSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    // Hàm đóng Snackbar
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    // Hàm xử lý sự kiện submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Kiểm tra các trường trước khi gửi
        if (!timetableName || !roomName || startLesson === '' || endLesson === '' || !date || !instructorId || !description) {
            handleSnackbar('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        // Kiểm tra logic tiết bắt đầu và tiết kết thúc
        if (Number(startLesson) >= Number(endLesson)) {
            handleSnackbar('Tiết kết thúc phải sau tiết bắt đầu.');
            return;
        }

        setIsLoadingLocal(true);
        // Tạo object timetable để gửi lên server
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
            // Gọi dispatch để tạo thời khóa biểu
            await dispatch(createTimetable(timetableData)).unwrap(); // unwrap để nhận error từ createAsyncThunk
            handleSnackbar('Tạo thời khóa biểu thành công!');
            // Reset form
            setTimetableName('');
            setRoomName('');
            setStartLesson('');
            setEndLesson('');
            setDate('');
            setInstructorId('');
            setDescription('');
        } catch (error) {
            handleSnackbar(`Có lỗi xảy ra khi tạo thời khóa biểu: ${error}`);
        } finally {
            setIsLoadingLocal(false);
        }
    };

    // Hàm xử lý khi chọn tiết kết thúc
    const handleEndLessonChange = (value: number) => {
        if (startLesson !== '' && value <= Number(startLesson)) {
            handleSnackbar('Tiết kết thúc phải lớn hơn tiết bắt đầu.');
            setEndLesson('');
        } else {
            setEndLesson(value);
        }
    };

    return (
        <div className="container mx-auto px-6 py-10">
            <Typography variant="h4" className="text-center font-bold mb-8 text-blue-700">Tạo Thời Khóa Biểu</Typography>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg p-6 space-y-4">
                <TextField
                    label="Tên thời khóa biểu"
                    value={timetableName}
                    onChange={(e) => setTimetableName(e.target.value)}
                    fullWidth
                    required
                />

                {/* Select for roomName */}
                <FormControl fullWidth>
                    <InputLabel>Phòng học</InputLabel>
                    <Select
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value as string)}
                        required
                        variant="outlined">
                        {rooms.map((room, index) => (
                            <MenuItem key={index} value={room}>
                                {room}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Select for startLesson */}
                <FormControl fullWidth>
                    <InputLabel>Tiết bắt đầu</InputLabel>
                    <Select
                        value={startLesson}
                        onChange={(e) => setStartLesson(e.target.value as number)}
                        required
                        variant="outlined">
                        {periods.map((period, index) => (
                            <MenuItem key={index} value={period}>
                                {`Tiết ${period}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Select for endLesson */}
                <FormControl fullWidth>
                    <InputLabel>Tiết kết thúc</InputLabel>
                    <Select
                        value={endLesson}
                        onChange={(e) => handleEndLessonChange(e.target.value as number)}
                        required
                        variant="outlined">
                        {periods.map((period, index) => (
                            <MenuItem key={index} value={period}>
                                {`Tiết ${period}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Ngày"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    label="Mã giảng viên"
                    value={instructorId}
                    onChange={(e) => setInstructorId(e.target.value)}
                    fullWidth
                    required
                />

                <TextField
                    label="Mô tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    required
                />

                {/* Loading spinner */}
                {isLoadingLocal && <CircularProgress />}

                {/* Hiển thị lỗi nếu có */}
                {error && <Typography color="error">{error}</Typography>}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isLoadingLocal}
                >
                    {isLoadingLocal ? <CircularProgress size={24} /> : 'Tạo Thời Khóa Biểu'}
                </Button>
            </form>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
            />
        </div>
    );
};

export default CreateTimetable;
