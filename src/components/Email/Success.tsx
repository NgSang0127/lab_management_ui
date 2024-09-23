import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Success: React.FC = () => {
    const navigate = useNavigate();

    const handleContinue = () => {
        navigate('/account/signin');
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
            <Typography variant="h4" gutterBottom>
                Account Activated Successfully!
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                Your account has been activated. You can now log in and start using the application.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleContinue}>
                Continue
            </Button>
        </Box>
    );
};

export default Success;
