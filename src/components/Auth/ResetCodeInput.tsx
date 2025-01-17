import React, { useState, useEffect } from 'react';
import {TextField, Button, Box, Typography} from '@mui/material';
import { useAppDispatch } from "../../state/store";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { validateResetCode } from "../../state/Authentication/Reducer";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../Support/LoadingIndicator.tsx";
import CustomAlert from "../Support/CustomAlert.tsx";



const RESET_CODE_LENGTH = 6;

const ResetCodeInput: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, success, error } = useSelector((state: RootState) => state.auth);

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
        setAlert({ open: true, message, severity });
    };

    // Handle input value changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        if (/^\d$/.test(value) || value === '') {
            const newCode = code.split('');
            newCode[index] = value;
            setCode(newCode.join(''));

            // Auto-focus on the next input if valid input and not the last field
            if (value && index < RESET_CODE_LENGTH - 1) {
                const nextInput = document.getElementById(`code-input-${index + 1}`);
                nextInput?.focus();
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
        if (code.length !== RESET_CODE_LENGTH) {
            showAlert(`Please enter a ${RESET_CODE_LENGTH}-digit code.`, 'error');
            return;
        }

        dispatch(validateResetCode({ code, newPassword: null }));

        if (isLoading) {
            showAlert('Validating code...', 'info');
        }
    };

    useEffect(() => {
        if (success) {
            showAlert(success, 'success');
            // Navigate to reset password page with code as state
            navigate('/account/reset-password', { state: { resetCode: code } });
        }

        if (error) {
            showAlert(error, 'error');
        }
    }, [success, error, navigate, code]);


    const handleCloseAlert = () => {
        setAlert(prev => ({ ...prev, open: false }));
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
                maxWidth: '400px',
            }}
        >
            <Typography variant="h5" sx={{ marginBottom: '24px', fontWeight: 'bold' }}>
                Enter Reset Code
            </Typography>
            <Box sx={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                {Array.from({ length: RESET_CODE_LENGTH }).map((_, index) => (
                    <TextField
                        key={index}
                        variant="outlined"
                        id={`code-input-${index}`}
                        name={`code-${index}`}
                        inputProps={{
                            maxLength: 1,
                            style: { textAlign: 'center', fontSize: '1.5rem', width: '50px' },
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
                sx={{ width: '100%', padding: '12px' }}
                aria-label="Submit Reset Code"
            >
                {isLoading ? <LoadingIndicator open={isLoading} /> : 'Submit'}
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
