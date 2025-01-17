import { createAsyncThunk } from '@reduxjs/toolkit';
import {api} from "../../config/api.ts";
import axios from "axios";


interface LessonTime {
    id: number;
    lessonNumber: number;
    startTime: string;
    endTime: string;
    session: string;
}


export const fetchLessonTimes = createAsyncThunk<LessonTime[]>(
    'lessonTimes/fetchLessonTimes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<LessonTime[]>('/lesson-time');
            console.log(response.data);
            return response.data; // Trả về dữ liệu tiết học
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
);
