import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState, useAppDispatch } from "../../state/store.ts";
import { sendTFAEmail, verifyTFAEmail } from "../../state/auth/thunk.ts";
import {
    Button,
    TextField,
    Container,
    Typography,
    Box,
    AlertColor,
    Card,
    CardContent,
    CardActions,
    Stack
} from "@mui/material";
import { useSelector } from "react-redux";
import CustomAlert from "../../components/support/CustomAlert.tsx";
import LoadingIndicator from "../../components/support/LoadingIndicator.tsx";
import { Helmet } from "react-helmet-async";

const VerifyEmailOTP = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const { isLoading } = useSelector((state: RootState) => state.auth);

    // Lấy username từ query string
    const queryParams = new URLSearchParams(location.search);
    const initialUsername = queryParams.get("username") || "";

    const [username, setUsername] = useState(initialUsername);
    const [otp, setOtp] = useState("");

    const [alert, setAlert] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: "",
        severity: "info",
    });

    const showAlert = (message: string, severity: "success" | "error" | "info") => {
        setAlert({ open: true, message, severity });
    };

    const handleCloseAlert = useCallback(() => {
        setAlert((prev) => ({ ...prev, open: false }));
    }, []);

    useEffect(() => {
        if (initialUsername) {
            setUsername(initialUsername);
        }
    }, [initialUsername]);

    const handleSendEmail = async () => {
        try {
            const result = await dispatch(sendTFAEmail(username)).unwrap();
            showAlert(result, "success");
        } catch (err) {
            showAlert(err as string, "error");
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const result = await dispatch(verifyTFAEmail({ username, code: otp })).unwrap();
            showAlert(result, "success");
            navigate("/");
        } catch (err) {
            showAlert(err as string, "error");
        }
    };

    return (
        <>
            <Helmet>
                <title>Verify Email OTP | Lab Management IT</title>
            </Helmet>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    backgroundColor: 'background.default',
                    padding: 2,
                }}
            >
                <Container maxWidth="sm">
                    <Card sx={{ borderRadius: 3, boxShadow: theme => theme.shadows[5], backgroundColor: 'background.paper' }}>
                        <CardContent>
                            <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 3, color: 'primary.main' }}>
                                Email Authentication with OTP
                            </Typography>

                            <LoadingIndicator open={isLoading} />

                            <Stack spacing={2}>
                                {/* Nhập username */}
                                <TextField
                                    label="Username"
                                    variant="outlined"
                                    fullWidth
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    disabled={!!initialUsername}
                                />

                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleSendEmail}
                                    disabled={!username}
                                >
                                    Send OTP code via Email
                                </Button>

                                <Box component="form" onSubmit={(e) => {
                                    e.preventDefault();
                                    handleVerifyOTP();
                                }}>
                                    <Stack spacing={2}>
                                        <TextField
                                            label="Enter OTP Code"
                                            variant="outlined"
                                            fullWidth
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Enter OTP code"
                                            slotProps={{htmlInput:{ maxLength: 6 }}}
                                        />

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            disabled={!otp || otp.length !== 6}
                                            sx={{
                                                color: (!otp || otp.length !== 6) ? 'grey.600' : 'primary.contrastText',
                                                "&:disabled": {
                                                    backgroundColor: 'grey.400',
                                                    color: 'grey.600',
                                                }
                                            }}
                                        >
                                            OTP Authentication
                                        </Button>
                                    </Stack>
                                </Box>
                            </Stack>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "center", mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                If you don't receive the code, check your spam or try again later.
                            </Typography>
                        </CardActions>
                    </Card>

                    <CustomAlert open={alert.open} onClose={handleCloseAlert} message={alert.message}
                                 severity={alert.severity} />
                </Container>
            </Box>
        </>
    );
};

export default VerifyEmailOTP;