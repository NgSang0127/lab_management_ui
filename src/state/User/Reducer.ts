import {createAsyncThunk} from "@reduxjs/toolkit";
import {ChangePasswordRequest, UpdateInformationRequest} from "./Action.ts";
import {api, API_URL} from "../../config/api.ts";
import axios from "axios";

export const changePassword=createAsyncThunk(
    'user/changePassword',
    async(data:ChangePasswordRequest,{rejectWithValue})=>{
        try{
            const response=await api.post(`${API_URL}/user/change-password`,data);
            console.log("change password",response.data)
            return response.data;
        }catch (error:unknown) {
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

export const updateInformationUser=createAsyncThunk(
    'user/updateInformation',
    async (data:UpdateInformationRequest,{rejectWithValue})=>{
        try{
            const response=await api.put(`${API_URL}/user/update`,data);
            return response.data;
        }catch (error:unknown) {
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


export const endSession=createAsyncThunk(
    'user/endSession',
    async (_,{rejectWithValue})=>{
        try{
            const response=await api.post('/user-activity/end-session',{});
            return response.data;
        }catch (error:unknown) {
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