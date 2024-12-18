import {createSlice} from "@reduxjs/toolkit";
import {changePassword, endSession, updateInformationUser} from "./Reducer.ts";

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface UpdateInformationRequest {
    firstName: string;
    lastName: string;
    email: string;
    image: string | null;
    phoneNumber: string;
    username: string;
}


interface UserState {
    successMessage: string;
    errorMessage: string;
    isLoading: boolean;
}

const initialState: UserState = {
    successMessage: '',
    errorMessage: '',
    isLoading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true;
                state.successMessage = '';
                state.errorMessage = '';
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = action.payload;
                state.errorMessage = '';

            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.successMessage = '';
                state.errorMessage = action.payload as string;
            })
            //update
            .addCase(updateInformationUser.pending,(state)=>{
                state.isLoading = true;
                state.successMessage = '';
                state.errorMessage = '';
            })
            .addCase(updateInformationUser.fulfilled,(state,action)=>{
                state.isLoading = false;
                state.successMessage = action.payload;
                state.errorMessage = '';
            })
            .addCase(updateInformationUser.rejected,(state,action)=>{
                state.isLoading = false;
                state.successMessage = '';
                state.errorMessage = action.payload as string;
            })
            //end user activity
            .addCase(endSession.pending,(state)=>{
                state.isLoading=true;
                state.successMessage='';
                state.errorMessage='';
            })
            .addCase(endSession.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.successMessage=action.payload;
                state.errorMessage='';
            })
            .addCase(endSession.rejected,(state,action)=>{
                state.isLoading=false;
                state.successMessage='';
                state.errorMessage=action.payload as string;
            })
    }
})
export default userSlice;