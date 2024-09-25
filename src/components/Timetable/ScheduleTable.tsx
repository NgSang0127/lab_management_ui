import React, { useEffect, useRef, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import './Tooltip.css';
import { RootState, useAppDispatch } from '../../state/store.ts';
import { useSelector } from 'react-redux';
import convertDayOfWeekToVietnamese from "../../utils/convertDay.ts";
import CustomTooltip from "./CustomTooltip.tsx";
import './schedule.css'; // Đường dẫn đến file CSS của bạn
import SelectWeek from "./SelectWeek.tsx";
import { fetchLessonTimes } from "../../state/LessonTime/Reducer.ts";
import { fetchTimetables } from "../../state/Timetable/Reducer.ts";


const courseColors = [
    'bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100',
    'bg-pink-100', 'bg-indigo-100', 'bg-orange-100', 'bg-teal-100', 'bg-gray-100',
    'bg-lime-100', 'bg-cyan-100', 'bg-amber-100', 'bg-violet-100', 'bg-rose-100',
    'bg-fuchsia-100', 'bg-emerald-100', 'bg-sky-100', 'bg-indigo-200', 'bg-amber-200'
];


const courseColorMap = new Map<string, string>();

const hashStringToNumber = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Chuyển đổi sang số nguyên 32-bit
    }
    return Math.abs(hash); // Trả về số dương
};

const getCourseColor = (courseName: string) => {
    // Nếu môn học đã có màu, trả về màu đó
    if (courseColorMap.has(courseName)) {
        return courseColorMap.get(courseName);
    }

    // Nếu chưa có màu, gán màu mới từ danh sách màu
    const index = hashStringToNumber(courseName) % courseColors.length;
    const color = courseColors[index];
    courseColorMap.set(courseName, color);
    return color;
};


const rooms = ['LA1.604', 'LA1.605', 'LA1.606', 'LA1.607', 'LA1.608'];

