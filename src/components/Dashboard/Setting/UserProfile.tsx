import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, TextField, Typography } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from "../../../state/store.ts";
import { uploadImageToCloudinary } from "../../../utils/uploadCloudinary.ts";
import { updateInformationUser } from "../../../state/User/Reducer.ts";
import LoadingIndicator from "../../Support/LoadingIndicator.tsx";
import CustomAlert from "../../Support/CustomAlert.tsx";


const UserProfile: React.FC = () => {
    const dispatch = useAppDispatch();
    const {user} = useSelector((state: RootState) => state.auth);

    // Consolidated state for user form
    const [userForm, setUserForm] = useState({
        image: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        username: '',
    });

    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });


    useEffect(() => {
        if (user) {
            setUserForm({
                image: user.image || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                username: user.username || '',
            });
        }
    }, [user]);

    // Function to open alert
    const showAlert = (message: string, severity: 'success' | 'error') => {
        setAlert({open: true, message, severity});
    };

    // Function to close alert
    const handleCloseAlert = () => {
        setAlert({...alert, open: false});
    };

    // Function to update form fields
    const updateUserState = (field: string, value: string) => {
        setUserForm((prev) => ({...prev, [field]: value}));
    };

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        updateUserState(name, value);
    };

    // Handle file upload
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploading(true);
            try {
                const uploadedUrl = await uploadImageToCloudinary(e.target.files[0]);
                updateUserState('image', uploadedUrl);
                showAlert('Image uploaded successfully!', 'success');
            } catch (error) {
                showAlert('An error occurred while uploading the image.', 'error');
            } finally {
                setIsUploading(false);
            }
        }
    };

    // Handle form submission
    const handleSave = async () => {
        setLoading(true);
        try {
            await dispatch(updateInformationUser(userForm)).unwrap();
            showAlert('Personal information updated successfully!', 'success');
        } catch (error: any) {
            showAlert('An error occurred while saving information.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                padding: '24px',
                margin: '20px',
                maxWidth: '1400px',
                marginLeft: 'auto',
                marginRight: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff',
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    marginBottom: '24px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}
            >
                Personal Information Management
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '24px',
                    gap: '16px',
                    flexWrap: 'wrap',
                }}
            >
                <Avatar
                    src={userForm.image || user?.image || undefined}
                    alt="Profile"
                    sx={{
                        width: 100,
                        height: 100,
                        border: '2px solid #ccc',
                        fontSize: '2rem',
                        backgroundColor: '#1976d2',
                    }}
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
                    sx={{padding: '8px 16px', height: 'fit-content'}}
                    disabled={isUploading}
                    aria-label="Upload Image"
                >
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                    <input hidden accept="image/*" type="file" onChange={handleFileChange}/>
                </Button>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    flexWrap: 'wrap',
                    marginBottom: '24px',
                }}
            >
                <TextField
                    label="First Name"
                    name="firstName"
                    value={userForm.firstName}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{flex: 1, minWidth: '200px'}}
                    aria-label="First Name"
                />
                <TextField
                    label="Last Name"
                    name="lastName"
                    value={userForm.lastName}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{flex: 1, minWidth: '200px'}}
                    aria-label="Last Name"
                />
            </Box>

            <TextField
                label="Email"
                name="email"
                type="email"
                value={userForm.email}
                onChange={handleInputChange}
                fullWidth
                sx={{marginBottom: '24px'}}
                aria-label="Email"
            />

            <TextField
                label="Phone Number"
                name="phoneNumber"
                value={userForm.phoneNumber}
                onChange={handleInputChange}
                fullWidth
                sx={{marginBottom: '24px'}}
                aria-label="Phone Number"
            />

            <TextField
                label="Username"
                name="username"
                value={userForm.username}
                onChange={handleInputChange}
                fullWidth
                sx={{marginBottom: '24px'}}
                aria-label="Username"
            />

            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSave}
                sx={{width: '100%', padding: '12px'}}
                disabled={loading || isUploading}
                aria-label="Save Personal Information"
            >
                {loading ? <LoadingIndicator open={loading}/> : 'Save Personal Information'}
            </Button>

            {/* Alert for Notifications */}
            <CustomAlert
                open={alert.open}
                onClose={handleCloseAlert}
                message={alert.message}
                severity={alert.severity}
            />
        </Box>
    );
}
export default UserProfile;
