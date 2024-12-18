import React, {useState} from 'react';
import {TextField, Button, Snackbar, Alert, Box} from '@mui/material';
import {useAppDispatch} from "../../state/store";
import {useSelector} from "react-redux";
import {RootState} from "../../state/store";
import {validateResetCode} from "../../state/Authentication/Reducer";
import {useNavigate} from "react-router-dom";

const ResetCodeInput: React.FC = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState<string>(''); // Stores the entered code
    const [snackbarState, setSnackbarState] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });
    const dispatch = useAppDispatch();
    const {isLoading, success, error} = useSelector((state: RootState) => state.auth);

    // Handle input value changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        if (/^\d$/.test(value) || value === '') {
            const newCode = [...code]; // Spread code string to an array
            newCode[index] = value;
            setCode(newCode.join('')); // Update the code string

            // Auto-focus on the next input if valid input and not the last field
            if (value && index < 5) {
                document.getElementById(`code-input-${index + 1}`)?.focus();
            }
        }
    };

    // Handle backspace key for navigation
    const handleBackspaceNavigation = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && index > 0 && !code[index]) {
            document.getElementById(`code-input-${index - 1}`)?.focus();
        }
    };

    // Helper to handle snackbar updates
    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
        setSnackbarState({open: true, message, severity});
    };

    // Handle form submission
    const handleSubmit = () => {
        if (code.length !== 6) {
            showSnackbar('Please enter a 6-digit code.', 'error');
            return;
        }

        dispatch(validateResetCode({code, newPassword: null}));

        if (isLoading) {
            showSnackbar('Validating code...', 'info');
        } else if (success) {
            showSnackbar(success, 'success');
            navigate('/account/reset-password', {state: {resetCode: code}});
        } else if (error) {
            showSnackbar(error, 'error');
        }
    };

    return (
        <Box
            className="flex flex-col items-center p-8 w-fit mx-auto border border-gray-300 rounded-lg shadow-lg bg-white mt-10">
            <h3 className="text-xl font-semibold mb-6">Enter Reset Code</h3>
            <div className="flex space-x-4 mb-6">
                {Array.from({length: 6}).map((_, index) => (
                    <TextField
                        key={index}
                        variant="outlined"
                        id={`code-input-${index}`}
                        slotProps={{
                            htmlInput: {
                                maxLength: 1,
                                style: {textAlign: 'center', fontSize: '1.5rem', width: '50px'}
                            },
                        }}
                        value={code[index] || ''}
                        onChange={(e) => handleInputChange(e, index)}
                        onKeyDown={(e) => handleBackspaceNavigation(e, index)}
                        autoFocus={index === 0}
                        className="w-12"
                    />
                ))}
            </div>
            <Button
                variant="contained"
                className="mt-6 w-full py-2 text-white font-semibold"
                onClick={handleSubmit}
                disabled={code.length !== 6 || isLoading}
            >
                {isLoading ? 'Validating...' : 'Submit'}
            </Button>
            <Snackbar
                open={snackbarState.open}
                autoHideDuration={6000}
                onClose={() => setSnackbarState(prev => ({...prev, open: false}))}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert
                    onClose={() => setSnackbarState(prev => ({...prev, open: false}))}
                    severity={snackbarState.severity}
                    sx={{width: '100%'}}
                >
                    {snackbarState.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ResetCodeInput;