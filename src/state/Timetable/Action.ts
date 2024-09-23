import { createSlice } from '@reduxjs/toolkit';
import {fetchTimetables, importTimetable} from "./Reducer.ts";



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
    timetables: Timetable[];
    isLoading: boolean;
    error: string | null;
}


const initialState: TimetableState = {
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
            });
    },
});

export default timetableSlice;
