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
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { useContext } from 'react';

import { FacebookIcon, GoogleIcon } from "../../theme/CustomIcons";
import { ThemeContext } from "../../theme/ThemeContext.tsx";
import getThemeSignInSignUp from "../../theme/getThemeSignInSignUp.ts";
import { registerUser } from "../../state/Authentication/Reducer.ts";
import {RegisterRequest} from "../../state/Authentication/ActionType.ts";
import {useAppDispatch} from "../../state/store.ts";
import {useNavigate} from "react-router-dom";
import logo from "@images/logo.png";

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
    overflowY:'auto',
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
    const navigate=useNavigate();
    const { isDarkMode, showCustomTheme } = useContext(ThemeContext);
    const dispatch = useAppDispatch();
    const mode = isDarkMode ? 'dark' : 'light';
    const defaultTheme = createTheme({ palette: { mode } });
    const SignUpTheme = createTheme(getThemeSignInSignUp(mode));

    const [formData, setFormData] = React.useState<RegisterRequest>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        phoneNumber:'',
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
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const validateInputs = () => {
        let isValid = true;

        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!formData.password || formData.password.length < 8) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 8 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (!formData.firstName) {
            setFirstNameError(true);
            setFirstNameErrorMessage('Firstname is required.');
            isValid = false;
        } else {
            setFirstNameError(false);
            setFirstNameErrorMessage('');
        }

        if (!formData.lastName) {
            setLastNameError(true);
            setLastNameErrorMessage('Lastname is required.');
            isValid = false;
        } else {
            setLastNameError(false);
            setLastNameErrorMessage('');
        }

        if (!formData.username) {
            setUsernameError(true);
            setUsernameErrorMessage('Username is required.');
            isValid = false;
        } else {
            setUsernameError(false);
            setUsernameErrorMessage('');
        }
        if (!formData.phoneNumber || formData.phoneNumber.length > 11) {
            setPhoneNumberError(true);
            setPhoneNumberErrorMessage('Phone number is not correct format');
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
            try {
                 dispatch(registerUser(formData)).unwrap();
                navigate("/check-email")
            } catch (error) {
                console.error('Failed to login:', error);
            }
        }
    };

    return (
        <ThemeProvider theme={showCustomTheme ? SignUpTheme : defaultTheme}>
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
                            Sign up
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                        >
                            <FormControl>
                                <FormLabel htmlFor="firstName">FirstName</FormLabel>
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
                                <FormLabel htmlFor="lastName">LastName</FormLabel>
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
                                <FormLabel htmlFor="phoneNumber">PhoneNumber</FormLabel>
                                <TextField
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    id="phoneNumber"
                                    error={phoneNumberError}
                                    helperText={phoneNumberErrorMessage}
                                    color={phoneNumberError? 'error' : 'primary'}
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
                                <FormLabel htmlFor="username">Username</FormLabel>
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
                                <FormLabel htmlFor="password">Password</FormLabel>
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
                                label="I want to receive updates via email."
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                            >
                                Sign up
                            </Button>
                            <Typography sx={{ textAlign: 'center' }}>
                                Already have an account?{' '}
                                <span>
                                    <Link
                                        href="/account/signin"
                                        variant="body2"
                                        sx={{ alignSelf: 'center' }}
                                    >
                                        Sign in
                                    </Link>
                                </span>
                            </Typography>
                        </Box>
                        <Divider>
                            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
                        </Divider>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => alert('Sign up with Google')}
                                startIcon={<GoogleIcon />}
                            >
                                Sign up with Google
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => alert('Sign up with Facebook')}
                                startIcon={<FacebookIcon />}
                            >
                                Sign up with Facebook
                            </Button>
                        </Box>
                    </Card>
                </Stack>
            </SignUpContainer>
        </ThemeProvider>
    );
}
