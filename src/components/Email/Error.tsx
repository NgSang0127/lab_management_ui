import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const Error: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get the error message from the URL
    const searchParams = new URLSearchParams(location.search);
    const errorMessage = searchParams.get('message') || 'An unknown error occurred.';

    const handleRetry = () => {
        navigate('/'); // Redirect to the home page or any other route
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            textAlign="center"
            p={3}
        >
            <Typography variant="h4" gutterBottom color="error">
                Activation Failed
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                {errorMessage}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleRetry}>
                Retry
            </Button>
        </Box>
    );
};

export default Error;
