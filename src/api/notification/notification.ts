import { PageResponse } from "../../state/Page/ActionType";
import {api} from "../../config/api.ts";
import axios from "axios";


export interface NotificationRequest{
    title: string;
    message: string;
}

export interface NotificationResponse {
    id:number;
    title:string;
    message:string;
    status: 'UNREAD' | 'READ',
    createdDate:string;
    lastModifiedDate:string;
}


export async function fetchNotifications(page: number, size: number): Promise<PageResponse<NotificationResponse>> {
    try {
        const response = await api.get<PageResponse<NotificationResponse>>('/notifications', {
            params: {
                page,
                size
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
                const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
                throw new Error(backendError);
            }
            throw new Error('No response from server');
        }
        throw new Error('Unknown error');
    }
}
export async function fetchUnreadNotifications(): Promise<NotificationResponse[]> {
    try {
        const response = await api.get<NotificationResponse[]>('/notifications/unread');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
                const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
                throw new Error(backendError);
            }
            throw new Error('No response from server');
        }
        throw new Error('Unknown error');
    }
}

export async function markAsRead(id:number): Promise<string> {
    try {
        const response = await api.post<string>(`/notifications/${id}/read`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
                const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
                throw new Error(backendError);
            }
            throw new Error('No response from server');
        }
        throw new Error('Unknown error');
    }
}


export async function createAndSendNotification(request: NotificationRequest): Promise<string> {
    try {
        const response = await api.post<string>(`/notifications/broadcast`,request);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
                const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
                throw new Error(backendError);
            }
            throw new Error('No response from server');
        }
        throw new Error('Unknown error');
    }
}