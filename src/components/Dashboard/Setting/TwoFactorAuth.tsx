import React, { useEffect, useState } from 'react';
import { Box, Typography, Switch, TextField, Button, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../state/store.ts';
import CustomAlert from '../../Support/CustomAlert.tsx';
import { toggleTfaFactor, verifyOtp } from "../../../state/Authentication/Reducer.ts";
import { qrTfa } from "../../../state/User/Reducer.ts";

const TwoFactorAuth: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user, isLoading } = useSelector((state: RootState) => state.auth);
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
    const [qrCodeImage, setQrCodeImage] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('');

    const [alert, setAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    useEffect(() => {
        if (user?.twoFactorEnabled !== undefined) {
            setIsTwoFactorEnabled(user.twoFactorEnabled);
            getQrCode();
        }
    }, [user]);

    const getQrCode = async () => {
        try {
            setLoading(true);
            const response = await dispatch(qrTfa()).unwrap();
            if (response.secretImageUri) {
                setQrCodeImage(response.secretImageUri);
            }
        } catch (error) {
            console.error("Failed to fetch QR code:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user?.username) {
            console.error('Username is missing!');
            return;
        }

        try {
            // Gửi mã OTP đến API để xác minh
            await dispatch(verifyOtp({ code: otp, username: user?.username })).unwrap();

            // Nếu OTP xác minh thành công, hiển thị thông báo thành công
            showAlert('OTP verification successful!', 'success');
        } catch (error) {
            console.error('OTP verification failed:', error);
            // Nếu có lỗi, hiển thị thông báo lỗi
            showAlert('OTP verification failed. Please try again.', 'error');
        }
    };


    const showAlert = (message: string, severity: 'success' | 'error') => {
        setAlert({ open: true, message, severity });
    };

    const handleToggleTwoFactor = async () => {
        setLoading(true);
        try {
            const response = await dispatch(toggleTfaFactor()).unwrap();
            if (response.secretImageUri) {
                setQrCodeImage(response.secretImageUri);
                setIsTwoFactorEnabled(true);
                showAlert("Two-Factor Authentication has been enabled successfully.", 'success');
            } else {
                setQrCodeImage('');
                setIsTwoFactorEnabled(false);
                showAlert("Two-Factor Authentication has been disabled successfully.", 'success');
            }
        } catch (error) {
            showAlert("An error occurred while toggling Two-Factor Authentication.", 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ padding: '24px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff' }}>
            <Typography variant="h5" sx={{
                marginBottom: '24px',
                fontWeight: '600',
                textAlign: 'center',
            }}>
                Two-Factor Authentication
            </Typography>

            {isLoading && <CircularProgress sx={{ display: 'block', margin: '0 auto' }} />}

            <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
                <Typography variant="body1">Enable Two-Factor Authentication</Typography>
                <Switch
                    checked={isTwoFactorEnabled}
                    onChange={handleToggleTwoFactor}
                    disabled={loading}
                    color="primary"
                />
            </Box>

            {qrCodeImage && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    marginBottom: '24px'
                }}>
                    <Typography variant="body2" sx={{ marginBottom: '16px' }}>
                        Scan this QR Code with your authentication app:
                    </Typography>
                    <img
                        src={qrCodeImage}
                        alt="QR Code for Two-Factor Authentication"
                        style={{ width: '350px', height: '350px', marginBottom: '16px' }}
                    />
                    <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '16px' }}>
                        After scanning, enter the generated code in your authentication app to complete setup.
                    </Typography>

                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <TextField
                            label="OTP Code"
                            variant="outlined"
                            fullWidth
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP code"
                            sx={{ marginBottom: 3 }}
                        />
                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                        >
                            Verify
                        </Button>
                    </form>
                </Box>
            )}

            <CustomAlert open={alert.open} onClose={() => setAlert({ ...alert, open: false })} message={alert.message} severity={alert.severity} />
        </Box>
    );
};

export default TwoFactorAuth;
