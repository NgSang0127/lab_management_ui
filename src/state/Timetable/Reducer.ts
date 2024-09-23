import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { API_URL } from '../../config/api.ts';  // Chỉnh đường dẫn API theo nhu cầu


interface TimetableApiResponse {
    id: number;
    dayOfWeek: string;
    courses: Array<{
        name: string;
        code: string;
        nh:number;
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

export const importTimetable = createAsyncThunk(
    'timetable/importTimetable',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/timetable/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Check the HTTP status code and return a simple message
            if (response.status === 200) {
                return 'File imported successfully'; // Return a success message
            } else {
                return rejectWithValue('File import failed. Please try again.'); // Return a failure message
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || 'An error occurred during import');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);



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
