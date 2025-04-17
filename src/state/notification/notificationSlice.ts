import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchNotifications, fetchUnreadNotifications} from "./thunk.ts";
import {NotificationResponse} from "../../services/notification/notification.ts";


interface Notification{
    notifications:NotificationResponse[] |null,
    unReadNotifications:NotificationResponse[] |null,
    isLoading:boolean,
    success:string| null,
    error:string| null,
    page:number,
    size:number,
    first:boolean,
    last:boolean,
    totalElements:number,
    totalPages:number,
}

const initialState:Notification={
    notifications:[],
    unReadNotifications:[],
    isLoading:false,
    success:'',
    error:'',
    page:0,
    size:10,
    first:true,
    last:false,
    totalElements:0,
    totalPages:0,
}

export const notifySlice=createSlice({
    name:'notify',
    initialState,
    reducers:{
        resetStatus: (state) => {
            state.success = null;
            state.error = null;
        },
        markNotificationAsRead: (state, action: PayloadAction<number>) => {
            const notificationId = action.payload;
            state.notifications = state.notifications?.map((notif) =>
                notif.id === notificationId ? { ...notif, status: "READ" } : notif
            ) || [];

            // Cập nhật danh sách thông báo chưa đọc
            state.unReadNotifications = state.unReadNotifications?.filter((notif) => notif.id !== notificationId) || [];
        },
    },
    extraReducers:(builder=>{
        builder
            //getNotifications
            .addCase(fetchNotifications.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
            })
            .addCase(fetchNotifications.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.page = action.payload.number;
                state.notifications=action.payload.content;
                state.size = action.payload.size;
                state.first=action.payload.first;
                state.last=action.payload.last;
                state.totalElements = action.payload.totalElements;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchNotifications.rejected,(state, action)=>{
                state.isLoading=false;
                state.error=action.payload as string;
            })
            //getUnreadNotification
            .addCase(fetchUnreadNotifications.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
            })
            .addCase(fetchUnreadNotifications.fulfilled,(state, action)=>{
                state.isLoading=false;
                state.unReadNotifications=action.payload;
            })
            .addCase(fetchUnreadNotifications.rejected,(state, action)=>{
                state.isLoading=false;
                state.error=action.payload as string;
            })
    })
})
export const { resetStatus, markNotificationAsRead } = notifySlice.actions;
export default notifySlice;