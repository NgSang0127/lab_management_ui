import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../state/store.ts";
import { uploadImageToCloudinary } from "../../../utils/uploadCloudinary.ts";
import { updateInformationUser } from "../../../state/User/Reducer.ts";
import LoadingIndicator from "../../Support/LoadingIndicator.tsx";
import CustomAlert from "../../Support/CustomAlert.tsx";
import { useTranslation } from "react-i18next";

const UserProfile: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { isLoading, successMessage, errorMessage } = useSelector(
        (state: RootState) => state.user.updateInformation
    );

    const [userForm, setUserForm] = useState({
        image: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        username: "",
    });

    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
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
        if (user) {
            setUserForm({
                image: user.image || "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                username: user.username || "",
            });
        }
    }, [user]);

    useEffect(() => {
        if (successMessage || errorMessage) {
            showAlert(
                successMessage || errorMessage,
                successMessage ? 'success' : 'error'
            );
        }
    }, [successMessage, errorMessage]);

    const showAlert = (message: string, severity: "success" | "error") => {
        setAlert({ open: true, message, severity });
    };

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    const updateUserState = (field: string, value: string) => {
        setUserForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateUserState(name, value);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploading(true);
            try {
                const uploadedUrl = await uploadImageToCloudinary(e.target.files[0]);
                updateUserState("image", uploadedUrl);
                showAlert(t("setting.userProfile.success.upload_image"), "success");
            } catch (error) {
                showAlert(t("setting.userProfile.errors.upload_image"), "error");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await dispatch(updateInformationUser(userForm)).unwrap();
            showAlert(t('setting.userProfile.success.update_information'), 'success');
        } catch (error: any) {
            showAlert(t('setting.userProfile.errors.update_information'), 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                bgcolor: "white",
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
                {t("setting.userProfile.title")}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar
                    src={userForm.image || user?.image || undefined}
                    alt="Profile"
                    sx={{
                        width: 80,
                        height: 80,
                        border: "2px solid #ccc",
                        bgcolor: "primary.main",
                    }}
                >
                    {!(userForm.image || user?.image) && (
                        <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
                            {user?.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                        </Typography>
                    )}
                </Avatar>
                <Button
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    component="label"
                    sx={{padding: '8px 16px', height: 'fit-content'}}
                    disabled={isUploading}
                    aria-label="Upload Image"

                >
                    {isUploading ? t("setting.userProfile.uploading") : t("setting.userProfile.button_upload")}
                    <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                </Button>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <TextField
                    label={t("setting.userProfile.firstName")}
                    name="firstName"
                    value={userForm.firstName}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ flex: 1, minWidth: { xs: "100%", sm: "200px" } }}
                />
                <TextField
                    label={t("setting.userProfile.lastName")}
                    name="lastName"
                    value={userForm.lastName}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ flex: 1, minWidth: { xs: "100%", sm: "200px" } }}
                />
            </Box>

            <TextField
                label="Email"
                name="email"
                type="email"
                value={userForm.email}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 3 }}
            />

            <TextField
                label={t("setting.userProfile.phone")}
                name="phoneNumber"
                value={userForm.phoneNumber}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 3 }}
            />

            <TextField
                label={t("setting.userProfile.username")}
                name="username"
                value={userForm.username}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 3 }}
            />

            <Button
                variant="contained"
                sx={{
                    px: 4,
                    py: 1.2,
                    alignSelf: 'flex-end',
                    mt: 2,
                }}
                onClick={handleSave}
                disabled={loading || isUploading}
            >
                {loading ? <LoadingIndicator open={loading} /> : t("setting.userProfile.button_save")}
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

export default UserProfile;