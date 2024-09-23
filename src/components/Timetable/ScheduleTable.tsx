import React, { useEffect, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import './Schedule.css';
import { RootState, useAppDispatch } from '../../state/store.ts';
import { fetchLessonTimes } from '../../state/LessonTime/Reducer.ts';
import { fetchTimetables } from '../../state/Timetable/Reducer.ts';
import { useSelector } from 'react-redux';
import convertDayOfWeekToVietnamese from "../../utils/convertDay.ts";
import getWeekRange from "../../utils/getWeekRange.ts";
import CustomTooltip from "./CustomTooltip.tsx";


const classColors = [
    'bg-lime-200',
    'bg-green-200',
    'bg-cyan-200',
    'bg-yellow-200',
    'bg-violet-200',
    'bg-pink-200',
    'bg-indigo-200',
];


const getClassColor = (classId: string) => {
    const index = parseInt(classId.replace(/\D/g, ''), 10) % classColors.length;
    return classColors[index];
};


const ScheduleTable: React.FC = () => {
    const [week, setWeek] = useState<number>(3); // Tuần hiện tại
    const dispatch = useAppDispatch();


    const {lessonTimes, isLoading: isLoadingLessonTimes, error: errorLessonTimes} = useSelector((state: RootState) => state.lessonTime);

    const {timetables, isLoading: isLoadingTimetables, error: errorTimetables} = useSelector((state: RootState) => state.timetable);


    const daysOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];


    const periods = Array.from({ length: 16 }, (_, index) => index + 1);

    useEffect(() => {
        const { startDate, endDate } = getWeekRange();
        dispatch(fetchLessonTimes());
        dispatch(fetchTimetables({ startDate, endDate }));
    }, [dispatch]);


    if (isLoadingLessonTimes || isLoadingTimetables) return <p>Đang tải dữ liệu...</p>;
    if (errorLessonTimes) return <p>Có lỗi xảy ra khi tải lessonTimes: {errorLessonTimes}</p>;
    if (errorTimetables) return <p>Có lỗi xảy ra khi tải timetables: {errorTimetables}</p>;


    const getScheduleItems = (dayOfWeek: string, period: number) => {
        return timetables.filter(item =>
            convertDayOfWeekToVietnamese(item.dayOfWeek) === dayOfWeek &&
            item.startLessonTime.lessonNumber <= period &&
            item.endLessonTime.lessonNumber >= period
        );
    };


    const getLessonTime = (period: number) => {
        return lessonTimes?.find(lesson => lesson.lessonNumber === period);
    };

    return (
        <div className="container mx-auto px-3 py-8">
            <h1 className="text-3xl font-semibold text-center mt-7 text-gray-800">Thời Khóa Biểu Tuần {week}</h1>
            <div className="overflow-x-auto">
                <table className="w-full table-fixed border-collapse">
                    <thead>
                    <tr>
                        <th className="border bg-blue-600 text-white px-2 py-1 w-20">Tiết</th>
                        {daysOfWeek.map((day) => (
                            <th key={day} className="border bg-blue-600 text-white px-2 py-1">{day}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {periods.map((period) => {
                        const lessonTime = getLessonTime(period);
                        return (
                            <tr key={period}>
                                <td className="border bg-gray-100 font-semibold text-center px-2 py-0.5 text-sm h-10">
                                    <Tooltip title={`Giờ: ${lessonTime?.startTime} - ${lessonTime?.endTime}`} arrow>
                                        <span className="cursor-pointer">Tiết {period}</span>
                                    </Tooltip>
                                </td>
                                {daysOfWeek.map((dayOfWeek) => {
                                    const scheduleItems = getScheduleItems(dayOfWeek, period);

                                    if (scheduleItems.length > 0) {
                                        return (
                                            <td
                                                key={dayOfWeek}
                                                className="border p-0 relative"
                                            >
                                                <div className="grid grid-cols-1 gap-1 p-1">
                                                    {scheduleItems.map((scheduleItem, index) => (
                                                        <CustomTooltip key={index} scheduleItem={scheduleItem}>
                                                            <div
                                                                className={`${getClassColor(scheduleItem.classId)} p-2 h-full flex flex-col justify-center items-center text-center`}>
                                                                <span
                                                                    className="font-semibold p-1 text-xs text-green-700">{scheduleItem.courses[0].name}</span>
                                                                <span className="text-xs italic">Phòng: <span
                                                                    className="text-green-600">{scheduleItem.room.name}</span></span>
                                                            </div>
                                                        </CustomTooltip>
                                                    ))}
                                                </div>
                                            </td>
                                        );
                                    } else {
                                        return <td key={dayOfWeek} className="border h-10"></td>;
                                    }
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScheduleTable;

