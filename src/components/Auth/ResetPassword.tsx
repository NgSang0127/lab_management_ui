import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useAppDispatch } from "../../state/store";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { resetPassword } from "../../state/Authentication/Reducer";
import CustomAlert from "../Support/CustomAlert.tsx";
import LoadingIndicator from "../Support/LoadingIndicator.tsx";
import {useTranslation} from "react-i18next";


const ResetPassword: React.FC = () => {
    const {t}=useTranslation();

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const resetCode = location.state?.resetCode;
    const email=location.state?.email;

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
            showAlert(t('reset_password.errors.allFields'), 'error');
            return;
        }

        if (password !== confirmPassword) {
            showAlert(t('reset_password.errors.password'), 'error');
            return;
        }

        if (password.length < 8) {
            showAlert(t('reset_password.errors.password_length'), 'error');
            return;
        }


        try {
            await dispatch(resetPassword({email, code: resetCode, newPassword: password })).unwrap();
            showAlert(success as string, 'success');
            setTimeout(() => {
                navigate("/account/signin");
            }, 2000);
        } catch {
            showAlert(error || t('reset_password.errors.navigate'), 'error');
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
                {t('reset_password.title')}
            </Typography>

            <TextField
                type="password"
                label={t('reset_password.newPassword')}
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
                label={t('reset_password.confirmPassword')}
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

                {t('reset_password.button')}
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