const ScheduleTable: React.FC = () => {
    const [selectedWeek, setSelectedWeek] = useState<{ startDate: string, endDate: string } | null>(null);
    const previousWeek = useRef<{ startDate: string, endDate: string } | null>(null);
    const userChangedWeek = useRef(false);
    const dispatch = useAppDispatch();

    const {
        lessonTimes,
        isLoading: isLoadingLessonTimes,
        error: errorLessonTimes
    } = useSelector((state: RootState) => state.lessonTime);
    const {
        timetables,
        isLoading: isLoadingTimetables,
        error: errorTimetables
    } = useSelector((state: RootState) => state.timetable);

    const daysOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
    const periods = Array.from({length: 16}, (_, index) => index + 1);

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
            console.log("Fetching timetables for:", selectedWeek);

            if (userChangedWeek.current) {
                dispatch(fetchTimetables({startDate: selectedWeek.startDate, endDate: selectedWeek.endDate}));
                userChangedWeek.current = false;
            }
        }
    }, [selectedWeek, dispatch]);

    const handleWeekChange = (week: { startDate: string, endDate: string }) => {
        if (!selectedWeek || selectedWeek.startDate !== week.startDate || selectedWeek.endDate !== week.endDate) {
            userChangedWeek.current = true;  // Đánh dấu tuần được thay đổi bởi người dùng
            setSelectedWeek(week);
            console.log("Week changed to:", week);
        }
    };

    const getScheduleItems = (dayOfWeek: string, period: number, room: string) => {
        return timetables.filter(item =>
            convertDayOfWeekToVietnamese(item.dayOfWeek) === dayOfWeek &&
            item.startLessonTime.lessonNumber <= period &&
            item.endLessonTime.lessonNumber >= period &&
            item.room.name === room
        );
    };

    const getLessonTime = (period: number) => {
        return lessonTimes?.find(lesson => lesson.lessonNumber === period);
    };

    if (isLoadingLessonTimes || isLoadingTimetables) return <p>Đang tải dữ liệu...</p>;
    if (errorLessonTimes) return <p>Có lỗi xảy ra khi tải lessonTimes: {errorLessonTimes}</p>;
    if (errorTimetables) return <p>Có lỗi xảy ra khi tải timetables: {errorTimetables}</p>;

    return (
        <div className="container mx-auto px-3">
            <h1 className="text-3xl font-semibold text-center text-gray-800">
                {selectedWeek ? `Thời Khóa Biểu Tuần [${selectedWeek.startDate} - ${selectedWeek.endDate}]` : 'Thời Khóa Biểu'}
            </h1>
            <SelectWeek onWeekChange={handleWeekChange} initialWeek={selectedWeek}/> {/* Truyền tuần ban đầu */}
            <div className="overflow-x-auto">
                <table className="w-full table-fixed border-collapse">
                    <thead>
                    <tr>
                        <th className="border bg-blue-600 text-white px-2 py-1 w-20">Phòng</th>
                        {daysOfWeek.map((day) => (
                            <th key={day} className="border bg-blue-600 text-white px-2 py-1">{day}</th>
                        ))}
                        <th className="border bg-blue-600 text-white px-2 py-1 w-20">Tiết</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rooms.map((room) => (
                        periods.map((period) => (
                            <tr key={`${room}-${period}`} className={period === 16 ? 'border-b-2 border-black' : ''}>
                                {period === 1 && ( // Chỉ hiển thị tên phòng ở hàng đầu tiên và gộp các hàng cho phòng đó
                                    <td rowSpan={16}
                                        className="border bg-gray-100 font-semibold text-center px-2 py-0.5 text-sm h-10">
                                        {room}
                                    </td>
                                )}
                                {daysOfWeek.map((dayOfWeek) => {
                                    const scheduleItems = getScheduleItems(dayOfWeek, period, room);
                                    if (scheduleItems.length > 0) {
                                        const firstItem = scheduleItems[0];
                                        const rowSpan = firstItem.endLessonTime.lessonNumber - firstItem.startLessonTime.lessonNumber + 1; // Số tiết môn học chiếm

                                        if (firstItem.startLessonTime.lessonNumber === period) { // Chỉ hiển thị môn học ở tiết đầu tiên của nó
                                            const courseColor=getCourseColor(firstItem.courses[0].name);
                                            return (
                                                <td key={`${dayOfWeek}-${room}-${period}`}
                                                    className="border p-0 relative " rowSpan={rowSpan}>
                                                    <div className={`flex flex-col border justify-center items-center h-full text-xs ${courseColor}`}>
                                                        {scheduleItems.map((scheduleItem, index) => (
                                                            <CustomTooltip key={index} scheduleItem={scheduleItem}>
                                                                <div
                                                                    className=' w-full h-full flex flex-col justify-center items-center text-center p-1'>
                                                                    <span
                                                                        className="font-semibold p-1 text-xs text-green-700">{scheduleItem.courses[0].name}</span>
                                                                    <span className="text-xs italic"><span
                                                                        className="text-green-600">{scheduleItem.instructor.user.fullName}</span></span>
                                                                </div>
                                                            </CustomTooltip>
                                                        ))}
                                                    </div>
                                                </td>
                                            );
                                        } else {
                                            return null;
                                        }
                                    } else {
                                        return <td key={`${dayOfWeek}-${room}-${period}`} className="border h-6 p-0 text-xs"></td>;
                                    }
                                })}
                                <td className="border bg-gray-100 font-semibold text-center px-1 py-0 text-xs h-6">
                                    <Tooltip
                                        title={`Giờ: ${getLessonTime(period)?.startTime} - ${getLessonTime(period)?.endTime}`}
                                        arrow>
                                        <span className="cursor-pointer">Tiết {period}</span>
                                    </Tooltip>
                                </td>
                            </tr>
                        ))
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScheduleTable;
