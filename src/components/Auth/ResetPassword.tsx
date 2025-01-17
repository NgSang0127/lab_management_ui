import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useAppDispatch } from "../../state/store";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { resetPassword } from "../../state/Authentication/Reducer";
import CustomAlert from "../Support/CustomAlert.tsx";
import LoadingIndicator from "../Support/LoadingIndicator.tsx";


const ResetPassword: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const resetCode = location.state?.resetCode; // Receive reset code from state

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [alert, setAlert] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const { isLoading, success, error } = useSelector((state: RootState) => state.auth);

    const showAlert = (message: string, severity: 'success' | 'error' | 'info') => {
        setAlert({ open: true, message, severity });
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password.trim() === '' || confirmPassword.trim() === '') {
            showAlert("Please fill in all fields.", 'error');
            return;
        }

        if (password !== confirmPassword) {
            showAlert("Passwords do not match.", 'error');
            return;
        }

        if (password.length < 8) {
            showAlert("Password must be at least 8 characters long.", 'error');
            return;
        }

        if (!resetCode) {
            showAlert("Invalid reset code.", 'error');
            return;
        }

        try {
            await dispatch(resetPassword({ code: resetCode, newPassword: password })).unwrap();
            showAlert(success as string, 'success');
            navigate('/account/signin');
        } catch {
            showAlert(error || "An error occurred while resetting the password.", 'error');
        }
    };

    const handleCloseAlert = () => {
        setAlert(prev => ({ ...prev, open: false }));
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '32px',
                margin: '20px auto',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff',
                maxWidth: '400px',
            }}
        >
            {/* Loading Indicator */}
            {isLoading && <LoadingIndicator open={isLoading} />}

            <Typography variant="h5" sx={{ marginBottom: '24px', fontWeight: 'bold' }}>
                Enter New Password
            </Typography>

            <TextField
                type="password"
                label="New Password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: '16px' }}
                required
                aria-label="New Password"
            />
            <TextField
                type="password"
                label="Confirm Password"
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ marginBottom: '24px' }}
                required
                aria-label="Confirm Password"
            />
            <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{ padding: '12px' }}
                disabled={isLoading}
                aria-label="Submit New Password"
            >
                Submit
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

export default ResetPassword;
