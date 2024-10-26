import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import {api, API_URL} from '../../config/api.ts';
import {TimetableRequest} from "./Action.ts";


interface TimetableApiResponse {
    id: number;
    dayOfWeek: string;
    timetableName:string;
    courses: Array<{
        name: string;
        code: string;
        nh:string;
        th:string;
        credits:number;

    }>;
    numberOfStudents:number;
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
        instructorId:string;
        user: {
            fullName: string;
        };
    };
    startLesson:number;
    totalLessonDay: number;
    totalLessonSemester: number;
    classId: string;
    studyTime: string;
    cancelDates:string[];
    description:string;
}

export const importTimetable = createAsyncThunk(
    'timetable/importTimetable',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await api.post(`${API_URL}/timetable/import`, formData, {
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
            const { data } = await api.get<TimetableApiResponse[]>(`${API_URL}/timetable/by-week`, {
                params: { startDate: params.startDate, endDate: params.endDate },
            });
            console.log("timetable",data);
            return data;
        } catch (e) {
            return rejectWithValue((e as AxiosError).message);
        }
    }
);

export const getRangeWeek = createAsyncThunk(
    'timetable/getRangeWeek',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}/timetable/weeks-range`);
            console.log("rangeweek",response);
            return response.data; // Trả về dữ liệu cho reducer
        } catch (e) {
            return rejectWithValue((e as AxiosError).message);
        }
    }
);

export const fetchCourseDetails = createAsyncThunk(
    'timetable/fetchCourseDetails',
    async (params: { courseId?: string; NH?: string; TH?: string; timetableName?: string }, { rejectWithValue }) => {
        try {
            type RequestParams = {
                courseId?: string;
                NH?: string;
                TH?: string;
                timetableName?: string;
            };

            const requestParams: RequestParams = {};

            // Nếu có courseId thì thêm courseId, NH và TH vào request
            if (params.courseId) {
                requestParams.courseId = params.courseId;
                requestParams.NH = params.NH;
                requestParams.TH = params.TH;
            } else if (params.timetableName) {
                // Nếu không có courseId, thì truyền timetableName
                requestParams.timetableName = params.timetableName;
            }

            // Gửi yêu cầu với các tham số phù hợp
            const { data } = await api.get(`${API_URL}/timetable/course-details`, {
                params: requestParams,
            });

            console.log(data);
            return data;
        } catch (e) {
            return rejectWithValue((e as AxiosError).message);
        }
    }
);


export const fetchTimetableByDate = createAsyncThunk(
    'timetable/fetchTimetableByDate',
    async (params:{date:string}, { rejectWithValue }) => {
        try {
            const {data} = await api.get(`${API_URL}/timetable/by-date`,{
                params:{
                    date:params.date
                }
            });
            console.log(data);
            return data;
        } catch (e) {
            return rejectWithValue((e as AxiosError).message);
        }
    }
);

export const cancelTimetable = createAsyncThunk(
    'timetable/cancelTimetable',
    async (params:{cancelDate:string,startLesson:number,roomName:string,timetableId:number}, { rejectWithValue }) => {
        try {
            const {data} = await api.post(`${API_URL}/timetable/cancel`,null,{
                params:{
                    cancelDate:params.cancelDate,
                    startLesson:params.startLesson,
                    roomName:params.roomName,
                    timetableId:params.timetableId
                }
            });
            console.log(data);
            return data;
        } catch (e) {
            return rejectWithValue((e as AxiosError).message);
        }
    }
);


export const createTimetable = createAsyncThunk(
    'timetable/createTimetable',
    async (request :TimetableRequest, { rejectWithValue }) => {
        try {
            const {data} = await api.post(`${API_URL}/timetable/create`,request);
            console.log(data);
            return data;
        } catch (e) {
            return rejectWithValue((e as AxiosError).message);
        }
    }
);



