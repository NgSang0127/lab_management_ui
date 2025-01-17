import React, { useEffect, useRef } from 'react';
import Tooltip from '@mui/material/Tooltip';
import './Schedule/Tooltip.css';
import { RootState, useAppDispatch } from '../../state/store.ts';
import { useSelector } from 'react-redux';
import convertDayOfWeekToVietnamese from "../../utils/convertDay.ts";
import CustomTooltip from "./Schedule/CustomTooltip.tsx";
import './Schedule/Schedule.css'; // Đường dẫn đến file CSS của bạn
import SelectWeek from "./SelectWeek.tsx";
import { fetchLessonTimes } from "../../state/LessonTime/Reducer.ts";
import { fetchTimetables } from "../../state/Timetable/Reducer.ts";
import { getCourseColor} from "../../utils/courseColors.ts";
import {setSelectedWeek} from "../../state/Timetable/Action.ts";
import {useNavigate} from "react-router-dom";
import { parse, addDays, isSameDay } from 'date-fns';
import {daysOfWeek, periods, rooms} from "../../utils/utilsTimetable.ts";




const ScheduleTable: React.FC = () => {
    const navigate=useNavigate();
    const dispatch = useAppDispatch();

    const selectedWeek = useSelector((state: RootState) => state.timetable.selectedWeek);
    const previousWeek = useRef<{ startDate: string, endDate: string } | null>(null);
    const userChangedWeek = useRef(false);

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
            userChangedWeek.current = true;
            dispatch(setSelectedWeek(week));
            console.log("Week changed to:", week);
        }
    };
    // Hàm xử lý sự kiện click vào môn học
    const handleCourseClick = (courseId: string | null, NH: string | null, TH: string | null,studyTime:string | null, timetableName: string | null) => {
        if (courseId && NH && TH && studyTime) {
            // Chuyển hướng khi có course
            navigate(`/courses/${courseId}/${NH}/${TH}/${studyTime}`, {
                state: { selectedWeek }
            });
        } else if (timetableName) {
            // Chuyển hướng khi không có courseId, NH, TH và sử dụng timetableName
            navigate(`/courses/${timetableName}`, {
                state: { selectedWeek }
            });
        }
    };


    const getScheduleItems = (dayOfWeek: string, period: number, roomName: string) => {
        if (!selectedWeek) {
            return [];
        }

        // Chuyển đổi selectedWeek.startDate từ chuỗi 'dd/MM/yyyy' sang đối tượng Date
        const startDate = parse(selectedWeek.startDate, 'dd/MM/yyyy', new Date());

        // Kiểm tra nếu startDate là một đối tượng Date hợp lệ
        if (isNaN(startDate.getTime())) {
            return [];
        }

        // Lọc các môn học từ thời khóa biểu
        return timetables.filter(item => {
            // Kiểm tra nếu có ngày hủy và đó là một mảng
            if (Array.isArray(item?.cancelDates)) {
                const isCanceled = item.cancelDates.some(cancelDateStr => {
                    // Chuyển đổi cancelDate từ chuỗi dd/MM/yyyy sang đối tượng Date
                    const canceledDate = parse(cancelDateStr, 'dd/MM/yyyy', new Date());

                    // Tính toán ngày hiện tại trong tuần đang xét
                    const daysOffset = daysOfWeek.indexOf(dayOfWeek);
                    const currentDayOfWeekDate = addDays(startDate, daysOffset);

                    // So sánh ngày bị hủy với ngày hiện tại trong tuần
                    return isSameDay(canceledDate, currentDayOfWeekDate);
                });

                // Nếu môn học bị hủy, không hiển thị nó
                if (isCanceled) {
                    return false;
                }
            }

            // Lọc các môn học không bị hủy và phù hợp với các điều kiện khác
            return convertDayOfWeekToVietnamese(item.dayOfWeek) === dayOfWeek &&
                item.startLessonTime.lessonNumber <= period &&
                item.endLessonTime.lessonNumber >= period &&
                item.room.name === roomName;
        });
    };




    const getLessonTime = (period: number) => {
        return lessonTimes?.find(lesson => lesson.lessonNumber === period);
    };

    if (isLoadingLessonTimes || isLoadingTimetables) return <p>Đang tải dữ liệu...</p>;
    if (errorLessonTimes) return <p>Có lỗi xảy ra khi tải lessonTimes: {errorLessonTimes}</p>;
    if (errorTimetables) return <p>Có lỗi xảy ra khi tải timetables: {errorTimetables}</p>;

    return (
        <div className="container mx-auto px-3 py-5">
            <h1 className="text-3xl font-semibold text-center text-gray-800">
                {selectedWeek ? `Thời Khóa Biểu Tuần ${selectedWeek.startDate} - ${selectedWeek.endDate}` : 'Thời Khóa Biểu'}
            </h1>
            <SelectWeek onWeekChange={handleWeekChange} initialWeek={selectedWeek}/>
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

                                        if (firstItem.startLessonTime.lessonNumber === period) {
                                            const courseColor = getCourseColor(firstItem.courses?.[0]?.name, firstItem.timetableName);
                                            return (
                                                <td key={`${dayOfWeek}-${room}-${period}`}
                                                    className="border p-0 relative " rowSpan={rowSpan}>
                                                    <div className={`flex flex-col border justify-center items-center h-full text-xs ${courseColor}`}>
                                                        {scheduleItems.map((scheduleItem, index) => (
                                                            <CustomTooltip key={index} scheduleItem={scheduleItem}>
                                                                <div
                                                                    // Kiểm tra nếu có course thì tìm theo courseId, NH, TH, nếu không thì tìm theo timetableName
                                                                    onClick={() => handleCourseClick(
                                                                        scheduleItem.courses && scheduleItem.courses.length > 0
                                                                            ? scheduleItem.courses[0].code
                                                                            : null,
                                                                        scheduleItem.courses && scheduleItem.courses.length > 0
                                                                            ? scheduleItem.courses[0].nh
                                                                            : null,
                                                                        scheduleItem.courses && scheduleItem.courses.length > 0
                                                                            ? scheduleItem.courses[0].th
                                                                            : null,
                                                                        scheduleItem.studyTime && scheduleItem.studyTime.length > 0
                                                                            ? encodeURIComponent(scheduleItem.studyTime)
                                                                            :null,
                                                                        scheduleItem.timetableName  // Truyền timetableName nếu không có course
                                                                    )}
                                                                    className=' w-full h-full flex flex-col justify-center items-center text-center p-1'>
                                                                    <span
                                                                        className="font-semibold p-1 text-xs text-green-700">
                                                                        {scheduleItem.courses && scheduleItem.courses.length > 0
                                                                        ? scheduleItem.courses[0].name
                                                                        : scheduleItem.timetableName}</span>
                                                                    <span className="text-xs italic text-green-600">
                                                                        {
                                                                        scheduleItem.instructor.user.fullName}
                                                                        </span>
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
