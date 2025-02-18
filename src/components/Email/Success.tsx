import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {useTranslation} from "react-i18next";

const Success: React.FC = () => {
    const navigate = useNavigate();
    const {t}=useTranslation();

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
                {t('check_email.success.title')}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                {t('check_email.success.content')}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleContinue}>
                {t('check_email.success.button')}
            </Button>
        </Box>
    );
};

export default Success;
