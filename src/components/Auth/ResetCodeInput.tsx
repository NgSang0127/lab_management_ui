import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useAppDispatch, RootState } from "../../state/store";
import { useSelector } from "react-redux";
import { validateResetCode } from "../../state/Authentication/Reducer";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingIndicator from "../Support/LoadingIndicator.tsx";
import CustomAlert from "../Support/CustomAlert.tsx";
import { useTranslation } from "react-i18next";
import { styled } from '@mui/material/styles';


const RESET_CODE_LENGTH = 6;

const PageContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
    },
}));

const FormContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
    borderRadius: '20px',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#ffffff',
    maxWidth: '550px',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3),
        maxWidth: '90%',
    },
}));

const ResetCodeInput: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state: RootState) => state.auth);

    const email = location.state?.email || "";

    const [code, setCode] = useState<string>('');
    const [alert, setAlert] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const showAlert = useCallback((message: string, severity: 'success' | 'error' | 'info') => {
        console.log("Calling setAlert with:", { message, severity });
        setAlert({ open: true, message, severity });
    }, []);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const value = e.target.value;
        if (/^\d$/.test(value) || value === '') {
            setCode((prevCode) => {
                const newCode = prevCode.split('');
                newCode[index] = value;
                return newCode.join('');
            });

            if (value && index < RESET_CODE_LENGTH - 1) {
                document.getElementById(`code-input-${index + 1}`)?.focus();
            }
        }
    };

    const handleBackspaceNavigation = (e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>, index: number) => {
        if (e.key === 'Backspace' && index > 0 && !code[index]) {
            const prevInput = document.getElementById(`code-input-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleSubmit = async () => {
        if (isLoading) return;

        if (code.length !== RESET_CODE_LENGTH) {
            showAlert(t('reset_code.errors.code', { length: RESET_CODE_LENGTH }), 'error');
            return;
        }

        try {
            const result = await dispatch(validateResetCode({ email, code, newPassword: null })).unwrap();

            showAlert(t('reset_code.success'), 'success');
            setTimeout(() => {
                navigate('/account/reset-password', { state: { resetCode: code, email } });
            }, 1000);
        } catch (error: any) {
            console.error("Error in validateResetCode:", error);
            showAlert(error?.message || t('reset_code.errors.invalid_code'), 'error');
        }
    };



    const handleCloseAlert = useCallback(() => {
        console.log("Closing alert");
        setAlert(prev => ({ ...prev, open: false }));
    }, []);

    return (
        <PageContainer>
            <FormContainer>
                <Typography
                    variant="h4"
                    sx={{
                        marginBottom: '16px',
                        fontWeight: 'bold',
                        color: '#1a1a1a',
                        textAlign: 'center',
                        fontSize: { xs: '1.8rem', sm: '2rem' },
                    }}
                >
                    {t('reset_code.title')}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        marginBottom: '32px',
                        color: '#555',
                        textAlign: 'center',
                        fontSize: '1rem',
                        maxWidth: '80%',
                    }}
                >
                    {t('reset_code.description')}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        gap: '10px',
                        marginBottom: '40px',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    {Array.from({ length: RESET_CODE_LENGTH }).map((_, index) => (
                        <TextField
                            key={index}
                            variant="outlined"
                            id={`code-input-${index}`}
                            name={`code-${index}`}
                            inputProps={{
                                maxLength: 1,
                                style: {
                                    textAlign: 'center',
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    width: '50px',
                                    height: '50px',
                                    padding: 0,
                                    borderRadius: '12px',
                                },
                            }}
                            sx={{
                                width: '65px',
                                height: '65px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: '#f8fafc',
                                    borderColor: '#e0e0e0',
                                    transition: 'all 0.3s ease',
                                    '&:hover fieldset': {
                                        borderColor: '#0288d1',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#0288d1',
                                        boxShadow: '0 0 10px rgba(2, 136, 209, 0.2)',
                                    },
                                },
                                '& .MuiOutlinedInput-input': {
                                    padding: '0',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                },
                            }}
                            value={code[index] || ''}
                            onChange={(e) => handleInputChange(e, index)}
                            onKeyDown={(e) => handleBackspaceNavigation(e, index)}
                            autoFocus={index === 0}
                            aria-label={`Reset code digit ${index + 1}`}
                        />
                    ))}
                </Box>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    disabled={code.length !== RESET_CODE_LENGTH || isLoading}
                    sx={{
                        width: '50%',
                        padding: '7px',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        boxShadow: '0 3px 10px rgba(2, 136, 209, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:disabled': {
                            backgroundColor: '#bdbdbd',
                            color: '#757575',
                            boxShadow: 'none',
                        },
                    }}
                    aria-label="Submit Reset Code"
                >
                    {isLoading ? <LoadingIndicator open={isLoading} /> : t('reset_code.submit')}
                </Button>
            </FormContainer>
            <CustomAlert
                open={alert.open}
                onClose={handleCloseAlert}
                message={alert.message}
                severity={alert.severity}
            />
        </PageContainer>
    );
};

export default ResetCodeInput;