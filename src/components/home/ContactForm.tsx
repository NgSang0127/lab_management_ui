import React, { useState } from 'react';
import { Box, TextField, Button, Stack, AlertColor } from '@mui/material';
import LoadingIndicator from '../support/LoadingIndicator.tsx';
import CustomAlert from '../support/CustomAlert.tsx';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import {api} from "../../config/api.ts";

interface FormData {
    name: string;
    email: string;
    message: string;
}

const ContactForm: React.FC = () => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        message: '',
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: '',
        severity: 'info',
    });

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            setAlert({
                open: true,
                message: t('home.contact_form.fill_all_fields'),
                severity: 'warning',
            });
            return;
        }

        setLoading(true);
        setAlert({ open: false, message: '', severity: 'info' });

        try {
            await sendMessageAPI(formData);
            setAlert({
                open: true,
                message: t('home.contact_form.success_message'),
                severity: 'success',
            });
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            const errorMessage =
                error instanceof AxiosError && error.response?.data?.message
                    ? error.response.data.message
                    : t('home.contact_form.error_message');
            setAlert({
                open: true,
                message: errorMessage,
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const sendMessageAPI = async (data: FormData) => {
        const payload = {
            name: data.name,
            email: data.email,
            message: data.message,
            subject: 'Contact Form Submission',
            locale: t('i18n.language', 'en'),
        };

        const response = await api.post('/email/contact', payload);

        return response.data;
    };

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        label={t('home.contact_form.name')}
                        name="name"
                        variant="outlined"
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label={t('home.contact_form.email')}
                        name="email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label={t('home.contact_form.message')}
                        name="message"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? t('home.contact_form.sending') : t('home.contact_form.submit')}
                    </Button>
                </Stack>
            </form>

            <LoadingIndicator open={loading} />

            <CustomAlert
                open={alert.open}
                onClose={handleCloseAlert}
                message={alert.message}
                severity={alert.severity}
            />
        </Box>
    );
};

export default ContactForm;