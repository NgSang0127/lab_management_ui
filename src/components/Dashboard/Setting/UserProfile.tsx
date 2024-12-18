import React, {useEffect, useState} from 'react';
import {Alert, Avatar, Box, Button, CircularProgress, Snackbar, TextField, Typography} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from "../../../state/store.ts";
import {uploadImageToCloudinary} from "../../../utils/uploadCloudinary.ts";
import {updateInformationUser} from "../../../state/User/Reducer.ts";

const UserProfile = () => {
    const dispatch = useAppDispatch();
    const {user} = useSelector((state: RootState) => state.auth);
    const {isLoading, successMessage, errorMessage} = useSelector((state: RootState) => state.user);

    // Consolidated state for user form
    const [userForm, setUserForm] = useState({
        image: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        username: '',
    });
    const [isUploading, setIsUploading] = useState(false);
    const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'success' as 'success' | 'error'});

    // Update form state with user data on component load
    useEffect(() => {
        if (user) {
            setUserForm({
                image: user?.image || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                username: user.username || '',
            });
        }
    }, [user]);

    // Show Snackbar messages on success or error
    useEffect(() => {
        if (successMessage || errorMessage) {
            showSnackbar(successMessage || errorMessage, successMessage ? 'success' : 'error');
        }
    }, [successMessage, errorMessage]);

    const updateUserState = (field: string, value: string) => {
        setUserForm((prev) => ({...prev, [field]: value}));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        updateUserState(name, value);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploading(true);
            try {
                const uploadedUrl = await uploadImageToCloudinary(e.target.files[0]);
                updateUserState('image', uploadedUrl);
            } catch {
                showSnackbar("Có lỗi xảy ra khi tải ảnh lên Cloudinary.", "error");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleSave = async () => {
        try {
            await dispatch(updateInformationUser(userForm));
        } catch {
            showSnackbar('Có lỗi xảy ra khi lưu thông tin.', 'error');
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({open: true, message, severity});
    };

    const onSnackbarClose = () => {
        setSnackbar((prev) => ({...prev, open: false}));
    };

    return (
        <Box
            className="p-6 border rounded-lg shadow-md bg-white"
            sx={{padding: '24px', margin: '20px', maxWidth: '1400px', marginLeft: 'auto', marginRight: 'auto'}}
        >
            <Typography variant="h5" className="mb-6 font-semibold" sx={{marginBottom: '24px', textAlign: 'center'}}>
                Quản lý thông tin cá nhân
            </Typography>
            <Box display="flex" alignItems="center" sx={{marginBottom: '24px', gap: '16px'}}>
                <Avatar
                    src={userForm.image || user?.image || undefined}
                    alt="Profile"
                    sx={{width: 100, height: 100, border: '2px solid #ccc'}}
                >
                    {!(userForm.image || user?.image) && (
                        <Typography variant="h6" sx={{color: '#fff', fontWeight: 'bold'}}>
                            {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                        </Typography>
                    )}
                </Avatar>
                <Button
                    variant="outlined"
                    startIcon={<UploadIcon/>}
                    component="label"
                    sx={{padding: '8px 16px'}}
                    disabled={isUploading}
                >
                    {isUploading ? 'Đang tải ảnh...' : 'Upload hình ảnh'}
                    <input hidden accept="image/*" type="file" onChange={handleFileChange}/>
                </Button>
            </Box>
            <Box display="flex" gap="16px" flexWrap="wrap" sx={{marginBottom: '24px'}}>
                <TextField
                    label="Họ"
                    name="firstName"
                    value={userForm.firstName}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{flex: 1}}
                />
                <TextField
                    label="Tên"
                    name="lastName"
                    value={userForm.lastName}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{flex: 1}}
                />
            </Box>
            <TextField
                label="Email"
                name="email"
                value={userForm.email}
                onChange={handleInputChange}
                fullWidth
                sx={{marginBottom: '24px'}}
            />
            <TextField
                label="Số điện thoại"
                name="phoneNumber"
                value={userForm.phoneNumber}
                onChange={handleInputChange}
                fullWidth
                sx={{marginBottom: '24px'}}
            />
            <TextField
                label="Tên đăng nhập"
                name="username"
                value={userForm.username}
                onChange={handleInputChange}
                fullWidth
                sx={{marginBottom: '24px'}}
            />
            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSave}
                sx={{width: '100%', padding: '7px'}}
                disabled={isLoading}
            >
                {isLoading ? <CircularProgress size={24} sx={{color: 'white'}}/> : 'Lưu thông tin cá nhân'}
            </Button>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={onSnackbarClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={onSnackbarClose} severity={snackbar.severity} sx={{width: '100%'}}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserProfile;