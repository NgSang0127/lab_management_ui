import { createSlice } from '@reduxjs/toolkit';
import { fetchLessonTimes } from './Reducer'; // Import fetchLessonTimes từ file Reducer.ts

// Định nghĩa kiểu dữ liệu cho lesson time
export interface LessonTime {
    id: number;
    lessonNumber: number;
    startTime: string;
    endTime: string;
    session: string;
}

// Khai báo state cho lesson time
interface LessonTimeState {
    lessonTimes: LessonTime[];
    isLoading: boolean;
    error: string | null;
}

// Giá trị khởi tạo của state
const initialState: LessonTimeState = {
    lessonTimes: [], // Dữ liệu thời gian tiết học
    isLoading: false, // Trạng thái đang load
    error: null, // Thông báo lỗi nếu có
};

// Slice quản lý lessonTimes
const lessonTimeSlice = createSlice({
    name: 'lessonTimes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Khi bắt đầu fetch dữ liệu
            .addCase(fetchLessonTimes.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            // Khi fetch thành công
            .addCase(fetchLessonTimes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lessonTimes = action.payload; // Lưu dữ liệu vào state
            })
            // Khi fetch thất bại
            .addCase(fetchLessonTimes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

// Xuất reducer để sử dụng trong store
export default lessonTimeSlice;
