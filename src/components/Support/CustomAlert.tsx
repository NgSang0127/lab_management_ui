import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface CustomAlertProps {
    open: boolean;
    message: string;
    severity?: AlertColor;
    onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
                                                     open,
                                                     message,
                                                     onClose,
                                                     severity = 'error',
                                                 }) => {
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default CustomAlert;