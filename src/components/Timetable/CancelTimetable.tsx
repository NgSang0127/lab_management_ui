import { Button, TextField, MenuItem, Select, FormControl, InputLabel, CircularProgress, Typography, Snackbar, Alert } from '@mui/material';
import { RootState, useAppDispatch } from '../../state/store.ts';
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchTimetableByDate, cancelTimetable } from "../../state/Timetable/Reducer.ts";
import {useNavigate} from "react-router-dom"; // API để lấy và hủy timetable
import { format } from 'date-fns';

const CancelTimetable: React.FC = () => {
    const navigate=useNavigate();
    const dispatch = useAppDispatch();
    const { timetables, isLoading, error } = useSelector((state: RootState) => state.timetable);
    const [cancelDate, setCancelDate] = useState<string>('');
    const [selectedTimetable, setSelectedTimetable] = useState<number | null>(null);

    // Trạng thái cho Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');  // Loại thông báo

    // Khi người dùng thay đổi ngày, sẽ gọi API để lấy các thời khóa biểu của ngày đó
    useEffect(() => {
        if (cancelDate) {  // Chỉ gọi API khi có giá trị cancelDate
            dispatch(fetchTimetableByDate({ date: cancelDate }));
        }
    }, [cancelDate, dispatch]);

    // Xử lý hủy lịch học
    const handleCancel = async () => {
        if (selectedTimetable) {
            const selectedTimetableDetails = timetables.find(t => t.id === selectedTimetable);

            if (selectedTimetableDetails) {
                const formattedCancelDate = format(new Date(cancelDate), 'dd/MM/yyyy');

                const result = await dispatch(cancelTimetable({
                    cancelDate: formattedCancelDate,  // Sử dụng ngày đã được định dạng
                    startLesson: selectedTimetableDetails.startLesson,
                    roomName: selectedTimetableDetails.room.name,
                    timetableId: selectedTimetableDetails.id
                }));

                if (cancelTimetable.fulfilled.match(result)) {
                    setSnackbarMessage('Hủy thành công!');
                    setSnackbarSeverity('success');
                    navigate("/timetable/by-week");
                } else {
                    setSnackbarMessage('Hủy thất bại, vui lòng thử lại!');
                    setSnackbarSeverity('error');
                }

                setSnackbarOpen(true);  // Mở Snackbar để hiển thị thông báo
            }
        } else {
            setSnackbarMessage('Vui lòng chọn môn học cần hủy');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);  // Mở Snackbar để hiển thị thông báo lỗi
        }
    };

    // Đóng Snackbar
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Hủy Lịch Học</Typography>

            {/* Input để chọn ngày */}
            <TextField
                label="Ngày cần hủy"
                type="date"
                value={cancelDate}
                onChange={(e) => setCancelDate(e.target.value)}
                fullWidth
                slotProps={{
                    inputLabel: {
                        shrink: true,
                    }}}
                margin="normal"
            />

            {cancelDate && (
                <>
                    {isLoading ? (
                        <CircularProgress />
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Môn học</InputLabel>
                            <Select
                                value={selectedTimetable || ''}
                                onChange={(e) => setSelectedTimetable(Number(e.target.value))}
                             variant="filled">
                                {timetables.map((timetable) => (
                                    <MenuItem key={timetable.id} value={timetable.id}>
                                        {`Môn: ${timetable.courses[0].name} - Phòng: ${timetable.room.name} - Tiết bắt đầu: ${timetable.startLesson}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </>
            )}

            {/* Nút Hủy Lịch */}
            <Button
                variant="contained"
                color="primary"
                onClick={handleCancel}
                fullWidth
                style={{ marginTop: '20px' }}
                disabled={!cancelDate}
            >
                Hủy Lịch Học
            </Button>

            {/* Snackbar thông báo */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default CancelTimetable;
