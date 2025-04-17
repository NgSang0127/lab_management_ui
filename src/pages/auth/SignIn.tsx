import React, { useCallback, useState } from 'react';
import {
    AlertColor,
    Box,
    Button,
    Checkbox,
    CssBaseline,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    InputAdornment,
    Link,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ForgotPassword from './ForgotPassword.tsx';
import { styled } from '@mui/material/styles';
import { LoginRequestData } from '../../state/auth/types.ts';
import { useAppDispatch } from '../../state/store.ts';
import { getUser, loginUser } from '../../state/auth/thunk.ts';
import { useNavigate } from 'react-router-dom';
import logo from '@images/logo.png';
import Divider from '@mui/material/Divider';
import { FacebookIcon, GoogleIcon } from '../../theme/CustomIcons.tsx';
import { useTranslation } from 'react-i18next';
import { clearStatus } from '../../state/auth/authSlice.ts';
import CustomAlert from '../../components/support/CustomAlert.tsx';
import {Helmet} from "react-helmet-async";

// Extract common styles
const cardStyles = (theme: any) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        width: '550px',
    },
    boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    // Tùy chỉnh boxShadow cho dark mode nếu cần, nhưng giả định App.tsx xử lý
    ...theme.applyStyles('dark', {
        boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
});

const formContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: 2,
};


const Card = styled(Box)(({ theme }) => cardStyles(theme));
const SignInContainer = styled(Stack)(({ theme }) => ({
    height: 'auto',
    backgroundImage: 'rgba(255, 255, 255, 0.8)',
    backgroundRepeat: 'no-repeat',
    [theme.breakpoints.up('sm')]: {
        height: '100dvh',
    },
    ...theme.applyStyles('dark', {
        backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
}));

export default function SignIn() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Consolidated state for errors
    const [formData, setFormData] = useState<LoginRequestData>({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ username: '', password: '' });
    const [open, setOpen] = useState(false);

    const [alert, setAlert] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: '',
        severity: 'info',
    });

    const showAlert = (message: string, severity: 'success' | 'error' | 'info') => {
        setAlert({ open: true, message, severity });
    };

    const handleCloseAlert = useCallback(() => {
        setAlert((prev) => ({ ...prev, open: false }));
    }, []);

    // Handlers
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleForgotPasswordOpen = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setOpen(true);
        setErrors({ username: '', password: '' });
    };

    const handleForgotPasswordClose = () => {
        setOpen(false);
    };

    const validateInputs = () => {
        const validationErrors = {
            username: formData.username ? '' : t('signin.errors.username_required'),
            password: formData.password ? '' : t('signin.errors.password_required'),
        };
        setErrors(validationErrors);

        return !validationErrors.username && !validationErrors.password;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (validateInputs()) {
            try {
                const loginResponse = await dispatch(loginUser(formData)).unwrap();

                if (loginResponse.tfaEnabled) {
                    dispatch(clearStatus());
                    navigate('/account/verify', { state: { username: formData.username } });
                } else {
                    dispatch(clearStatus());
                    await dispatch(getUser()).unwrap();
                    const successMessage = loginResponse.message || 'Đăng nhập thành công!';
                    showAlert(successMessage, 'success');
                    setTimeout(() => {
                        navigate('/');
                    }, 500);
                }
            }catch (error) {
                showAlert(error, 'error');
            }
        } else {
            showAlert('Vui lòng nhập đầy đủ thông tin!', 'error');
        }
    };

    return (
        <>
            <Helmet>
                <title>Sign in | Lab Management IT</title>
            </Helmet>
            <CssBaseline />
            <SignInContainer direction="column" justifyContent="space-between">
                <Stack sx={{ justifyContent: 'center', height: '100dvh' }}>
                    <Card>
                        <Box component="img" src={logo} alt="Logo" sx={{ width: 60, height: 60 }} />
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                        >
                            {t('signin.title')}
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={formContainerStyles}>
                            <FormControl>
                                <FormLabel htmlFor="username">{t('signin.username')}</FormLabel>
                                <TextField
                                    name="username"
                                    id="username"
                                    placeholder="ITIT...."
                                    autoComplete="username"
                                    required
                                    fullWidth
                                    onChange={handleChange}
                                    error={Boolean(errors.username)}
                                    helperText={errors.username}
                                />
                            </FormControl>
                            <FormControl>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <FormLabel htmlFor="password">{t('signin.password')}</FormLabel>
                                    <Link
                                        href="#"
                                        onClick={handleForgotPasswordOpen}
                                        variant="body2"
                                        sx={{ alignSelf: 'baseline' }}
                                    >
                                        {t('signin.forgot_password')}
                                    </Link>
                                </Box>
                                <TextField
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    fullWidth
                                    onChange={handleChange}
                                    error={Boolean(errors.password)}
                                    helperText={errors.password}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={togglePasswordVisibility} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                            </FormControl>
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <ForgotPassword open={open} handleClose={handleForgotPasswordClose} />
                            <Button type="submit" fullWidth variant="contained">
                                {t('signin.button')}
                            </Button>
                            <Typography sx={{ textAlign: 'center' }}>
                                {t('signin.not_have_account')}{' '}
                                <span>
                                    <Link href="/account/signup" variant="body2" sx={{ alignSelf: 'center' }}>
                                        {t('signup.title')}
                                    </Link>
                                </span>
                            </Typography>
                        </Box>
                        <Divider>{t('signin.or')}</Divider>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                onClick={() => showAlert('Sign in with Google', 'info')}
                                startIcon={<GoogleIcon />}
                            >
                                {t('signin.google')}
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                onClick={() => showAlert('Sign in with Facebook', 'info')}
                                startIcon={<FacebookIcon />}
                            >
                                {t('signin.facebook')}
                            </Button>
                        </Box>
                    </Card>
                </Stack>
                <CustomAlert
                    open={alert.open}
                    onClose={handleCloseAlert}
                    message={alert.message}
                    severity={alert.severity}
                />
            </SignInContainer>
        </>
    );
}