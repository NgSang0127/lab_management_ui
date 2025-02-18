import React, { useState } from 'react';
import { Box, TextField, Button, Stack, Alert, AlertColor } from '@mui/material';
import LoadingIndicator from "../Support/LoadingIndicator.tsx";
import CustomAlert from "../Support/CustomAlert.tsx";
import {useTranslation} from "react-i18next";

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

        // Kiểm tra dữ liệu trước khi gửi
        if (!formData.name || !formData.email || !formData.message) {
            setAlert({
                open: true,
                message: 'Vui lòng điền đầy đủ thông tin.',
                severity: 'warning',
            });
            return;
        }

        setLoading(true);
        setAlert({ open: false, message: '', severity: 'info' });

        try {
            // Gọi API để gửi dữ liệu form (thay thế bằng API thực tế của bạn)
            await fakeSendMessageAPI(formData);
            setAlert({
                open: true,
                message: 'Tin nhắn của bạn đã được gửi thành công!',
                severity: 'success',
            });
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            setAlert({
                open: true,
                message: 'Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
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
                        label="Email"
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
                        {loading ? t('home.contact_form.sending') : t('home.contact_form.title')}
                    </Button>
                </Stack>
            </form>

            <LoadingIndicator open={loading} />

            {/* Error Message from Redux (if any) */}
            <CustomAlert
                open={alert.open}
                onClose={handleCloseAlert}
                message={alert.message}
                severity={alert.severity}
            />
        </Box>
    );
};


// Fake API call function (Thay thế bằng API thực tế của bạn)
const fakeSendMessageAPI = (data: FormData) => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            // Giả sử gửi thành công
            resolve();
            // Nếu có lỗi, gọi reject()
            // reject(new Error('Error message'));
        }, 2000);
    });
};

export default ContactForm;
