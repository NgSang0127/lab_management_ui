import {createAsyncThunk} from "@reduxjs/toolkit";
import {api, API_URL} from "../../config/api.ts";
import {CourseLogStatistics, DailyLogStatistics, Logs, UsageTimeUsers} from "./Action.ts";
import {AxiosError} from "axios";
import {PageResponse} from "../Page/ActionType.ts";

export const getLogsBetween = createAsyncThunk(
    'logs/getLogsBetween',
    async (params: { startDate: string; endDate: string, page: number, size: number }, {rejectWithValue}) => {
        try {
            const {data} = await api.get<PageResponse<Logs>>(`${API_URL}/logs/between`, {
                params: {
                    startDate: params.startDate,
                    endDate: params.endDate,
                    page: params.page,
                    size: params.size

                }
            });
            console.log("logs", data);
            return data;
        } catch (e) {
            return rejectWithValue((e as AxiosError).message);
        }
    }
)

export const getDailyLogStatistic = createAsyncThunk(
    'logs/getDailyLogStatistic',
    async (params: { startDate: string; endDate: string }, {rejectWithValue}) => {
        try {
            const {data} = await api.get<DailyLogStatistics[]>(`${API_URL}/logs/statistics/daily`, {
                params: {
                    startDate: params.startDate,
                    endDate: params.endDate,

                }
            });
            console.log("logs", data);
            return data;
        } catch (e) {
            return rejectWithValue((e as AxiosError).message);
        }
    }
)

export const getCourseLogStatistics = createAsyncThunk(
    'logs/getCourseLogStatistics',
    async (params: { startDate: string; endDate: string}, {rejectWithValue}) => {
        try {
            const {data} = await api.get<CourseLogStatistics[]>(`${API_URL}/logs/statistics/course`, {
                params: {
                    startDate: params.startDate,
                    endDate: params.endDate,
                }
            });
            console.log("logs", data);
            return data;
        } catch (e) {
            return rejectWithValue((e as AxiosError).message);
        }
    }
)
export const getUsageTimeUsers=createAsyncThunk(
    'logs/getUsageTimeUsers',
    async(params:{date:string,role:string,page:number,size:number},{rejectWithValue})=>{
        try{
            const {data}=await api.get<PageResponse<UsageTimeUsers>>('/user-activity/list-time',{
                params:{
                    date:params.date,
                    role:params.role,
                    page:params.page,
                    size:params.size,
                }
            });
            return data;
        }catch (e) {
            return rejectWithValue((e as AxiosError).message);
        }
    }
)