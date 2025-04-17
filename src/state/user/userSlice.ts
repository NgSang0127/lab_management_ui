import {createSlice} from "@reduxjs/toolkit";
import {changePassword, updateInformationUser} from "./thunk.ts";

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
    changePassword: {
        successMessage: string;
        errorMessage: string;
        isLoading: boolean;
    };
    updateInformation: {
        successMessage: string;
        errorMessage: string;
        isLoading: boolean;
    };
}

const initialState: UserState = {
    changePassword: {
        successMessage: '',
        errorMessage: '',
        isLoading: false,
    },
    updateInformation: {
        successMessage: '',
        errorMessage: '',
        isLoading: false,
    },
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Change Password
            .addCase(changePassword.pending, (state) => {
                state.changePassword.isLoading = true;
                state.changePassword.successMessage = '';
                state.changePassword.errorMessage = '';
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.changePassword.isLoading = false;
                state.changePassword.successMessage = action.payload;
                state.changePassword.errorMessage = '';
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.changePassword.isLoading = false;
                state.changePassword.successMessage = '';
                state.changePassword.errorMessage = action.payload as string;
            })
            // Update Information
            .addCase(updateInformationUser.pending, (state) => {
                state.updateInformation.isLoading = true;
                state.updateInformation.successMessage = '';
                state.updateInformation.errorMessage = '';
            })
            .addCase(updateInformationUser.fulfilled, (state, action) => {
                state.updateInformation.isLoading = false;
                state.updateInformation.successMessage = action.payload;
                state.updateInformation.errorMessage = '';
            })
            .addCase(updateInformationUser.rejected, (state, action) => {
                state.updateInformation.isLoading = false;
                state.updateInformation.successMessage = '';
                state.updateInformation.errorMessage = action.payload as string;
            });
    },
});

export default userSlice;