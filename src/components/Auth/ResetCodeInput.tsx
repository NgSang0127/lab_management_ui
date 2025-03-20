import React, {useState} from 'react';
import {TextField, Button, Box, Typography} from '@mui/material';
import {useAppDispatch} from "../../state/store";
import {useSelector} from "react-redux";
import {RootState} from "../../state/store";
import { validateResetCode} from "../../state/Authentication/Reducer";
import {useLocation, useNavigate} from "react-router-dom";
import LoadingIndicator from "../Support/LoadingIndicator.tsx";
import CustomAlert from "../Support/CustomAlert.tsx";
import {useTranslation} from "react-i18next";


const RESET_CODE_LENGTH = 6;

const ResetCodeInput: React.FC = () => {
    const {t} = useTranslation();

    const location=useLocation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {isLoading} = useSelector((state: RootState) => state.auth);

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

    const showAlert = (message: string, severity: 'success' | 'error' | 'info') => {
        setAlert({open: true, message, severity});
    };

    // Handle input value changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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


    // Handle backspace key for navigation
    const handleBackspaceNavigation = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && index > 0 && !code[index]) {
            const prevInput = document.getElementById(`code-input-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleSubmit = async () => {
        if (isLoading) return; // Tránh gọi API khi đang loading

        if (code.length !== RESET_CODE_LENGTH) {
            showAlert(t('reset_code.errors.code', {length: RESET_CODE_LENGTH}), 'error');
            return;
        }

        try {
            const result = await dispatch(validateResetCode({email,code, newPassword: null})).unwrap();
            showAlert(result, 'success');
            setTimeout(() => {

                navigate('/account/reset-password', {state: {resetCode: code,email}});
            }, 1000);
            setCode('');
        } catch (error) {
            showAlert(error as string, 'error');
        }

    };


    const handleCloseAlert = () => {
        setAlert(prev => ({...prev, open: false}));
    };

    // @ts-ignore
    // @ts-ignore
    return (
        <Box
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
                maxWidth: '700px',
            }}
        >
            <Typography variant="h5" sx={{marginBottom: '24px', fontWeight: 'bold'}}>
                {t('reset_code.title')}
            </Typography>
            <Box sx={{display: 'flex', gap: '12px', marginBottom: '24px'}}>
                {Array.from({length: RESET_CODE_LENGTH}).map((_, index) => (
                    <TextField
                        key={index}
                        variant="outlined"
                        id={`code-input-${index}`}
                        name={`code-${index}`}
                        inputProps={{
                            maxLength: 1,
                            style: {textAlign: 'center', fontSize: '1.5rem', width: '50px'},
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
                color="primary"
                size="large"
                onClick={handleSubmit}
                disabled={code.length !== RESET_CODE_LENGTH || isLoading}
                sx={{
                    width: '100%', padding: '12px',
                    "&:disabled": {
                        backgroundColor: "#bdbdbd", // Màu nền khi disabled
                        color: "#757575" // Màu chữ khi disabled
                    }
                }}
                aria-label="Submit Reset Code"
            >
                {isLoading ? <LoadingIndicator open={isLoading}/> : t('reset_code.submit')}
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

export default ResetCodeInput;
