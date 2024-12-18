import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TextField, Button, Typography, Box, InputAdornment, IconButton, Snackbar, Alert } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { RootState, useAppDispatch } from '../../../state/store.ts';
import { ChangePasswordRequest } from '../../../state/User/Action.ts';
import { changePassword } from '../../../state/User/Reducer.ts';

const PASSWORD_MIN_LENGTH = 8;
const MISMATCH_ERROR = 'Mật khẩu mới và xác nhận mật khẩu không khớp!';
const LENGTH_ERROR = `Mật khẩu mới phải có ít nhất ${PASSWORD_MIN_LENGTH} ký tự!`;

const ChangePassword = () => {
    const dispatch = useAppDispatch();
    const { isLoading, successMessage, errorMessage } = useSelector((state: RootState) => state.user);

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

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    // Input change handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordState((prev) => ({ ...prev, [name]: value }));
    };

    // Toggle password visibility
    const togglePasswordVisibility = (field: keyof typeof visibilityState) => {
        setVisibilityState((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    // Save password with validation
    const handleSave = () => {
        const { newPassword, confirmPassword } = passwordState;

        if (newPassword !== confirmPassword) {
            setSnackbarMessage(MISMATCH_ERROR);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        if (newPassword.length < PASSWORD_MIN_LENGTH) {
            setSnackbarMessage(LENGTH_ERROR);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        dispatch(changePassword(passwordState));
    };

    useEffect(() => {
        if (successMessage) {
            setSnackbarMessage(successMessage);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setPasswordState({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        }
    }, [successMessage]);

    useEffect(() => {
        if (errorMessage) {
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    }, [errorMessage]);

    // Reusable Password Field Component
    const renderPasswordField = (
        label: string,
        name: keyof ChangePasswordRequest,
        isVisible: boolean
    ) => (
        <TextField
            label={label}
            name={name}
            type={isVisible ? 'text' : 'password'}
            value={passwordState[name]}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: '16px' }}
            slotProps={{
                input:{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={() => togglePasswordVisibility(name as keyof typeof visibilityState)}
                            edge="end"
                        >
                            {isVisible ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                )},
            }}
        />
    );

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box
            className="p-6 border rounded-lg shadow-md bg-white"
            sx={{ maxWidth: '1200px', margin: 'auto' }}
        >
            <Typography variant="h5" sx={{ marginBottom: '24px', textAlign: 'center' }}>
                Cài đặt bảo mật
            </Typography>
            {renderPasswordField('Mật khẩu hiện tại', 'currentPassword', visibilityState.currentPassword)}
            {renderPasswordField('Mật khẩu mới', 'newPassword', visibilityState.newPassword)}
            {renderPasswordField('Xác nhận mật khẩu mới', 'confirmPassword', visibilityState.confirmPassword)}

            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSave}
                sx={{ width: '100%', padding: '7px' }}
                disabled={isLoading}
            >
                {isLoading ? 'Đang thay đổi...' : 'Lưu mật khẩu'}
            </Button>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ChangePassword;
