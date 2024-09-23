import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from "../../config/api.ts";


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
            const response = await axios.get<LessonTime[]>(`${API_URL}/lesson-time`);
            console.log(response.data);
            return response.data; // Trả về dữ liệu tiết học
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch lesson times');
        }
    }
);
