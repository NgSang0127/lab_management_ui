import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useAppDispatch } from "../../state/store.ts";
import { resetPassword } from "../../state/auth/thunk.ts";
import CustomAlert from "../../components/support/CustomAlert.tsx";
import LoadingIndicator from "../../components/support/LoadingIndicator.tsx";
import { useTranslation } from "react-i18next";
import { styled, alpha } from '@mui/material/styles';
import { Helmet } from "react-helmet-async";

const PageContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
    },
}));

const FormContainer = styled('form')(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
    borderRadius: '20px',
    boxShadow: theme.shadows[3],
    backgroundColor: theme.palette.background.paper,
    maxWidth: '450px',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3),
        maxWidth: '90%',
    },
}));

const ResetPassword: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const resetCode = location.state?.resetCode;
    console.log("Reset code:", resetCode);
    const email = location.state?.email;

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

    const showAlert = (message: string, severity: 'success' | 'error' | 'info') => {
        console.log("Showing alert:", { message, severity });
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

        setIsLoading(true);
        try {
            await dispatch(resetPassword({ email, code: resetCode, newPassword: password })).unwrap();
            showAlert(t('reset_password.success'), 'success');

            setTimeout(() => {
                navigate("/account/signin");
            }, 2000);
        } catch (error: any) {
            console.error("Reset password failed:", error);
            const message = error?.message || t('reset_password.errors.navigate');
            showAlert(message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseAlert = () => {
        console.log("Closing alert");
        setAlert(prev => ({ ...prev, open: false }));
    };

    return (
        <>
            <Helmet>
                <title>Reset Password | Lab Management IT</title>
            </Helmet>
            <PageContainer>
                <FormContainer onSubmit={handleSubmit}>
                    {isLoading && <LoadingIndicator open={isLoading} />}
                    <Typography
                        variant="h4"
                        sx={{
                            marginBottom: '16px',
                            fontWeight: 'bold',
                            color: 'text.primary',
                            textAlign: 'center',
                            fontSize: { xs: '1.8rem', sm: '2rem' },
                        }}
                    >
                        {t('reset_password.title')}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            marginBottom: '32px',
                            color: 'text.secondary',
                            textAlign: 'center',
                            fontSize: '1rem',
                            maxWidth: '80%',
                        }}
                    >
                        {t('reset_password.description')}
                    </Typography>
                    <TextField
                        type="password"
                        label={t('reset_password.newPassword')}
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                            marginBottom: '20px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: 'grey.50',
                                transition: 'all 0.3s ease',
                                '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                    boxShadow: theme => `0 0 10px ${alpha(theme.palette.primary.main, 0.2)}`,
                                },
                            },
                        }}
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
                        sx={{
                            marginBottom: '32px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: 'grey.50',
                                borderColor: 'grey.300',
                                transition: 'all 0.3s ease',
                                '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                    boxShadow: theme => `0 0 10px ${alpha(theme.palette.primary.main, 0.2)}`,
                                },
                            },
                        }}
                        required
                        aria-label="Confirm Password"
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        disabled={isLoading}
                        sx={{
                            padding: '14px',
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            boxShadow: theme => theme.shadows[2],
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: theme => theme.shadows[4],
                                transform: 'translateY(-2px)',
                            },
                            '&:disabled': {
                                backgroundColor: 'grey.400',
                                color: 'grey.600',
                                boxShadow: 'none',
                            },
                        }}
                        aria-label="Submit New Password"
                    >
                        {t('reset_password.button')}
                    </Button>
                    <CustomAlert
                        open={alert.open}
                        onClose={handleCloseAlert}
                        message={alert.message}
                        severity={alert.severity}
                    />
                </FormContainer>
            </PageContainer>
        </>
    );
};

export default ResetPassword;