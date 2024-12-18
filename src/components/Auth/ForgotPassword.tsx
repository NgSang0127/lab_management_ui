import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { RootState, useAppDispatch } from "../../state/store.ts";
import { useSelector } from "react-redux";

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {forgotPassword} from "../../state/Authentication/Reducer.ts";
import {useNavigate} from "react-router-dom";


interface ForgotPasswordProps {
    open: boolean;
    handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
    const dispatch = useAppDispatch();
    const navigate=useNavigate();
    const { isLoading, success, error } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = React.useState('');

    // Snackbar state for showing messages
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');

    // Handle email input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    // Handle forgot password submit
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            // Dispatch forgotPassword action
            await dispatch(forgotPassword({ email }));
        } catch (error) {
            // If there is an error in dispatch, handle it here
            setSnackbarMessage('An error occurred while sending the reset link.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    // Show Snackbar if success or error exists
    React.useEffect(() => {
        if (success) {
            setSnackbarMessage(success);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            navigate('/account/reset-code')
        }

        if (error) {
            setSnackbarMessage(error);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    }, [success, error]);

    return (
        <>
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
                    <OutlinedInput
                        autoFocus
                        required
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email address"
                        placeholder="Email address"
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
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}  // Set the Snackbar to bottom-center
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
