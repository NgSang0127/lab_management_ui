import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Snackbar, Alert } from '@mui/material';
import { useAppDispatch } from "../../state/store"; // Hook để dispatch action
import { resetPassword } from "../../state/Authentication/Reducer.ts"; // Import action để update password

const ResetPassword: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch(); // Khai báo dispatch

    const resetCode = location.state?.resetCode; // Nhận mã reset từ state

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleSubmit = () => {
        if (password === confirmPassword) {
            // Gọi dispatch để gửi mã reset và mật khẩu mới tới backend
            dispatch(resetPassword({ code: resetCode, newPassword: password }));

            setSnackbarMessage('Password updated successfully!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            // Điều hướng đến trang login hoặc trang bạn muốn sau khi thành công
            navigate('/account/signin');
        } else {
            setSnackbarMessage('Passwords do not match.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    return (
        <Box className="flex flex-col items-center p-8 w-full max-w-md mx-auto border border-gray-300 rounded-lg shadow-lg bg-white mt-10 space-y-6">
            <h3 className="text-xl font-semibold">Enter New Password</h3>
            <TextField
                type="password"
                label="New Password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4"
            />
            <TextField
                type="password"
                label="Confirm Password"
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mb-6"
            />
            <Button
                variant="contained"
                className="w-full py-2 text-white font-semibold"
                onClick={handleSubmit}
            >
                Submit
            </Button>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ResetPassword;
