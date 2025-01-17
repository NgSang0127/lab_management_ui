import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { RootState, useAppDispatch } from "../../state/store.ts";
import { useSelector } from "react-redux";
import {forgotPassword} from "../../state/Authentication/Reducer.ts";
import {useNavigate} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {AlertColor, TextField} from "@mui/material";
import LoadingIndicator from "../Support/LoadingIndicator.tsx";
import CustomAlert from "../Support/CustomAlert.tsx";


interface ForgotPasswordProps {
    open: boolean;
    handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
    const dispatch = useAppDispatch();
    const navigate=useNavigate();
    const { isLoading, success, error } = useSelector((state: RootState) => state.auth);
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
        try {
            await dispatch(forgotPassword({ email }));
        } catch (error) {
            showAlert(error as string,'error')
        }
    };


    useEffect(() => {
        if (success) {
            showAlert(success,'success')
            navigate('/account/reset-code')
        }

        if (error) {
            showAlert(error,'error')
        }
    }, [success, error]);

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
                <DialogTitle>Reset password</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                    <DialogContentText>
                        Enter your account&apos;s email address, and we&apos;ll send you a link to reset your password.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        variant="outlined"
                        required
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email address"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions sx={{ pb: 3, px: 3 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" type="submit" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Continue'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for success and error messages */}
            <CustomAlert
                open={alert.open}
                onClose={handleCloseAlert}
                message={alert.message}
                severity={alert.severity}
            />

        </>
    );
}
