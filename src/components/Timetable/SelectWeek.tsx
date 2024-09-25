import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { RootState, useAppDispatch } from '../../state/store.ts';
import { getRangeWeek } from '../../state/Timetable/Reducer.ts';
import { SelectChangeEvent } from "@mui/material/Select";
import calculateWeeks from "../../utils/calculateWeeks.ts";

interface SelectWeekProps {
    onWeekChange: (week: { startDate: string, endDate: string }) => void;
    initialWeek: { startDate: string, endDate: string } | null; // Thêm initialWeek từ parent
}

const SelectWeek: React.FC<SelectWeekProps> = ({ onWeekChange, initialWeek }) => {
    const dispatch = useAppDispatch();
    const { weekRange, isLoading, error } = useSelector((state: RootState) => state.timetable);
    const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
    const [weeks, setWeeks] = useState<Array<{ startDate: string, endDate: string }>>([]);
    const initialized = useRef(false); // Biến đánh dấu khởi tạo

    // Chỉ gọi getRangeWeek khi component lần đầu được mount
    useEffect(() => {
        if (!initialized.current && (!weekRange?.firstWeekStart || !weekRange?.lastWeekEnd)) {
            dispatch(getRangeWeek());
            initialized.current = true;
        }
    }, [dispatch, weekRange?.firstWeekStart, weekRange?.lastWeekEnd]);

    // Tính toán và thiết lập danh sách tuần khi weekRange thay đổi
    useEffect(() => {
        if (weekRange?.firstWeekStart && weekRange?.lastWeekEnd && weeks.length === 0) {
            const calculatedWeeks = calculateWeeks(weekRange.firstWeekStart, weekRange.lastWeekEnd);
            setWeeks(calculatedWeeks);

            // Nếu có initialWeek từ parent, sử dụng tuần đó, không reset
            if (initialWeek) {
                setSelectedWeek(`${initialWeek.startDate} -- ${initialWeek.endDate}`);
            } else {
                // Chọn tuần hiện tại lần đầu khi component mount
                const currentWeek = getCurrentWeek(calculatedWeeks);
                if (currentWeek) {
                    const currentWeekValue = `${currentWeek.startDate} -- ${currentWeek.endDate}`;
                    setSelectedWeek(currentWeekValue);
                    onWeekChange(currentWeek);  // Callback để thay đổi tuần trong parent component
                }
            }
        }
    }, [weekRange, weeks, onWeekChange, initialWeek]);

    // Tìm tuần hiện tại dựa trên ngày hiện tại
    const getCurrentWeek = (weeks: Array<{ startDate: string, endDate: string }>) => {
        const today = new Date();
        return weeks.find(week => {
            const startDate = new Date(week.startDate.split('/').reverse().join('/'));
            const endDate = new Date(week.endDate.split('/').reverse().join('/'));
            return today >= startDate && today <= endDate;
        });
    };


    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedWeekValue = event.target.value as string;
        const [startDate, endDate] = selectedWeekValue.split('--').map(date => date.trim());

        // Chỉ cập nhật tuần nếu tuần được chọn khác với tuần hiện tại
        if (selectedWeek !== selectedWeekValue) {
            setSelectedWeek(selectedWeekValue);
            onWeekChange({ startDate, endDate });
        }
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <p>Có lỗi xảy ra khi tải dữ liệu tuần: {error}</p>;
    }

    return (
        <FormControl size="small">
            <InputLabel id="select-week-label">Chọn Tuần</InputLabel>
            <Select
                labelId="select-week-label"
                id="select-week"
                value={selectedWeek || ''}
                onChange={handleChange}
                label="Chọn Tuần"
                variant="outlined"
            >
                {weeks.length > 0 ? (
                    weeks.map((week, index) => (
                        <MenuItem
                            key={index}
                            value={`${week.startDate} -- ${week.endDate}`}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: '#2bcdd3',  // Màu nền khi tuần được chọn
                                    fontWeight: 'bold',            // Chữ in đậm khi được chọn
                                    color: '#011f31',              // Màu chữ khi được chọn
                                },
                                '&:hover': {
                                    backgroundColor: '#73f8e7',  // Màu nền khi hover vào tuần
                                },
                                fontWeight: selectedWeek === `${week.startDate} -- ${week.endDate}` ? 'bold' : 'normal', // Định dạng in đậm nếu được chọn
                            }}
                        >
                            {`Tuần ${index + 1} [Từ ${week.startDate} -- Đến ${week.endDate}]`}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>Không có dữ liệu tuần</MenuItem>
                )}
            </Select>
        </FormControl>
    );
};

export default SelectWeek;
