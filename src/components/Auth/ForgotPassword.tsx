import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { RootState, useAppDispatch } from "../../state/store.ts";
import { useSelector } from "react-redux";
import { forgotPassword } from "../../state/Authentication/Reducer.ts";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { AlertColor, TextField } from "@mui/material";
import LoadingIndicator from "../Support/LoadingIndicator.tsx";
import CustomAlert from "../Support/CustomAlert.tsx";
import { useTranslation } from "react-i18next";

interface ForgotPasswordProps {
    open: boolean;
    handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState('');
    const [alert, setAlert] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: "",
        severity: "info",
    });

    const showAlert = (message: string, severity: 'success' | 'error' | 'info') => {
        setAlert({ open: true, message, severity });
    };

    const handleCloseAlert = useCallback(() => {
        setAlert((prev) => ({ ...prev, open: false }));
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!email) {
            showAlert(t('forgot_password.errors.email_required'), 'error');
            return;
        }
        try {
            const result = await dispatch(forgotPassword({ email })).unwrap();
            console.log("result", result);
            // Lấy message từ object response
            showAlert(result.message, 'success');
            setTimeout(() => {
                navigate('/account/reset-code', { state: { email } });
            }, 1000);
        } catch (error) {
            // Giả sử error cũng trả về object với trường message
            showAlert((error as { message: string }).message || t('forgot_password.errors.generic'), 'error');
        }
    };

    return (
        <>
            <LoadingIndicator open={isLoading} />
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmit,
                }}
            >
                <DialogTitle>{t('forgot_password.title')}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                    <DialogContentText>
                        {t('forgot_password.content')}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        variant="outlined"
                        required
                        margin="dense"
                        id="email"
                        name="email"
                        label={t('forgot_password.email_address')}
                        type="email"
                        fullWidth
                        value={email}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions sx={{ pb: 3, px: 3 }}>
                    <Button onClick={handleClose}>{t('forgot_password.cancel')}</Button>
                    <Button variant="contained" type="submit" disabled={isLoading}>
                        {isLoading ? t('forgot_password.sending') : t('forgot_password.continue')}
                    </Button>
                </DialogActions>
            </Dialog>

            <CustomAlert
                open={alert.open}
                onClose={handleCloseAlert}
                message={alert.message}
                severity={alert.severity}
            />
        </>
    );
}