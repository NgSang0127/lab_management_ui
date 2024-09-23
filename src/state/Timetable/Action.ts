import { createSlice } from '@reduxjs/toolkit';
import {fetchTimetables} from "./Reducer.ts";


// Định nghĩa kiểu dữ liệu cho timetable
interface Timetable {
    id: number;
    dayOfWeek: string;
    courses: Array<{
        name: string;
        code: string;
    }>;
    startLessonTime: {
        startTime: string;
        lessonNumber: number;
    };
    endLessonTime: {
        endTime: string;
        lessonNumber: number;
    };
    room: {
        name: string;
    };
    instructor: {
        user: {
            fullName: string;
        };
    };
    startLesson:number;
    totalLessonDay: number;
    classId: string;
    studyTime: string;
}

// Khai báo state cho timetable
interface TimetableState {
    timetables: Timetable[];  // Mảng chứa dữ liệu timetable
    isLoading: boolean;  // Trạng thái loading
    error: string | null;  // Thông báo lỗi nếu có
}

// Giá trị khởi tạo của state
const initialState: TimetableState = {
    timetables: [],  // Dữ liệu thời khóa biểu
    isLoading: false,  // Trạng thái đang tải
    error: null,  // Lỗi nếu có
};

// Slice quản lý timetable
const timetableSlice = createSlice({
    name: 'timetable',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Khi bắt đầu fetch dữ liệu
            .addCase(fetchTimetables.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            // Khi fetch thành công
            .addCase(fetchTimetables.fulfilled, (state, action) => {
                state.isLoading = false;
                state.timetables = action.payload;
            })
            // Khi fetch thất bại
            .addCase(fetchTimetables.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export default timetableSlice;
