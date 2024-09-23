import React, {useEffect, useState} from 'react';
import Tooltip from '@mui/material/Tooltip';
import './Schedule.css';
import {RootState, useAppDispatch} from '../../state/store.ts';
import {fetchLessonTimes} from '../../state/LessonTime/Reducer.ts';
import {fetchTimetables} from '../../state/Timetable/Reducer.ts';
import {useSelector} from 'react-redux';
import convertDayOfWeekToVietnamese from "../../utils/convertDay.ts";
import getWeekRange from "../../utils/getWeekRange.ts";

// Component thời khóa biểu
const ScheduleTable: React.FC = () => {
    const [week, setWeek] = useState<number>(3); // Tuần hiện tại
    const dispatch = useAppDispatch();

    // Lấy dữ liệu lessonTime từ Redux store
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

    // Danh sách các thứ trong tuần
    const daysOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

    // Mảng chứa các tiết học (1-16)
    const periods = Array.from({length: 16}, (_, index) => index + 1);

    useEffect(() => {
        const {startDate, endDate} = getWeekRange();
        dispatch(fetchLessonTimes()); // Gọi action để fetch dữ liệu lessonTime từ API
        dispatch(fetchTimetables({startDate, endDate})); // Gọi action để fetch dữ liệu timetable từ API
    }, [dispatch]);

    // Nếu dữ liệu đang tải hoặc có lỗi từ lessonTimes hoặc timetables
    if (isLoadingLessonTimes || isLoadingTimetables) return <p>Đang tải dữ liệu...</p>;
    if (errorLessonTimes) return <p>Có lỗi xảy ra khi tải lessonTimes: {errorLessonTimes}</p>;
    if (errorTimetables) return <p>Có lỗi xảy ra khi tải timetables: {errorTimetables}</p>;

    // Hàm để lấy môn học dựa trên ngày và tiết học từ dữ liệu `timetables`
    const getScheduleItem = (dayOfWeek: string, period: number) => {
        return timetables.find(item =>
            convertDayOfWeekToVietnamese(item.dayOfWeek) === dayOfWeek &&
            item.startLessonTime.lessonNumber <= period &&
            item.endLessonTime.lessonNumber >= period
        );
    };

    // Hàm để lấy giờ bắt đầu và kết thúc của mỗi tiết từ `lessonTimes`
    const getLessonTime = (period: number) => {
        return lessonTimes?.find(lesson => lesson.lessonNumber === period);
    };

    return (
        <div className="container mx-auto px-3 py-8">
            <h1 className="text-3xl font-semibold text-center mt-7 text-gray-800">Thời Khóa Biểu Tuần {week}</h1>
            <div className="overflow-x-auto">
                <table className="w-full table-fixed border-collapse h-[calc(85vh)]"> {/* Chiếm 90% chiều
                 cao màn
                 hình */}
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
                            <tr key={period} className="h-8"> {/* Giảm chiều cao hàng */}
                                <td className="border bg-gray-100 font-semibold text-center px-2 py-0.5 text-sm h-8">
                                    <Tooltip title={`Giờ: ${lessonTime?.startTime} - ${lessonTime?.endTime}`} arrow>
                                        <span className="cursor-pointer">Tiết {period}</span>
                                    </Tooltip>
                                </td>
                                {daysOfWeek.map((dayOfWeek) => {
                                    const scheduleItem = getScheduleItem(dayOfWeek, period);
                                    if (scheduleItem && scheduleItem.startLessonTime.lessonNumber === period) {
                                        return (
                                            <td
                                                key={dayOfWeek}
                                                rowSpan={scheduleItem.endLessonTime.lessonNumber - scheduleItem.startLessonTime.lessonNumber + 1}
                                                className="border p-0 h-8"
                                            >
                                                <Tooltip
                                                    title={
                                                        <div className="text-xs">
                                                            <strong>Mã môn học:</strong> {scheduleItem.courses[0].code}<br/>
                                                            <strong>Tên môn học:</strong> {scheduleItem.courses[0].name}<br/>
                                                            <strong>Phòng:</strong> {scheduleItem.room.name}<br/>
                                                            <strong>Thứ:</strong> {convertDayOfWeekToVietnamese(scheduleItem.dayOfWeek)}<br/>
                                                            <strong>Tiết Bắt Đầu:</strong> {scheduleItem.startLessonTime.lessonNumber}<br/>
                                                            <strong>Số Tiết:</strong> {scheduleItem.endLessonTime.lessonNumber - scheduleItem.startLessonTime.lessonNumber + 1}<br/>
                                                            <strong>Giảng viên:</strong> {scheduleItem.instructor.user.fullName}<br/>
                                                            <strong>Mã lớp:</strong> {scheduleItem.classId}
                                                        </div>
                                                    }
                                                    arrow
                                                >
                                                    <div
                                                        className="bg-yellow-100 p-2 h-full flex flex-col justify-center items-center text-center">
                                                    <span
                                                        className="font-semibold p-1 text-xs text-green-700">{scheduleItem.courses[0].name}</span>
                                                        <span className="text-xs italic">Phòng: <span
                                                            className="text-green-600">{scheduleItem.room.name}</span></span>
                                                    </div>
                                                </Tooltip>
                                            </td>
                                        );
                                    } else if (scheduleItem && scheduleItem.startLessonTime.lessonNumber < period && period <= scheduleItem.endLessonTime.lessonNumber) {
                                        return null;
                                    } else {
                                        return <td key={dayOfWeek} className="border h-8"></td>;
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
