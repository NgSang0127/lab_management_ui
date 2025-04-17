import React, { useEffect, useState, useCallback } from "react";
import {
    TextField,
    Button,
    Typography,
    Box,
    InputAdornment,
    IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../state/store.ts";
import { ChangePasswordRequest } from "../../state/user/userSlice.ts";
import { changePassword } from "../../state/user/thunk.ts";
import CustomAlert from "../support/CustomAlert.tsx";
import LoadingIndicator from "../support/LoadingIndicator.tsx";
import { AlertColor } from "@mui/material/Alert";
import { useTranslation } from "react-i18next";

const PASSWORD_MIN_LENGTH = 8;

const ChangePassword: React.FC = () => {
    const { t } = useTranslation();
    const MISMATCH_ERROR = t("setting.errors.mismatch");
    const LENGTH_ERROR = t("setting.errors.length", { length: PASSWORD_MIN_LENGTH });
    const REQUIRED_ERROR = t("setting.changePassword.errors.allFields");

    const dispatch = useAppDispatch();
    const { isLoading, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.user.changePassword
    );

    const [passwordState, setPasswordState] = useState<ChangePasswordRequest>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [visibilityState, setVisibilityState] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

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
        if (successMessage || errorMessage) {
            const message = successMessage || errorMessage;
            const severity = successMessage ? 'success' : 'error';
            showAlert(message, severity);

            if (successMessage) {
                setPasswordState({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                setErrors({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        }
    }, [successMessage, errorMessage]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordState((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const togglePasswordVisibility = (field: keyof typeof visibilityState) => {
        setVisibilityState((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { currentPassword: "", newPassword: "", confirmPassword: "" };

        // Check for empty fields
        if (!passwordState.currentPassword.trim()) {
            newErrors.currentPassword = REQUIRED_ERROR;
            isValid = false;
        }
        if (!passwordState.newPassword.trim()) {
            newErrors.newPassword = REQUIRED_ERROR;
            isValid = false;
        }
        if (!passwordState.confirmPassword.trim()) {
            newErrors.confirmPassword = REQUIRED_ERROR;
            isValid = false;
        }

        // Check password length
        if (passwordState.newPassword && passwordState.newPassword.length < PASSWORD_MIN_LENGTH) {
            newErrors.newPassword = LENGTH_ERROR;
            isValid = false;
        }

        // Check if passwords match
        if (passwordState.newPassword && passwordState.newPassword !== passwordState.confirmPassword) {
            newErrors.confirmPassword = MISMATCH_ERROR;
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = () => {
        if (!validateForm()) {
            return;
        }

        dispatch(changePassword(passwordState));
    };

    return (
        <Box
            sx={{
                bgcolor: "background.default",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                p: 4,
                mb: 4,
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
                {t("setting.userProfile.security")}
            </Typography>

            {isLoading && <LoadingIndicator open={isLoading} />}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
                    <TextField
                        key={field}
                        label={
                            field === "currentPassword"
                                ? t("setting.changePassword.currentPassword")
                                : field === "newPassword"
                                    ? t("setting.changePassword.newPassword")
                                    : t("setting.changePassword.confirmPassword")
                        }
                        name={field}
                        type={visibilityState[field as keyof typeof visibilityState] ? "text" : "password"}
                        value={passwordState[field as keyof ChangePasswordRequest]}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        error={!!errors[field as keyof typeof errors]}
                        helperText={errors[field as keyof typeof errors]}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": { borderColor: "primary.main" },
                                "&.Mui-focused fieldset": { borderColor: "primary.main" },
                            },
                        }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => togglePasswordVisibility(field as keyof typeof visibilityState)}
                                            edge="end"
                                        >
                                            {visibilityState[field as keyof typeof visibilityState] ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                ))}
            </Box>

            <Button
                variant="contained"
                sx={{
                    px: 4,
                    py: 1.2,
                    alignSelf: 'flex-end',
                    mt: 2,
                }}
                onClick={handleSave}
                disabled={isLoading}
            >
                {t("setting.changePassword.button_save")}
            </Button>

            <CustomAlert
                open={alert.open}
                onClose={handleCloseAlert}
                message={alert.message}
                severity={alert.severity}
            />
        </Box>
    );
};

export default ChangePassword;