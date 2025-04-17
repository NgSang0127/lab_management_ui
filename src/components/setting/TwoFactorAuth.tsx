import React, { useEffect, useState } from "react";
import { Box, Typography, Switch, TextField, Button, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../state/store.ts";
import CustomAlert from "../support/CustomAlert.tsx";
import { toggleTfaFactor, verifyOtp } from "../../state/auth/thunk.ts";
import { qrTfa } from "../../state/user/thunk.ts";
import { useTranslation } from "react-i18next";

const TwoFactorAuth: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { user, isLoading } = useSelector((state: RootState) => state.auth);
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
    const [qrCodeImage, setQrCodeImage] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");

    const [alert, setAlert] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        if (user?.twoFactorEnabled !== undefined) {
            setIsTwoFactorEnabled(user.twoFactorEnabled);
            if (user.twoFactorEnabled) {
                getQrCode();
            }
        }
    }, [user]);

    const getQrCode = async () => {
        try {
            setLoading(true);
            const response = await dispatch(qrTfa()).unwrap();
            if (response.secretImageUri) {
                setQrCodeImage(response.secretImageUri);
            }
        } catch (error) {
            console.error("Failed to fetch QR code:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user?.username) {
            console.error("Username is missing!");
            return;
        }

        if (!otp.trim()) {
            setOtpError(t("setting.twoFactorAuth.errors.otpRequired"));
            return;
        }

        try {
            const result = await dispatch(verifyOtp({ code: otp, username: user?.username })).unwrap();
            showAlert(t("setting.twoFactorAuth.success.verify"), "success");
            setOtp("");
            setOtpError("");
        } catch (error) {
            console.error("OTP verification failed:", error);
            showAlert(t("setting.twoFactorAuth.errors.verify"), "error");
        }
    };

    const showAlert = (message: string, severity: "success" | "error") => {
        setAlert({ open: true, message, severity });
    };

    const handleToggleTwoFactor = async () => {
        setLoading(true);
        try {
            const response = await dispatch(toggleTfaFactor()).unwrap();
            if (response.secretImageUri) {
                setQrCodeImage(response.secretImageUri);
                setIsTwoFactorEnabled(true);
                showAlert(t("setting.twoFactorAuth.success.enabled"), "success");
            } else {
                setQrCodeImage("");
                setIsTwoFactorEnabled(false);
                showAlert(t("setting.twoFactorAuth.success.disabled"), "success");
            }
        } catch (error) {
            showAlert(t("setting.twoFactorAuth.errors.toggle"), "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                bgcolor: "background.default",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                p: 4,
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    mb: 3,
                }}
            >
                {t("setting.userProfile.twoFactorAuth")}
            </Typography>

            {(isLoading || loading) && (
                <CircularProgress sx={{ display: "block", margin: "0 auto", mb: 3 }} />
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Typography variant="body1">{t("setting.userProfile.enableTwoFactorAuth")}</Typography>
                <Switch
                    checked={isTwoFactorEnabled}
                    onChange={handleToggleTwoFactor}
                    disabled={loading || isLoading}
                    color="primary"
                />
            </Box>

            {qrCodeImage && isTwoFactorEnabled && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                        {t("setting.twoFactorAuth.scanQrCode")}
                    </Typography>
                    <img
                        src={qrCodeImage}
                        alt="QR Code for Two-Factor Authentication"
                        style={{ width: "400px", height: "400px" }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {t("setting.twoFactorAuth.enterOtp")}
                    </Typography>

                    <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "300px" }}>
                        <TextField
                            label={t("setting.twoFactorAuth.otpCode")}
                            variant="outlined"
                            fullWidth
                            type="text"
                            value={otp}
                            onChange={(e) => {
                                setOtp(e.target.value);
                                setOtpError("");
                            }}
                            placeholder={t("setting.twoFactorAuth.enterOtpPlaceholder")}
                            error={!!otpError}
                            helperText={otpError}
                            sx={{

                                "& .MuiOutlinedInput-root": {
                                    "&:hover fieldset": { borderColor: "primary.main" },
                                    "&.Mui-focused fieldset": { borderColor: "primary.main" },
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                            sx={{
                                px: 4,
                                py: 1.2,
                                alignSelf: 'flex-end',
                                mt: 2,
                            }}
                        >
                            {t("setting.twoFactorAuth.verify")}
                        </Button>
                    </form>
                </Box>
            )}

            <CustomAlert
                open={alert.open}
                onClose={() => setAlert({ ...alert, open: false })}
                message={alert.message}
                severity={alert.severity}
            />
        </Box>
    );
};

export default TwoFactorAuth;