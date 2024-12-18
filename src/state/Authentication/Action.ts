import {createSlice} from "@reduxjs/toolkit";
import {forgotPassword, getUser, loginUser, logout, registerUser, resetPassword, validateResetCode} from "./Reducer.ts";


export interface Auth {
    access_token: string;
    refresh_token: string;
    role: string;
    message: string;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    image:string;
    role: Role;
    accountLocked: boolean;
    enabled: boolean;
    createdDate: string;
    lastModifiedDate: string;
}


export enum Role {
    STUDENT = "STUDENT",
    TEACHER = "TEACHER",
    ADMIN = "ADMIN"
}

interface AuthState {
    auth: Auth | null;
    isLoading: boolean;
    error: string | null;
    success: string | null;
    user: User | null;
}

const initialState: AuthState = {
    auth: null,
    user: null,
    success:'',
    isLoading: false,
    error: null,
};


export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Register user
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.auth = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            //login user
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.auth = action.payload;

            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;

            })
            //getUser
            .addCase(getUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            //logout
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isLoading = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            //forgotPassword
            .addCase(forgotPassword.pending,(state)=>{
                state.isLoading = true;
                state.error=null;
            })
            .addCase(forgotPassword.fulfilled,(state,action)=>{
                state.isLoading = false;
                state.success=action.payload;
                state.error=null;
            })
            .addCase(forgotPassword.rejected,(state,action)=>{
                state.isLoading = false;
                state.success='';
                state.error=action.payload as string;
            })
        //validate reset code
            .addCase(validateResetCode.pending,(state)=>{
                state.isLoading = true;
                state.error=null;
            })
            .addCase(validateResetCode.fulfilled,(state, action)=>{
                state.isLoading = false;
                state.success=action.payload;
                state.error=null;
            })
            .addCase(validateResetCode.rejected,(state, action)=>{
                state.isLoading = false;
                state.success='';
                state.error=action.payload as string;
            })
        //reset password
            .addCase(resetPassword.pending,(state)=>{
                state.isLoading = true;
                state.error=null;
            })
            .addCase(resetPassword.fulfilled,(state, action)=>{
                state.isLoading = false;
                state.success=action.payload;
                state.error=null;
            })
            .addCase(resetPassword.rejected,(state, action)=>{
                state.isLoading = false;
                state.success='';
                state.error=action.payload as string;
            })

    },
});
export default authSlice.reducer;
