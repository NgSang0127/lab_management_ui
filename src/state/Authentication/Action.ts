import { createSlice } from "@reduxjs/toolkit";
import {loginUser, registerUser} from "./Reducer.ts";


export interface Auth{
    accessToken: string;
    refreshToken: string;
}

interface AuthState {
    auth: Auth;
    isLoading: boolean;
    error: string | null;
}

// @ts-ignore
const initialState: AuthState = {
    auth:null,
    isLoading:false,
    error:null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        logout: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register user
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string ;
            })

        //get user
            .addCase(loginUser.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
            })
            .addCase(loginUser.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.auth=action.payload;
            })
            .addCase(loginUser.rejected,(state,action)=>{
                state.isLoading=false;
                state.error=action.payload as string;

            })
    },
});
export  default authSlice.reducer;
