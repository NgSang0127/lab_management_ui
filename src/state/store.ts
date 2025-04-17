import {authSlice} from "./auth/authSlice.ts";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import lessonTimeSlice from "./lessonTime/lessonTimeSlice.ts";
import timetableSlice from "./timetable/timetableSlice.ts";
import logsSlice from "./dashboard/dashboardSlice.ts";
import userSlice from "./user/userSlice.ts";
import {adminSlice} from "./admin/adminSlice.ts";
import usageTimeUsersSlice from "./dashboard/UsageTimeUsersSlice.ts";
import {notifySlice} from "./notification/notificationSlice.ts";

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => AppDispatch = useDispatch;
const rootReducer=combineReducers({
    auth:authSlice.reducer,
    timetable:timetableSlice.reducer,
    lessonTime:lessonTimeSlice.reducer,
    logs:logsSlice.reducer,
    user:userSlice.reducer,
    admin:adminSlice.reducer,
    usage:usageTimeUsersSlice.reducer,
    notify:notifySlice.reducer
});

export const store=configureStore({
    reducer:rootReducer,
})