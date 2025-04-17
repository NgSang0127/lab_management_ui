import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { RootState, AppDispatch } from '../../state/store';
import { getFourSemesterRecent, getRangeWeek } from '../../state/timetable/thunk.ts';
import { useTranslation } from 'react-i18next';
import calculateWeeks from '../../utils/calculateWeeks';
import { endOfDay, isWithinInterval, parse, startOfDay } from 'date-fns';
import { setSelectedSemesterId, setSelectedWeek } from '../../state/timetable/timetableSlice.ts';
import { SelectChangeEvent } from '@mui/material/Select';
import LoadingIndicator from "../support/LoadingIndicator.tsx";
import CustomAlert from "../support/CustomAlert.tsx";

interface Week {
    startDate: string;
    endDate: string;
}

interface SelectWeekProps {
    onWeekChange: (week: Week) => void;
}

const SelectWeek: React.FC<SelectWeekProps> = ({ onWeekChange }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { semesters, selectedSemesterId, weekRange, selectedWeek, isLoading, error } = useSelector(
        (state: RootState) => state.timetable
    );
    const shouldFetchSemesters = !isLoading && semesters.length === 0;

    const [alertOpen, setAlertOpen] = React.useState(false);

    // Fetch semesters on mount if not already fetched
    useEffect(() => {
        if (shouldFetchSemesters) {
            dispatch(getFourSemesterRecent());
        }
    }, [shouldFetchSemesters, dispatch]);

    // Fetch week range when semester is selected and weekRange is null
    useEffect(() => {
        if (selectedSemesterId && !weekRange) {
            dispatch(getRangeWeek({ semesterId: selectedSemesterId }));
        }
    }, [dispatch, selectedSemesterId, weekRange]);


    useEffect(() => {
        if (error) {
            setAlertOpen(true);
        }
    }, [error]);

    // Calculate weeks from weekRange
    const weeks = useMemo(() => {
        if (weekRange?.firstWeekStart && weekRange?.lastWeekEnd) {
            return calculateWeeks(weekRange.firstWeekStart, weekRange.lastWeekEnd);
        }
        return [];
    }, [weekRange]);

    // Auto-select current week if none is selected
    useEffect(() => {
        if (weeks.length > 0 && !selectedWeek) {
            const currentWeek = weeks.find((week) => {
                const startDate = startOfDay(parse(week.startDate, 'dd/MM/yyyy', new Date()));
                const endDate = endOfDay(parse(week.endDate, 'dd/MM/yyyy', new Date()));
                return isWithinInterval(new Date(), { start: startDate, end: endDate });
            }) || weeks[0]; // Fallback to first week
            if (currentWeek) {
                dispatch(setSelectedWeek(currentWeek));
                onWeekChange(currentWeek);
            }
        }
    }, [weeks, selectedWeek, dispatch, onWeekChange]);

    const handleSemesterChange = (event: SelectChangeEvent<number>) => {
        const newSemesterId = event.target.value as number;
        dispatch(setSelectedSemesterId(newSemesterId));
    };

    const handleWeekChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        const [startDate, endDate] = value.split('--').map((date) => date.trim());
        const newWeek = { startDate, endDate };
        dispatch(setSelectedWeek(newWeek));
        onWeekChange(newWeek);
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    if (isLoading) return <LoadingIndicator open={true} />;

    const selectedWeekValue = selectedWeek ? `${selectedWeek.startDate} -- ${selectedWeek.endDate}` : '';

    return (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="semester-label">{t('timetable.selectSemester.title')}</InputLabel>
                <Select
                    labelId="semester-label"
                    value={selectedSemesterId ?? ''}
                    onChange={handleSemesterChange}
                    label={t('timetable.selectSemester.title')}
                    disabled={semesters.length === 0}
                >
                    {semesters.map((semester) => (
                        <MenuItem key={semester.id} value={semester.id}>
                            {semester.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 200 }} disabled={weeks.length === 0}>
                <InputLabel id="week-label">{t('timetable.selectWeek.title')}</InputLabel>
                <Select
                    labelId="week-label"
                    value={selectedWeekValue}
                    onChange={handleWeekChange}
                    label={t('timetable.selectWeek.title')}
                >
                    {weeks.map((week, index) => (
                        <MenuItem
                            key={index}
                            value={`${week.startDate} -- ${week.endDate}`}
                            sx={{
                                '&.Mui-selected': { backgroundColor: 'brand.100', fontWeight: 'bold' },
                                '&:hover': { backgroundColor: 'brand.50' },
                            }}
                        >
                            {t('timetable.selectWeek.content', {
                                index: index + 1,
                                startDate: week.startDate,
                                endDate: week.endDate,
                            })}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <CustomAlert
                open={alertOpen}
                message={t('timetable.selectWeek.errors.week', { error }) || 'An error occurred'}
                severity="error"
                onClose={handleAlertClose}
            />
        </Box>
    );
};

export default React.memo(SelectWeek);