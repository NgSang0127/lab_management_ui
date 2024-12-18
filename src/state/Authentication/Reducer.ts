import {createAsyncThunk} from "@reduxjs/toolkit";
import {api, API_URL} from "../../config/api.ts";
import {
    AuthResponseData,
    ForgotPasswordRequest,
    LoginRequestData,
    RegisterRequest,
    ResetPasswordRequest
} from "./ActionType.ts";
import axios, {AxiosError} from "axios";


export const registerUser = createAsyncThunk<AuthResponseData, RegisterRequest>(
    'auth/registerUser',
    async (reqData, {rejectWithValue}) => {
        try {
            const {data} = await api.post(`${API_URL}/auth/register`, reqData);

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
            if (data.access_token) localStorage.setItem('accessToken', data.access_token);
            if (data.refresh_token) localStorage.setItem('refreshToken', data.refresh_token);

            console.log(data)
            return data;
        } catch (err) {
            if (err instanceof AxiosError) {
                return rejectWithValue(err.response?.data?.message || 'An error occurred');
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
)
export const getUser = createAsyncThunk(
    'auth/getUser',
    async (_, {rejectWithValue}) => {
        try {
            const {data} = await api.get(`${API_URL}/user/profile`);
            console.log("get User", data)
            return data;
        } catch (err) {
            return rejectWithValue((err as AxiosError).message);
        }
    }
)
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (request: ForgotPasswordRequest, {rejectWithValue}) => {
        try {
            const {data} = await api.post(`${API_URL}/auth/forgot-password`, request);
            return data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue('Unknown error');
        }
    }
)
export const validateResetCode = createAsyncThunk(
    'auth/validateResetCode',
    async (request: ResetPasswordRequest, {rejectWithValue}) => {
        try {
            const {data} = await api.post(`${API_URL}/auth/validate-reset-code`, request);
            return data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue('Unknown error');
        }
    }
)

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (request: ResetPasswordRequest, {rejectWithValue}) => {
        try {
            const {data} = await api.post(`${API_URL}/auth/reset-password`, request);
            return data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue('Unknown error');
        }
    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, {rejectWithValue}) => {
        try {
            localStorage.clear();
            await api.get(`${API_URL}/auth/logout`);
        } catch (err) {
            return rejectWithValue((err as AxiosError).message);
        }
    }
)





