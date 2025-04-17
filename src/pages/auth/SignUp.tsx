import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useCallback, useState } from 'react';

import { FacebookIcon, GoogleIcon } from '../../theme/CustomIcons.tsx';
import { registerUser } from '../../state/auth/thunk.ts';
import { RegisterRequest } from '../../state/auth/types.ts';
import { useAppDispatch } from '../../state/store.ts';
import { useNavigate } from 'react-router-dom';
import logo from '@images/logo.png';
import { useTranslation } from 'react-i18next';
import { AlertColor } from '@mui/material';
import CustomAlert from '../../components/support/CustomAlert.tsx';
import {Helmet} from "react-helmet-async";

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '650px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
    minHeight: '100%',
    padding: theme.spacing(2),
    overflowY: 'auto',
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    backgroundImage:
        'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
        backgroundImage:
            'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
}));

export default function SignUp() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

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

    const [formData, setFormData] = React.useState<RegisterRequest>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
    });

    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [firstNameError, setFirstNameError] = React.useState(false);
    const [firstNameErrorMessage, setFirstNameErrorMessage] = React.useState('');
    const [lastNameError, setLastNameError] = React.useState(false);
    const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState('');
    const [usernameError, setUsernameError] = React.useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');
    const [phoneNumberError, setPhoneNumberError] = React.useState(false);
    const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = React.useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateInputs = () => {
        let isValid = true;

        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            setEmailError(true);
            setEmailErrorMessage(t('signup.errors.email'));
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!formData.password || formData.password.length < 8) {
            setPasswordError(true);
            setPasswordErrorMessage(t('signup.errors.password'));
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (!formData.firstName) {
            setFirstNameError(true);
            setFirstNameErrorMessage(t('signup.errors.firstName'));
            isValid = false;
        } else {
            setFirstNameError(false);
            setFirstNameErrorMessage('');
        }

        if (!formData.lastName) {
            setLastNameError(true);
            setLastNameErrorMessage(t('signup.errors.lastName'));
            isValid = false;
        } else {
            setLastNameError(false);
            setLastNameErrorMessage('');
        }

        if (!formData.username) {
            setUsernameError(true);
            setUsernameErrorMessage(t('signup.errors.username'));
            isValid = false;
        } else {
            setUsernameError(false);
            setUsernameErrorMessage('');
        }

        if (!formData.phoneNumber || formData.phoneNumber.length > 11) {
            setPhoneNumberError(true);
            setPhoneNumberErrorMessage(t('signup.errors.phoneNumber'));
            isValid = false;
        } else {
            setPhoneNumberError(false);
            setPhoneNumberErrorMessage('');
        }

        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateInputs()) {
            showAlert('Đang xử lý đăng ký...', 'info');

            dispatch(registerUser(formData))
                .unwrap()
                .then((response) => {
                    showAlert(response.message, 'success');
                    setTimeout(() => {
                        navigate('/check-email');
                    }, 2000);
                })
                .catch((error) => {
                    showAlert(error || 'Đăng ký thất bại!', 'error');
                });
        }
    };

    return (
        <>
            <Helmet>
                <title>Sign up | Lab Management IT</title>
            </Helmet>
            <CssBaseline />
            <SignUpContainer direction="column" justifyContent="space-between">
                <Stack
                    sx={{
                        justifyContent: 'center',
                        minHeight: '100vh',
                        overflowY: 'auto',
                    }}
                >
                    <Card variant="outlined">
                        <Box
                            component="img"
                            src={logo}
                            alt="Logo"
                            sx={{ width: 60, height: 60 }}
                        />
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                        >
                            {t('signup.title')}
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                        >
                            <FormControl>
                                <FormLabel htmlFor="firstName">{t('signup.firstName')}</FormLabel>
                                <TextField
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    id="firstName"
                                    placeholder="A"
                                    error={firstNameError}
                                    helperText={firstNameErrorMessage}
                                    color={firstNameError ? 'error' : 'primary'}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="lastName">{t('signup.lastName')}</FormLabel>
                                <TextField
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    id="lastName"
                                    placeholder="Nguyen"
                                    error={lastNameError}
                                    helperText={lastNameErrorMessage}
                                    color={lastNameError ? 'error' : 'primary'}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="phoneNumber">{t('signup.phoneNumber')}</FormLabel>
                                <TextField
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    id="phoneNumber"
                                    error={phoneNumberError}
                                    helperText={phoneNumberErrorMessage}
                                    color={phoneNumberError ? 'error' : 'primary'}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <TextField
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    id="email"
                                    placeholder="your@email.com"
                                    autoComplete="email"
                                    variant="outlined"
                                    error={emailError}
                                    helperText={emailErrorMessage}
                                    color={emailError ? 'error' : 'primary'}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="username">{t('signup.username')}</FormLabel>
                                <TextField
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    id="username"
                                    placeholder="ITIT...."
                                    error={usernameError}
                                    helperText={usernameErrorMessage}
                                    color={usernameError ? 'error' : 'primary'}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="password">{t('signup.password')}</FormLabel>
                                <TextField
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    id="password"
                                    placeholder="••••••••"
                                    type="password"
                                    autoComplete="new-password"
                                    variant="outlined"
                                    error={passwordError}
                                    helperText={passwordErrorMessage}
                                    color={passwordError ? 'error' : 'primary'}
                                />
                            </FormControl>
                            <FormControlLabel
                                control={<Checkbox value="allowExtraEmails" color="primary" />}
                                label={t('signup.allow_extra_email')}
                            />
                            <Button type="submit" fullWidth variant="contained">
                                {t('signup.button')}
                            </Button>
                            <Typography sx={{ textAlign: 'center' }}>
                                {t('signup.have_account')}{' '}
                                <span>
                                    <Link
                                        href="/account/signin"
                                        variant="body2"
                                        sx={{ alignSelf: 'center' }}
                                    >
                                        {t('signin.title')}
                                    </Link>
                                </span>
                            </Typography>
                        </Box>
                        <Divider>
                            <Typography sx={{ color: 'text.secondary' }}>{t('signup.or')}</Typography>
                        </Divider>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => showAlert('Sign up with Google', 'info')}
                                startIcon={<GoogleIcon />}
                            >
                                {t('signup.google')}
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => showAlert('Sign up with Facebook', 'info')}
                                startIcon={<FacebookIcon />}
                            >
                                {t('signup.facebook')}
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
            </SignUpContainer>
        </>
    );
}