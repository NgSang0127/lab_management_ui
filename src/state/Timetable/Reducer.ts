import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {api, API_URL} from '../../config/api.ts';
import {Semester, Timetable} from "./Action.ts";


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



export const fetchTimetables = createAsyncThunk(
    'timetable/fetchTimetables',
    async (params: { startDate: string; endDate: string }, { rejectWithValue }) => {
        try {
            console.log(`Fetching timetables for week: ${params.startDate} to ${params.endDate}`);

            // Use a direct axios request without authentication for this public endpoint
            const { data } = await axios.get<TimetableApiResponse[]>(`${API_URL}/timetable/by-week`, {
                params: { startDate: params.startDate, endDate: params.endDate },
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false
            });

            console.log(`Timetable data fetched: ${data.length} items for week ${params.startDate} to ${params.endDate}`);

            if (data.length === 0) {
                console.log('No timetable data returned from the API for the selected week.');
            }

            return data;
        } catch (error) {
            console.error('Error fetching timetables:', error);
            if (axios.isAxiosError(error)) {
                console.error('API Error details:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    url: error.config?.url,
                    params: error.config?.params
                });

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

export const getRangeWeek = createAsyncThunk(
    'timetable/getRangeWeek',
    async (param: { semesterId:number }, { rejectWithValue }) => {
        try {
            // Use a direct axios request without authentication for this public endpoint
            const response = await axios.get(`${API_URL}/timetable/weeks-range`,{
                params:{
                    semesterId:param.semesterId
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false
            });
            console.log(`Week range fetched for semester ${param.semesterId}`);
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

export const getFourSemesterRecent = createAsyncThunk(
    'timetable/getFourSemesterRecent',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<Semester[]>('/timetable/semester');
            console.log("four semester",response.data)
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


export const fetchCourseDetails = createAsyncThunk(
    'timetable/fetchCourseDetails',
    async (params: { courseId?: string; NH?: string; TH?: string;decodeStudyTime?:string; timetableName?: string }, { rejectWithValue }) => {
        try {
            type RequestParams = {
                courseId?: string;
                NH?: string;
                TH?: string;
                studyTime?:string;
                timetableName?: string;
            };

            const requestParams: RequestParams = {};

            // Nếu có courseId thì thêm courseId, NH và TH vào request
            if (params.courseId) {
                requestParams.courseId = params.courseId;
                requestParams.NH = params.NH;
                requestParams.TH = params.TH;
                requestParams.studyTime=params.decodeStudyTime;
            } else if (params.timetableName) {
                // Nếu không có courseId, thì truyền timetableName
                requestParams.timetableName = params.timetableName;
            }

            // Use direct axios request without authentication
            const { data } = await axios.get(`${API_URL}/timetable/course-details`, {
                params: requestParams,
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false
            });

            console.log(data);
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


export const createTimetable = createAsyncThunk(
    'timetable/createTimetable',
    async (request :Timetable, { rejectWithValue }) => {
        try {
            const {data} = await api.post('/timetable/create',request);
            console.log(data);
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
);