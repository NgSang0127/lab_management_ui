import React, { useEffect, useState, useCallback } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    InputAdornment,
    IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../state/store.ts';
import { ChangePasswordRequest } from '../../../state/User/Action.ts';
import { changePassword } from '../../../state/User/Reducer.ts';
import CustomAlert from "../../Support/CustomAlert.tsx";
import LoadingIndicator from "../../Support/LoadingIndicator.tsx";
import { AlertColor } from '@mui/material/Alert';

const PASSWORD_MIN_LENGTH = 8;
const MISMATCH_ERROR = 'The new password and confirmation do not match!';
const LENGTH_ERROR = `The new password must be at least ${PASSWORD_MIN_LENGTH} characters long!`;

const ChangePassword: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.user
    );

    const [passwordState, setPasswordState] = useState<ChangePasswordRequest>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [visibilityState, setVisibilityState] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const [alert, setAlert] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: "",
        severity: "info",
    });


    const showAlert = (message: string, severity: 'success' | 'error' | 'info') => {
        setAlert({ open: true, message, severity });
    };


    const handleCloseAlert = useCallback(() => {
        setAlert((prev) => ({ ...prev, open: false }));
    }, []);


    useEffect(() => {
        if (successMessage || errorMessage) {
            const message = successMessage || errorMessage;
            const severity = successMessage ? 'success' : 'error';
            showAlert(message, severity);

            if (successMessage) {
                setPasswordState({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            }
        }
    }, [successMessage, errorMessage]);


    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setPasswordState((prev) => ({ ...prev, [name]: value }));
    };


    const togglePasswordVisibility = (field: keyof typeof visibilityState) => {
        setVisibilityState((prev) => ({ ...prev, [field]: !prev[field] }));
    };


    const handleSave = () => {
        const { newPassword, confirmPassword, currentPassword } = passwordState;

        if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
            showAlert("Please fill in all fields.", 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showAlert(MISMATCH_ERROR, 'error');
            return;
        }

        if (newPassword.length < PASSWORD_MIN_LENGTH) {
            showAlert(LENGTH_ERROR, 'error');
            return;
        }

        // Dispatch changePassword action
        dispatch(changePassword(passwordState));
    };

    return (
        <Box
            sx={{
                padding: '24px',
                margin: '20px',
                maxWidth: '900px',
                marginLeft: 'auto',
                marginRight: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff',
            }}
        >
            {/* Loading Indicator */}
            {isLoading && <LoadingIndicator open={isLoading} />}

            <Typography
                variant="h5"
                sx={{
                    marginBottom: '24px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}
            >
                Security Settings
            </Typography>

            {/* Password Fields */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                    <TextField
                        key={field}
                        label={
                            field === 'currentPassword'
                                ? 'Current Password'
                                : field === 'newPassword'
                                    ? 'New Password'
                                    : 'Confirm New Password'
                        }
                        name={field}
                        type={visibilityState[field as keyof typeof visibilityState] ? 'text' : 'password'}
                        value={passwordState[field as keyof ChangePasswordRequest]}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        slotProps={{
                            input:{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => togglePasswordVisibility(field as keyof typeof visibilityState)}
                                        edge="end"
                                        aria-label={`Toggle ${
                                            field === 'currentPassword'
                                                ? 'current password'
                                                : field === 'newPassword'
                                                    ? 'new password'
                                                    : 'confirm password'
                                        } visibility`}
                                    >
                                        {visibilityState[field as keyof typeof visibilityState] ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )},
                        }}
                        aria-label={
                            field === 'currentPassword'
                                ? 'Current Password'
                                : field === 'newPassword'
                                    ? 'New Password'
                                    : 'Confirm Password'
                        }
                    />
                ))}
            </Box>

            {/* Save Button */}
            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSave}
                sx={{ width: '100%', padding: '12px', marginTop: '24px' }}
                disabled={isLoading}
                aria-label="Save Password"
            >
                Save Password
            </Button>

            {/* Custom Alert for Notifications */}
            <CustomAlert
                open={alert.open}
                onClose={handleCloseAlert}
                message={alert.message}
                severity={alert.severity}
            />
        </Box>
    );

};

export default ChangePassword;
