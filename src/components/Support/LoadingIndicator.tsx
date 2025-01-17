
import React from 'react';
import { CircularProgress, Backdrop } from '@mui/material';

interface LoadingIndicatorProps {
    open: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ open }) => {
    return (
        <Backdrop open={open} style={{ zIndex: 1300 }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default LoadingIndicator;
