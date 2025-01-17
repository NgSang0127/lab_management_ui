import {createAsyncThunk} from "@reduxjs/toolkit";
import {api} from "../../config/api.ts";
import axios from "axios";
import {CreateUserRequestByAdmin} from "./Action.ts";
import {PageResponse} from "../Page/ActionType.ts";
import {User} from "../Authentication/Action.ts";

export const getUsers = createAsyncThunk(
    'admin/getUsers',
    async (params:{page:number,size:number,keyword:string,role:string} ,{rejectWithValue}) => {
        try {
            const response =await api.get<PageResponse<User>>('/admin/users',{
                params:{
                    page:params.page,
                    size:params.size,
                    keyword:params.keyword,
                    role:params.role

                }
            });
            return response.data;
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

export const createUser = createAsyncThunk(
    'admin/createUser',
    async (request:CreateUserRequestByAdmin, {rejectWithValue}) => {
        try {
            const response =await api.post('/admin/users',request);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data) {
                    const backendError = error.response.data.error || 'Unknown backend error';
                    return rejectWithValue(backendError);
                }
                return rejectWithValue('No response from server');
            }
            return rejectWithValue('Unknown error');
        }
    }
)

export const updateUser = createAsyncThunk(
    'admin/updateUser',
    async ({id, request}: { id: number; request: CreateUserRequestByAdmin }, {rejectWithValue}) => {
        try {
            const response =await api.put(`/admin/users/${id}`,request);
            return response.data;
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

export const deleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (id:number, {rejectWithValue}) => {
        try {
            const response =await api.delete(`/admin/users/${id}`);
            return response.data;
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

