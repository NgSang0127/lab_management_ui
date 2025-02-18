import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState, useAppDispatch } from "../../state/store.ts";
import { sendTFAEmail, verifyTFAEmail } from "../../state/Authentication/Reducer.ts";
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
import CustomAlert from "../Support/CustomAlert.tsx";
import LoadingIndicator from "../Support/LoadingIndicator.tsx";

const VerifyEmailOTP = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const { isLoading, success } = useSelector((state: RootState) => state.auth);

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
            await dispatch(sendTFAEmail(username)).unwrap();
            showAlert("Mã OTP đã được gửi đến email của bạn.", "success");
        } catch (err) {
            showAlert(err as string, "error");
        }
    };

    const handleVerifyOTP = async () => {
        try {
            await dispatch(verifyTFAEmail({ username, code: otp })).unwrap();
            navigate("/");
            showAlert(success as string, "success");
        } catch (err) {
            showAlert(err as string, "error");
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#f0f2f5",
                padding: 2,
            }}
        >
            <Container maxWidth="sm">
                <Card sx={{ borderRadius: 3, boxShadow: 5, backgroundColor: "white" }}>
                    <CardContent>
                        <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 3, color: "#1976d2" }}>
                            Xác thực Email bằng OTP
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
                                placeholder="Nhập username của bạn"
                                disabled={!!initialUsername}
                            />

                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleSendEmail}
                                disabled={!username}
                            >
                                Gửi mã OTP qua Email
                            </Button>

                            {/* Nhập mã OTP */}
                            <TextField
                                label="Nhập mã OTP"
                                variant="outlined"
                                fullWidth
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Nhập mã OTP"
                                inputProps={{ maxLength: 6 }}
                            />

                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleVerifyOTP}
                                disabled={!otp || otp.length !== 6}
                                sx={{
                                    color: (!otp || otp.length !== 6) ? "#757575" : "#fff",
                                    "&:disabled": {
                                        backgroundColor: "#bdbdbd", // Màu nền khi disabled
                                        color: "#757575" // Màu chữ khi disabled
                                    }
                                }}
                            >
                                Xác thực OTP
                            </Button>
                        </Stack>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center", mt: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                            Nếu bạn không nhận được mã, hãy kiểm tra thư rác hoặc thử lại sau.
                        </Typography>
                    </CardActions>
                </Card>

                <CustomAlert open={alert.open} onClose={handleCloseAlert} message={alert.message} severity={alert.severity} />
            </Container>
        </Box>
    );
};

export default VerifyEmailOTP;
