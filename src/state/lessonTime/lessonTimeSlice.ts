import { createSlice } from '@reduxjs/toolkit';
import { fetchLessonTimes } from './thunk.ts'; // Import fetchLessonTimes từ file thunk.ts


export interface LessonTime {
    id: number;
    lessonNumber: number;
    startTime: string;
    endTime: string;
    session: string;
}


interface LessonTimeState {
    lessonTimes: LessonTime[];
    isLoading: boolean;
    error: string | null;
}

// Giá trị khởi tạo của state
const initialState: LessonTimeState = {
    lessonTimes: [],
    isLoading: false,
    error: null,
};


const lessonTimeSlice = createSlice({
    name: 'lessonTimes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLessonTimes.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })

            .addCase(fetchLessonTimes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lessonTimes = action.payload;
            })
            .addCase(fetchLessonTimes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

// Xuất reducer để sử dụng trong store
export default lessonTimeSlice;
