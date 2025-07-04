import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText, CircularProgress,
} from '@mui/material';
import { parse, addDays, isSameDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import ScheduleHeader from '../../components/timetable/ScheduleHeader.tsx';
import ScheduleBody from '../../components/timetable/ScheduleBody.tsx';
import '../../components/timetable/Schedule.css';
import '../../components/timetable/Tooltip.css';
import { fetchRooms, RoomResponse } from '../../services/asset/roomApi.ts';
import { AppDispatch, RootState } from '../../state/store.ts';
import { fetchTimetables } from '../../state/timetable/thunk.ts';
import { setSelectedWeek } from '../../state/timetable/timetableSlice.ts';
import SelectWeek from '../../components/timetable/SelectWeek.tsx';
import useConvertDayOfWeek from '../../utils/convertDay.ts';
import { periods } from '../../utils/utilsTimetable.ts';
import { fetchLessonTimes } from '../../state/lessonTime/thunk.ts';
import { SelectChangeEvent } from '@mui/material/Select';
import CustomAlert from '../../components/support/CustomAlert.tsx';
import {Helmet} from "react-helmet-async";

const ScheduleTable: React.FC = () => {
    const { t } = useTranslation();
    const { convertDayOfWeek } = useConvertDayOfWeek();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { selectedWeek, timetables, isLoading: isLoadingTimetables, error: errorTimetables } = useSelector(
        (state: RootState) => state.timetable
    );
    const { lessonTimes, isLoading: isLoadingLessonTimes, error: errorLessonTimes } = useSelector(
        (state: RootState) => state.lessonTime
    );

    const [rooms, setRooms] = React.useState<RoomResponse[]>([]);
    const [selectedRooms, setSelectedRooms] = React.useState<string[]>([]);
    const [isLoadingRooms, setIsLoadingRooms] = React.useState(false);
    const [errorRooms, setErrorRooms] = React.useState<string | null>(null);
    const [alertOpen, setAlertOpen] = useState(false); // State cho CustomAlert

    // Fetch initial data (rooms and lesson times)
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoadingRooms(true);
            try {
                const roomResponse = await fetchRooms(0, 50);
                if (roomResponse.content) {
                    setRooms(roomResponse.content);
                    setSelectedRooms(roomResponse.content.map((room) => room.name));
                }
                dispatch(fetchLessonTimes());
            } catch (error) {
                setErrorRooms(
                    t('timetable.scheduleTable.errors.rooms', {
                        error: error instanceof Error ? error.message : 'Unknown error',
                    })
                );
                setAlertOpen(true); // Mở alert khi có lỗi
            } finally {
                setIsLoadingRooms(false);
            }
        };
        loadInitialData();
    }, [dispatch, t]);

    // Fetch timetables when selectedWeek changes
    useEffect(() => {
        if (selectedWeek) {
            dispatch(fetchTimetables({ startDate: selectedWeek.startDate, endDate: selectedWeek.endDate }));
        }
    }, [selectedWeek, dispatch]);

    // Mở alert khi có lỗi từ Redux
    useEffect(() => {
        if (errorLessonTimes || errorTimetables) {
            setAlertOpen(true);
        }
    }, [errorLessonTimes, errorTimetables]);

    const handleWeekChange = useCallback((week: { startDate: string; endDate: string }) => {
        dispatch(setSelectedWeek(week));
    }, [dispatch]);

    const handleRoomChange = useCallback((event: SelectChangeEvent<string[]>) => {
        setSelectedRooms(event.target.value as string[]);
    }, []);

    const handleCourseClick = useCallback(
        (courseId: string | null, NH: string | null, TH: string | null, studyTime: string | null, timetableName: string | null) => {
            if (courseId && NH && TH && studyTime) {
                navigate(`/courses/${courseId}/${NH}/${TH}/${studyTime}`, { state: { selectedWeek } });
            } else if (timetableName) {
                navigate(`/courses/${timetableName}`, { state: { selectedWeek } });
            }
        },
        [navigate, selectedWeek]
    );

    const getScheduleItems = useCallback(
        (dayOfWeek: string, period: number, roomName: string) => {
            if (!selectedWeek || !selectedRooms.includes(roomName)) return [];
            const startDate = parse(selectedWeek.startDate, 'dd/MM/yyyy', new Date());
            if (isNaN(startDate.getTime())) return [];

            const days = t('timetable.scheduleTableHeader.daysOfWeek', { returnObjects: true }) as string[];
            const daysOffset = days.indexOf(dayOfWeek);
            const currentDay = addDays(startDate, daysOffset);

            return timetables.filter((item) => {
                if (Array.isArray(item.cancelDates) && item.cancelDates.some((date) =>
                    isSameDay(parse(date, 'dd/MM/yyyy', new Date()), currentDay)
                )) {
                    return false;
                }
                return (
                    convertDayOfWeek(item.dayOfWeek) === dayOfWeek &&
                    item.startLessonTime.lessonNumber <= period &&
                    item.endLessonTime.lessonNumber >= period &&
                    item.room.name === roomName &&
                    item.status !== 'PENDING' &&
                    item.status !== 'REJECTED'
                );
            });
        },
        [selectedWeek, selectedRooms, timetables, convertDayOfWeek, t]
    );

    const getLessonTime = useCallback(
        (period: number) => lessonTimes?.find((lesson) => lesson.lessonNumber === period),
        [lessonTimes]
    );

    const handleAlertClose = () => {
        setAlertOpen(false);
        // Tùy chọn: Xóa lỗi khi đóng alert
        setErrorRooms(null);
        // Lưu ý: Không xóa errorLessonTimes/errorTimetables vì chúng thuộc Redux
    };

    // Xác định thông điệp lỗi ưu tiên
    const daysOfWeek = t('timetable.scheduleTableHeader.daysOfWeek', { returnObjects: true }) as string[];
    const errorMessage = errorLessonTimes || errorTimetables || errorRooms || '';
    if (isLoadingLessonTimes || isLoadingTimetables || isLoadingRooms) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    }

    return (
        <Box className="container mx-auto px-3 py-5">
            <Helmet>
                <title>Timetable | Lab Management IT</title>
            </Helmet>
            <Typography variant="h4" align="center" gutterBottom>
                {selectedWeek
                    ? t('timetable.scheduleTable.title', { startDate: selectedWeek.startDate, endDate: selectedWeek.endDate })
                    : t('timetable.scheduleTable.defaultTitle')}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                <SelectWeek onWeekChange={handleWeekChange} />

                <Box sx={{ flex: 1, maxWidth: 400, ml: 'auto' }}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>{t('Selected Room')}</InputLabel>
                        <Select
                            multiple
                            value={selectedRooms}
                            onChange={handleRoomChange}
                            label={t('Selected Room')}
                            renderValue={(selected) => (selected as string[]).join(', ')}
                        >
                            {rooms.map((room) => (
                                <MenuItem key={room.id} value={room.name}>
                                    <Checkbox checked={selectedRooms.includes(room.name)} />
                                    <ListItemText primary={room.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <CustomAlert
                open={alertOpen}
                message={errorMessage}
                severity="error"
                onClose={handleAlertClose}
            />

            {!(isLoadingLessonTimes || isLoadingTimetables || isLoadingRooms) && (
                <Box className="overflow-x-auto mt-4">
                    <table className="w-full table-fixed border-collapse">
                        <ScheduleHeader daysOfWeek={daysOfWeek} rooms={rooms.filter((room) => selectedRooms.includes(room.name))} />
                        <ScheduleBody
                            rooms={rooms.filter((room) => selectedRooms.includes(room.name))}
                            periods={periods}
                            daysOfWeek={daysOfWeek}
                            timetables={timetables}
                            selectedWeek={selectedWeek}
                            getScheduleItems={getScheduleItems}
                            getLessonTime={getLessonTime}
                            handleCourseClick={handleCourseClick}
                        />
                    </table>
                </Box>
            )}
        </Box>
    );
};

export default React.memo(ScheduleTable);