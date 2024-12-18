import { createSlice } from "@reduxjs/toolkit";
import {getCourseLogStatistics, getDailyLogStatistic, getLogsBetween, getUsageTimeUsers} from "./Reducer.ts";
import {User} from "../Authentication/Action.ts";

// Các type thống kê
export interface DailyLogStatistics {
    date: string;
    logCount: number;
}

export interface CourseLogStatistics {
    courseId: string;
    courseName: string;
    logCount: number;
}

export interface UsageTimeUsers{
    user: User;
    totalUsageTime:number;
}

export interface Logs {
    id: string;
    timestamp: string;
    endpoint: string;
    action: string;
    user: {
        username: string;
    };
    course: {
        name: string;
    } | null;
    ipAddress: string;
    userAgent: string;
}

// State của Logs
interface LogsState {
    dailyStats: DailyLogStatistics[];
    courseStats: CourseLogStatistics[];
    usageTimeUsers: UsageTimeUsers[];
    logs: Logs[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    isLoading: boolean;
    error: {
        getLogsBetween:string | null;
        getDailyLogStatistics:string | null;
        getCourseLogStatistics:string | null;
        getUsageTimeUsers:string | null;
    };
}

const initialState: LogsState = {
    dailyStats: [],
    courseStats: [],
    usageTimeUsers:[],
    logs: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    isLoading: false,
    error: {
        getLogsBetween:null,
        getDailyLogStatistics:null,
        getCourseLogStatistics:null,
        getUsageTimeUsers:null,
    },
}

const logsSlice = createSlice({
    name: 'logs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // getLogsBetween
        builder
            .addCase(getLogsBetween.pending, (state) => {
                state.isLoading = true;
                state.error.getLogsBetween = null;
            })
            .addCase(getLogsBetween.fulfilled, (state, action) => {
                state.isLoading = false;
                state.logs = action.payload.content;
                state.page = action.payload.number;
                state.size = action.payload.size;
                state.totalElements = action.payload.totalElements;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getLogsBetween.rejected, (state, action) => {
                state.isLoading = false;
                state.error.getLogsBetween = action.payload as string;
            })

            // getDailyLogStatistic
            .addCase(getDailyLogStatistic.pending, (state) => {
                state.isLoading = true;
                state.error.getDailyLogStatistics = null;
            })
            .addCase(getDailyLogStatistic.fulfilled, (state, action) => {
                state.isLoading = false;
                state.dailyStats = action.payload;
            })
            .addCase(getDailyLogStatistic.rejected, (state, action) => {
                state.isLoading = false;
                state.error.getDailyLogStatistics= action.payload as string;
            })

            // getCourseLogStatistics
            .addCase(getCourseLogStatistics.pending, (state) => {
                state.isLoading = true;
                state.error.getCourseLogStatistics = null;
            })
            .addCase(getCourseLogStatistics.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courseStats = action.payload;
            })
            .addCase(getCourseLogStatistics.rejected, (state, action) => {
                state.isLoading = false;
                state.error.getCourseLogStatistics = action.payload as string;
            })
        //total usage list users
            .addCase(getUsageTimeUsers.pending,(state)=>{
                state.isLoading = true;
                state.error.getUsageTimeUsers=null;
            })
            .addCase(getUsageTimeUsers.fulfilled,(state,action)=>{
                state.isLoading = false;
                state.usageTimeUsers=action.payload.content;
                state.page = action.payload.number;
                state.size = action.payload.size;
                state.totalElements = action.payload.totalElements;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getUsageTimeUsers.rejected,(state,action)=>{
                state.isLoading = false;
                state.error.getUsageTimeUsers=action.payload as string;
            })
    }
})

export default logsSlice;
