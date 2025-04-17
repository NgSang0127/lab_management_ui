import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    cancelTimetable, createTimetable,
    fetchCourseDetails,
    fetchTimetableByDate,
    fetchTimetables,
    getFourSemesterRecent,
    getRangeWeek
} from "./thunk.ts";

export interface Week {
    startDate: string;
    endDate: string;
}

export interface Semester {
    id: number;
    name: string;
    academicYear: string;
    startDate: string;
    endDate: string;
}

export interface Timetable {
    id: number;
    dayOfWeek: string;
    timetableName: string;
    courses: Array<{
        name: string;
        code: string;
        nh: string;
        th: string;
        credits: number;
    }>;
    numberOfStudents: number;
    startLessonTime: { startTime: string; lessonNumber: number };
    endLessonTime: { endTime: string; lessonNumber: number };
    room: { name: string };
    instructor: { instructorId: string; user: { fullName: string } };
    startLesson: number;
    totalLessonDay: number;
    totalLessonSemester: number;
    classId: string;
    studyTime: string;
    cancelDates: string[];
    description: string;
}

interface TimetableState {
    weekRange: { firstWeekStart: string; lastWeekEnd: string } | null;
    semesters: Semester[];
    selectedSemesterId: number | null;
    timetables: Timetable[];
    course: Timetable | null;
    timetableDate: Timetable[];
    selectedWeek: Week | null;
    isLoading: boolean;
    error: string | null;
    timetable: Timetable | null;
}

const initialState: TimetableState = {
    weekRange: null,
    semesters: [],
    selectedSemesterId: null,
    timetables: [],
    course: null,
    timetableDate: [],
    selectedWeek: null,
    isLoading: false,
    error: null,
    timetable: null,
};

const timetableSlice = createSlice({
    name: 'timetable',
    initialState,
    reducers: {
        setSelectedWeek(state, action: PayloadAction<Week | null>) {
            state.selectedWeek = action.payload;
        },
        setSelectedSemesterId(state, action: PayloadAction<number | null>) {
            state.selectedSemesterId = action.payload;
            state.weekRange = null; // Reset weekRange when semester changes
            state.selectedWeek = null; // Reset selectedWeek when semester changes
        },
    },
    extraReducers: (builder) => {
        builder
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
            // getFourSemesterRecent
            .addCase(getFourSemesterRecent.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getFourSemesterRecent.fulfilled, (state, action) => {
                state.isLoading = false;

                // So sánh kỹ để tránh re-render vô hạn
                const isSame = JSON.stringify(state.semesters) === JSON.stringify(action.payload);
                if (!isSame) {
                    state.semesters = action.payload;
                }

                if (action.payload.length > 0 && state.selectedSemesterId === null) {
                    state.selectedSemesterId = action.payload[0].id;
                }
            })

            .addCase(getFourSemesterRecent.rejected, (state, action) => {
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
            // fetchTimetables
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
        // Add other cases (createTimetable, cancelTimetable, etc.) as needed
    },
});

export const { setSelectedWeek, setSelectedSemesterId } = timetableSlice.actions;
export default timetableSlice;