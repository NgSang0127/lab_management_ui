import {createAsyncThunk} from "@reduxjs/toolkit";
import {api, API_URL} from "../../config/api.ts";
import {AuthResponseData, LoginRequestData, RegisterRequest} from "./ActionType.ts";
import {AxiosError} from "axios";


export const registerUser = createAsyncThunk<AuthResponseData, RegisterRequest>(
    'auth/registerUser',
    async (reqData, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`${API_URL}/auth/register`, reqData);

            return data;
        } catch (err) {

            return rejectWithValue((err as AxiosError).message);
        }
    }
);

export const loginUser = createAsyncThunk<AuthResponseData, LoginRequestData, { rejectValue: string }>(
    'auth/loginUser',
    async (reqData, {rejectWithValue}) => {
        try {
            const {data} = await api.post<AuthResponseData>(`${API_URL}/auth/login`, reqData);
            if (data.accessToken) localStorage.setItem('jwt', data.accessToken);
            if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);


            return data;
        } catch (err) {
            if (err instanceof AxiosError) {
                return rejectWithValue(err.response?.data?.message || 'An error occurred');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
)

