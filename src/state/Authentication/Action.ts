import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {loginUser, registerUser} from "./Reducer.ts";
import {AuthResponseData} from "./ActionType.ts";

// Define the AuthState interface
interface AuthState {
    user: never | null; // Allow user to be any type or null
    isLoading: boolean;
    error: string | null; // Error can be a string or null
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    activationStatus: string | null;
    success: string;
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    activationStatus: null,
    success: "",
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
                state.error = null; // Reset error on pending
                state.success = "";
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponseData>) => {
                state.isLoading = false;
                state.success = action.payload.message;

            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                // Ensure action.payload is handled correctly
                state.error = action.payload as string || 'An unknown error occurred';
            })

        //get user
            .addCase(loginUser.pending,(state)=>{
                state.isLoading=true;
                state.error=null;
                state.success ="";
            })
            .addCase(loginUser.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.accessToken=action.payload.accessToken;
                state.refreshToken=action.payload.refreshToken;
                state.success="Login success";
            })
            .addCase(loginUser.rejected,(state,action)=>{
                state.isLoading=false;
                state.error=action.payload as string || 'An unknown error occurred';
                state.success="";
            })
    },
});
export  default authSlice.reducer;
