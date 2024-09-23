import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from "../../config/api.ts";

// Định nghĩa kiểu dữ liệu cho lesson time
interface LessonTime {
    id: number;
    lessonNumber: number;
    startTime: string;
    endTime: string;
    session: string;
}

// Action để gọi API lấy dữ liệu về giờ tiết học từ backend
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
