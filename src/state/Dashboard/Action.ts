import {createSlice} from "@reduxjs/toolkit";
import {getLogsBetween} from "./Reducer.ts";

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


interface LogsState{
    logs: Logs[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
}
const  initialState: LogsState={
    logs: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    isLoading: false,
    error: null,
}

const logsSlice=createSlice({
    name: 'logs',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(getLogsBetween.pending,(state)=>{
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getLogsBetween.fulfilled,(state,action)=>{
                state.isLoading = false;
                state.logs = action.payload.content;
                state.page = action.payload.number;
                state.size = action.payload.size;
                state.totalElements = action.payload.totalElements;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getLogsBetween.rejected,(state,action)=>{
                state.isLoading=false;
                state.error=action.payload as string;
            })
    }
})
export default logsSlice;