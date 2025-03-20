import {createAsyncThunk} from "@reduxjs/toolkit";
import {api, API_URL} from "../../config/api.ts";
import {
    AuthResponseData,
    ForgotPasswordRequest,
    LoginRequestData,
    RegisterRequest,
    ResetPasswordRequest, VerificationCodeRequest
} from "./ActionType.ts";
import axios from "axios";


export const registerUser = createAsyncThunk<AuthResponseData, RegisterRequest>(
    'auth/registerUser',
    async (reqData, {rejectWithValue}) => {
        try {
            const {data} = await api.post(`${API_URL}/auth/register`, reqData);

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

export const loginUser = createAsyncThunk<AuthResponseData, LoginRequestData, { rejectValue: string }>(
    'auth/loginUser',
    async (reqData, {rejectWithValue}) => {
        try {
            const {data} = await api.post<AuthResponseData>(`${API_URL}/auth/login`, reqData);
            if (data.access_token) localStorage.setItem('accessToken', data.access_token);

            console.log(data)
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
)
export const getUser = createAsyncThunk(
    'auth/getUser',
    async (_, {rejectWithValue}) => {
        try {
            const {data} = await api.get(`${API_URL}/user/profile`);
            console.log("get User", data)
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
)
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (request: ForgotPasswordRequest, {rejectWithValue}) => {
        try {
            const {data} = await api.post(`${API_URL}/auth/forgot-password`, request);
            return data;
        } catch (error: unknown) {
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
)
export const validateResetCode = createAsyncThunk(
    'auth/validateResetCode',
    async (request: ResetPasswordRequest, {rejectWithValue}) => {
        try {
            const {data} = await api.post(`${API_URL}/auth/validate-reset-code`, request);
            return data;
        } catch (error: unknown) {
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
)

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (request: ResetPasswordRequest, {rejectWithValue}) => {
        try {
            const {data} = await api.post(`${API_URL}/auth/reset-password`, request);
            return data;
        } catch (error: unknown) {
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
)

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, {rejectWithValue}) => {
        try {
            await api.get(`${API_URL}/auth/logout`);
            //localStorage.clear();
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
)

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async (request:VerificationCodeRequest, { rejectWithValue }) => {
        try {
            const { data } = await api.post<AuthResponseData>(`${API_URL}/auth/verify-qr`, request);
            if (data.access_token) localStorage.setItem('accessToken', data.access_token);
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
)

export const toggleTfaFactor = createAsyncThunk(
    'auth/toggleTfaFactor',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.post<AuthResponseData>(`${API_URL}/user/toggle-tfa`);
            if (data.access_token) localStorage.setItem('accessToken', data.access_token);
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
)


export const sendTFAEmail = createAsyncThunk(
    'auth/sendTFAEmail',
    async (username:string, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/email-otp`, { username });
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

export const verifyTFAEmail = createAsyncThunk(
    'auth/verifyTFAEmail',
    async (request:VerificationCodeRequest, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`${API_URL}/auth/verify-otp`,request);
            if (data.access_token) localStorage.setItem('accessToken', data.access_token);

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
)





