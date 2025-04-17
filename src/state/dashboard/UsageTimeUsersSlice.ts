import {createSlice} from "@reduxjs/toolkit";
import {getUsageTimeUsers} from "./thunk.ts";

export interface UsageTimeUsers{
    userId: number;
    username: string;
    totalUsageTime: number;
}


interface UsageTimeUsersState {
    usageTimeUsers: UsageTimeUsers[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: UsageTimeUsersState = {
    usageTimeUsers: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: false,
    isLoading: false,
    error: null,
};

const usageTimeUsersSlice = createSlice({
    name: 'usageTimeUsers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUsageTimeUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUsageTimeUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.usageTimeUsers = action.payload.content;
                state.page = action.payload.number;
                state.size = action.payload.size;
                state.first = action.payload.first;
                state.last = action.payload.last;
                state.totalElements = action.payload.totalElements;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getUsageTimeUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export default usageTimeUsersSlice;