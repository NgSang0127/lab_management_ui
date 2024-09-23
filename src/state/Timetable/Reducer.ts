import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { API_URL } from '../../config/api.ts';  // Chỉnh đường dẫn API theo nhu cầu

// Định nghĩa kiểu dữ liệu trả về từ API
interface TimetableApiResponse {
    id: number;
    dayOfWeek: string;
    courses: Array<{
        name: string;
        code: string;
    }>;
    startLessonTime: {
        startTime: string;
        lessonNumber: number;
    };
    endLessonTime: {
        endTime: string;
        lessonNumber: number;
    };
    room: {
        name: string;
    };
    instructor: {
        user: {
            fullName: string;
        };
    };
    startLesson:number;
    totalLessonDay: number;
    classId: string;
    studyTime: string;
}

// Thunk để fetch dữ liệu từ API
export const fetchTimetables = createAsyncThunk(
    'timetable/fetchTimetables',
    async (params: { startDate: string; endDate: string }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get<TimetableApiResponse[]>(`${API_URL}/timetable/by-week`, {
                params: { startDate: params.startDate, endDate: params.endDate },
            });
            console.log("timetable",data);
            return data;
        } catch (e) {
            return rejectWithValue((e as AxiosError).message);
        }
    }
);
