import {createAsyncThunk} from "@reduxjs/toolkit";
import {api} from "../../config/api.ts";
import {PageResponse} from "../page/types.ts";
import axios from "axios";
import {NotificationResponse} from "../../services/notification/notification.ts";



export const fetchNotifications = createAsyncThunk(
    'notify/fetchNotifications',
    async (params: { page: number, size: number }, {rejectWithValue}) => {
        try {
            const {data} = await api.get<PageResponse<NotificationResponse>>('/notifications', {
                params: {
                    page: params.page,
                    size: params.size,

                }
            });
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data) {
                    const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
                    return rejectWithValue(backendError);
                }
                return rejectWithValue('No response from server');
            }
            return rejectWithValue('Unknown error');
        }
    }
)

export const fetchUnreadNotifications = createAsyncThunk(
    'notify/fetchUnreadNotifications',
    async (_, {rejectWithValue}) => {
        try {
            const response = await api.get<NotificationResponse[]>('/notifications/unread');
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data) {
                    const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
                    return rejectWithValue(backendError);
                }
                return rejectWithValue('No response from server');
            }
            return rejectWithValue('Unknown error');
        }
    }
)

export const markAsRead = createAsyncThunk(
    'notify/markAsRead',
    async (id: number, {rejectWithValue}) => {
        try {
            const response = await api.post<string>(`/notifications/${id}/read`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data) {
                    const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
                    return rejectWithValue(backendError);
                }
                return rejectWithValue('No response from server');
            }
            return rejectWithValue('Unknown error');
        }

    }
)



