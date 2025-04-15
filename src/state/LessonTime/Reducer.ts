import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from "../../config/api.ts";
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
            // Use a direct axios request without authentication for this public endpoint
            const response = await axios.get<LessonTime[]>(`${API_URL}/lesson-time`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false
            });
            console.log("Lesson times fetched successfully:", response.data);
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
);