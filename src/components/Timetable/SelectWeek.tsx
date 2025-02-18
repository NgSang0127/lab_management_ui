import React, {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {CircularProgress, FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import {RootState, useAppDispatch} from '../../state/store';
import {getRangeWeek} from '../../state/Timetable/Reducer';
import {SelectChangeEvent} from "@mui/material/Select";
import calculateWeeks from "../../utils/calculateWeeks";
import {setSelectedWeek} from "../../state/Timetable/Action.ts";
import {endOfDay, isWithinInterval, parse, startOfDay} from 'date-fns';
import {useTranslation} from "react-i18next"; // Import từ date-fns

interface SelectWeekProps {
    onWeekChange: (week: { startDate: string, endDate: string }) => void;
    initialWeek: { startDate: string, endDate: string } | null;
}

const SelectWeek: React.FC<SelectWeekProps> = ({ onWeekChange, initialWeek }) => {
    const {t}=useTranslation();
    const dispatch = useAppDispatch();
    const { weekRange, selectedWeek, isLoading, error } = useSelector((state: RootState) => state.timetable);
    const [weeks, setWeeks] = React.useState<Array<{ startDate: string, endDate: string }>>([]);
    const initialized = useRef(false);

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
                dispatch(setSelectedWeek(initialWeek)); // Dispatch tuần được truyền từ parent
            } else if (!selectedWeek) {
                // Chọn tuần hiện tại lần đầu khi component mount nếu chưa có tuần nào được chọn
                const currentWeek = getCurrentWeek(calculatedWeeks);
                if (currentWeek) {
                    dispatch(setSelectedWeek(currentWeek));
                    onWeekChange(currentWeek);
                }
            }
        }
    }, [weekRange, weeks, onWeekChange, initialWeek, dispatch, selectedWeek]);

;

    //Tính toán lấy ra tuần hiện tại
    const getCurrentWeek = (weeks: Array<{ startDate: string, endDate: string }>) => {
        const today = new Date();

        return weeks.find(week => {
            const startDate = startOfDay(parse(week.startDate, 'dd/MM/yyyy', new Date()));
            const endDate = endOfDay(parse(week.endDate, 'dd/MM/yyyy', new Date()));


            return isWithinInterval(today, {start: startDate, end: endDate});
        });
    };



    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedWeekValue = event.target.value as string;
        const [startDate, endDate] = selectedWeekValue.split('--').map(date => date.trim());

        // Dispatch tuần được chọn vào Redux và gọi callback
        if (selectedWeek?.startDate !== startDate || selectedWeek?.endDate !== endDate) {
            const newSelectedWeek = { startDate, endDate };
            dispatch(setSelectedWeek(newSelectedWeek));
            onWeekChange(newSelectedWeek); // Callback để thay đổi tuần trong parent component
        }
    };

    // Chuyển selectedWeek thành chuỗi dạng "startDate -- endDate" để khớp với MenuItem value
    let selectedWeekValue = selectedWeek ? `${selectedWeek.startDate} -- ${selectedWeek.endDate}` : '';

    if (!weeks.find(week => `${week.startDate} -- ${week.endDate}` === selectedWeekValue)) {
        selectedWeekValue = '';
    }
    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <p>{t('timetable.selectWeek.errors.week')} {error}</p>;
    }

    return (
        <FormControl size="small">
            <InputLabel id="select-week-label">{t('timetable.selectWeek.title')}</InputLabel>
            <Select
                labelId="select-week-label"
                id="select-week"
                value={selectedWeekValue}  // Sử dụng selectedWeekValue với đúng định dạng
                onChange={handleChange}
                label="Select Week"
                variant="outlined"
            >
                {weeks.length > 0 ? (
                    weeks.map((week, index) => (
                        <MenuItem
                            key={index}
                            value={`${week.startDate} -- ${week.endDate}`}  // Sử dụng định dạng này cho value
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: '#73f8e7',
                                    fontWeight: 'bold',
                                    color: '#000203',
                                },
                                '&:hover': {
                                    backgroundColor: '#73f8e7',
                                },
                                fontWeight: selectedWeek?.startDate === week.startDate ? 'bold' : 'normal',
                            }}
                        >
                            {t('timetable.selectWeek.content',{index:index+1,startDate:week.startDate,endDate:week.endDate})}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>{t('timetable.selectWeek.no_data')}</MenuItem>
                )}
            </Select>
        </FormControl>
    );
};

export default SelectWeek;
