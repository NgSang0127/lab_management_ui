import { createSlice } from '@reduxjs/toolkit';
import {fetchTimetables, getRangeWeek, importTimetable} from "./Reducer.ts";



export interface Timetable {
    id: number;
    dayOfWeek: string;
    courses: Array<{
        name: string;
        code: string;
        nh: number;
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


interface TimetableState {
    weekRange: { firstWeekStart: string; lastWeekEnd: string } | null;
    timetables: Timetable[];
    isLoading: boolean;
    error: string | null;
}


const initialState: TimetableState = {
    weekRange:null,
    timetables: [],
    isLoading: false,
    error: null,
};


const timetableSlice = createSlice({
    name: 'timetable',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //importTimetable
            .addCase(importTimetable.pending,(state)=>{
                state.isLoading = true;
                state.error = null;
            })
            .addCase(importTimetable.fulfilled,(state)=>{
                state.isLoading=true;
            })
            .addCase(importTimetable.rejected,(state,action)=>{
                state.isLoading=false;
                state.error=action.payload as string;
            })
            //fetchtimetable

            .addCase(fetchTimetables.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTimetables.fulfilled, (state, action) => {
                state.isLoading = false;
                state.timetables = action.payload;
            })
            .addCase(fetchTimetables.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // getRangeWeek
            .addCase(getRangeWeek.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getRangeWeek.fulfilled, (state, action) => {
                state.isLoading = false;
                state.weekRange = action.payload;
            })
            .addCase(getRangeWeek.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
        ;
    },
});

export default timetableSlice;
