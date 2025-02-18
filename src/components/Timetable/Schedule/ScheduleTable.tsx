import React, { useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './schedule.css'; // Retain if specific styles are necessary
import {RootState, useAppDispatch} from '../../../state/store';
import { useSelector } from 'react-redux';
import { fetchLessonTimes } from '../../../state/LessonTime/Reducer';
import { fetchTimetables } from '../../../state/Timetable/Reducer';
import { setSelectedWeek } from '../../../state/Timetable/Action';
import {addDays, isSameDay, parse} from 'date-fns';
import {periods, rooms} from '../../../utils/utilsTimetable';

import SelectWeek from "../SelectWeek.tsx";
import ScheduleHeader from "./ScheduleHeader.tsx";
import ScheduleBody from "./ScheduleBody.tsx";
import './Tooltip.css';
import './Schedule.css'
import {useTranslation} from "react-i18next";
import useConvertDayOfWeek from "../../../utils/convertDay.ts";

const ScheduleTable: React.FC = () => {
    const {t}=useTranslation();
    const { convertDayOfWeek } = useConvertDayOfWeek();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const selectedWeek = useSelector((state: RootState) => state.timetable.selectedWeek);
    const previousWeek = useRef<{ startDate: string; endDate: string } | null>(null);
    const userChangedWeek = useRef(false);

    const {
        lessonTimes,
        isLoading: isLoadingLessonTimes,
        error: errorLessonTimes,
    } = useSelector((state: RootState) => state.lessonTime);
    const {
        timetables,
        isLoading: isLoadingTimetables,
        error: errorTimetables,
    } = useSelector((state: RootState) => state.timetable);

    useEffect(() => {
        dispatch(fetchLessonTimes());
    }, [dispatch]);

    useEffect(() => {
        if (
            selectedWeek &&
            (previousWeek.current?.startDate !== selectedWeek.startDate ||
                previousWeek.current?.endDate !== selectedWeek.endDate)
        ) {
            previousWeek.current = selectedWeek;
            console.log('Fetching timetables for:', selectedWeek);

            if (userChangedWeek.current) {
                dispatch(fetchTimetables({ startDate: selectedWeek.startDate, endDate: selectedWeek.endDate }));
                userChangedWeek.current = false;
            }
        }
    }, [selectedWeek, dispatch]);

    const handleWeekChange = (week: { startDate: string; endDate: string }) => {
        if (
            !selectedWeek ||
            selectedWeek.startDate !== week.startDate ||
            selectedWeek.endDate !== week.endDate
        ) {
            userChangedWeek.current = true;
            dispatch(setSelectedWeek(week));
            console.log('Week changed to:', week);
        }
    };

    const daysOfWeek: string[] = t("timetable.scheduleTableHeader.daysOfWeek", { returnObjects: true }) as string [];
    console.log("sss",daysOfWeek);

    const handleCourseClick = (
        courseId: string | null,
        NH: string | null,
        TH: string | null,
        studyTime: string | null,
        timetableName: string | null
    ) => {
        if (courseId && NH && TH && studyTime) {
            navigate(`/courses/${courseId}/${NH}/${TH}/${studyTime}`, {
                state: { selectedWeek },
            });
        } else if (timetableName) {
            navigate(`/courses/${timetableName}`, {
                state: { selectedWeek },
            });
        }
    };

    const getScheduleItems = (dayOfWeek: string, period: number, roomName: string) => {
        if (!selectedWeek) return [];

        const startDate = parse(selectedWeek.startDate, 'dd/MM/yyyy', new Date());

        if (isNaN(startDate.getTime())) return [];

        return timetables.filter((item) => {
            if (Array.isArray(item.cancelDates)) {
                const isCanceled = item.cancelDates.some((cancelDateStr) => {
                    const canceledDate = parse(cancelDateStr, 'dd/MM/yyyy', new Date());
                    const daysOffset = daysOfWeek.indexOf(dayOfWeek);
                    const currentDayOfWeekDate = addDays(startDate, daysOffset);
                    return isSameDay(canceledDate, currentDayOfWeekDate);
                });

                if (isCanceled) return false;
            }

            return (
                convertDayOfWeek(item.dayOfWeek) === dayOfWeek &&
                item.startLessonTime.lessonNumber <= period &&
                item.endLessonTime.lessonNumber >= period &&
                item.room.name === roomName
            );
        });
    };

    const getLessonTime = (period: number) => {
        return lessonTimes?.find((lesson) => lesson.lessonNumber === period);
    };

    if (isLoadingLessonTimes || isLoadingTimetables)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    if (errorLessonTimes)
        return (
            <Alert severity="error">{t('timetable.scheduleTable.errors.lessonTime',{error:errorLessonTimes})}</Alert>
        );
    if (errorTimetables)
        return <Alert severity="error">{t('timetable.scheduleTable.errors.timetable',{error:errorTimetables})}</Alert>;

    return (
        <Box className="container mx-auto px-3 py-5">
            <Typography variant="h4" align="center" gutterBottom>
                {selectedWeek
                    ? t('timetable.scheduleTable.title',{startDate:selectedWeek.startDate,endDate:selectedWeek.endDate})
                    : t('timetable.scheduleTable.defaultTitle')}
            </Typography>
            <SelectWeek onWeekChange={handleWeekChange} initialWeek={selectedWeek} />
            <Box className="overflow-x-auto mt-4">
                <table className="w-full table-fixed border-collapse">
                    <ScheduleHeader daysOfWeek={daysOfWeek} rooms={rooms} />
                    <ScheduleBody
                        rooms={rooms}
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
        </Box>
    );
};

export default ScheduleTable;
