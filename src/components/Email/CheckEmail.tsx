import { Typography, Box } from '@mui/material';
import React from "react";
import {useTranslation} from "react-i18next";

const CheckEmail: React.FC = () => {
    const {t}=useTranslation();
    return (
        <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
            <Typography variant="h4">{t('check_email.title')}</Typography>
            <Typography variant="body1">
                {t('check_email.content')}
            </Typography>
        </Box>
    );
};

export default CheckEmail;
