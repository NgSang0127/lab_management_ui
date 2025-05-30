import {createAsyncThunk} from "@reduxjs/toolkit";
import {api, API_URL} from "../../config/api.ts";
import {
    AuthResponseData,
    ForgotPasswordRequest,
    LoginRequestData,
    RegisterRequest,
    ResetPasswordRequest, VerificationCodeRequest
} from "./types.ts";
import axios from "axios";
import {handleAxiosError} from "../../utils/handleAxiosError.ts";


export const registerUser = createAsyncThunk<AuthResponseData, RegisterRequest>(
    'auth/registerUser',
    async (reqData, {rejectWithValue}) => {
        try {
            const {data} = await api.post(`${API_URL}/auth/register`, reqData);

            return data;
        } catch (error) {
            const err = handleAxiosError(error);
            return rejectWithValue(err.message);
        }
    }
);

export const loginUser = createAsyncThunk<AuthResponseData, LoginRequestData, { rejectValue: string }>(
    'auth/loginUser',
    async (reqData, { rejectWithValue }) => {
        try {
            const { data } = await api.post<AuthResponseData>(`${API_URL}/auth/login`, reqData);

            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

                if (data.refreshToken) {
                    localStorage.setItem('refreshToken', data.refreshToken);
                }
            }

            return data;
        } catch (error) {
            const err = handleAxiosError(error);
            return rejectWithValue(err.message);
        }
    }
);

export const getUser = createAsyncThunk(
    'auth/getUser',
    async (_, {rejectWithValue}) => {
        try {
            const {data} = await api.get(`${API_URL}/user/profile`);
            console.log("get user", data)
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
            const err = handleAxiosError(error);
            return rejectWithValue(err.message);
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
                const err = handleAxiosError(error);
                return rejectWithValue(err.message);
            }
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

            // Clear tokens from localStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');

            // Clear authorization headers
            api.defaults.headers.common['Authorization'] = '';
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
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);

                // Store refresh token if available
                if (data.refreshToken) {
                    localStorage.setItem('refreshToken', data.refreshToken);
                }
            }
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = handleAxiosError(error);
                return rejectWithValue(err.message);
            }
        }
    }
)

export const toggleTfaFactor = createAsyncThunk(
    'auth/toggleTfaFactor',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.post<AuthResponseData>(`${API_URL}/user/toggle-tfa`);
            if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
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
            const err = handleAxiosError(error);
            return rejectWithValue(err.message);
        }
    }
);

export const verifyTFAEmail = createAsyncThunk(
    'auth/verifyTFAEmail',
    async (request:VerificationCodeRequest, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`${API_URL}/auth/verify-otp`,request);
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);

                // Store refresh token if available
                if (data.refreshToken) {
                    localStorage.setItem('refreshToken', data.refreshToken);
                }
            }

            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = handleAxiosError(error);
                return rejectWithValue(err.message);
            }
        }
    }
)