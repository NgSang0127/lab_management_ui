import { createSlice } from '@reduxjs/toolkit';
import {
    cancelTimetable, createTimetable,
    fetchCourseDetails,
    fetchTimetableByDate,
    fetchTimetables, getFourSemesterRecent,
    getRangeWeek,
    importTimetable
} from "./Reducer.ts";


export interface TimetableRequest {
    timetableName: string;
    roomName: string;
    startLesson: number;
    endLesson: number;
    date: string;
    instructorId: string;
    description: string;
}


export interface Timetable {
    id: number;
    dayOfWeek: string;
    timetableName:string;
    courses: Array<{
        name: string;
        code: string;
        nh: string;
        th:string;
        credits:number;
    }>;
    numberOfStudents:number;
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
        instructorId:string,
        user: {
            fullName: string;
        };
    };
    startLesson:number;
    totalLessonDay: number;
    totalLessonSemester: number;
    classId: string;
    studyTime: string;
    cancelDates:string[];
    description:string;

}

export interface Semester{
    id:number;
    name:string;
    academicYear:string;
    startDate:string;
    endDate:string;
}


interface TimetableState {
    weekRange: { firstWeekStart: string; lastWeekEnd: string } | null;
    semester:Semester[];
    timetables: Timetable[];
    course:Timetable | null;
    timetableDate:Timetable[];
    selectedWeek: { startDate: string; endDate: string } | null;
    isLoading: boolean;
    error: string | null;
    timetable:Timetable | null;

}



const initialState: TimetableState = {
    weekRange:null,
    semester:[],
    course:null,
    timetableDate:[],
    selectedWeek:null,
    timetables: [],
    isLoading: false,
    error: null,
    timetable:null

};


const timetableSlice = createSlice({
    name: 'timetable',
    initialState,
    reducers: {
        setSelectedWeek(state, action) {
            state.selectedWeek = action.payload;
        },
    },
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
            })
            //getCourseDetails
            .addCase(fetchCourseDetails.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
            })
            .addCase(fetchCourseDetails.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.course=action.payload;
            })
            .addCase(fetchCourseDetails.rejected,(state,action)=>{
                state.isLoading=false;
                state.error=action.payload as string;
            })
            //getTimetableByDate
            .addCase(fetchTimetableByDate.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
            })
            .addCase(fetchTimetableByDate.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.timetableDate=action.payload;
            })
            .addCase(fetchTimetableByDate.rejected,(state,action)=>{
                state.isLoading=false;
                state.error=action.payload as string;
            })
            //cancelTimetable
            .addCase(cancelTimetable.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
            })
            .addCase(cancelTimetable.fulfilled,(state)=>{
                state.isLoading=false;
            })
            .addCase(cancelTimetable.rejected,(state,action)=>{
                state.isLoading=false;
                state.error=action.payload as string;
            })
            //createTimetable
            .addCase(createTimetable.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
            })
            .addCase(createTimetable.fulfilled,(state)=>{
                state.isLoading=false;
            })
            .addCase(createTimetable.rejected,(state,action)=>{
                state.isLoading=false;
                state.error=action.payload as string;
            })
            //semester
            .addCase(getFourSemesterRecent.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
            })
            .addCase(getFourSemesterRecent.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.semester=action.payload;
            })
            .addCase(getFourSemesterRecent.rejected,(state,action)=> {
                state.isLoading = false;
                state.error = action.payload as string;
            })
    }
});

export const { setSelectedWeek } = timetableSlice.actions;
export default timetableSlice;
