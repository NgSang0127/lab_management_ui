import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import {
    ThemeProvider,
    createTheme,
    styled
} from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import getThemeSignInSignUp from "../../theme/getThemeSignInSignUp.ts";
import {FacebookIcon, GoogleIcon} from "../../theme/CustomIcons.tsx";
import {ThemeContext} from "../../theme/ThemeContext.tsx";
import {useContext} from "react";
import logo from "@images/logo.png";
import {LoginRequestData} from "../../state/Authentication/ActionType.ts";
import {getUser, loginUser} from "../../state/Authentication/Reducer.ts";
import {useAppDispatch} from "../../state/store.ts";
import {useNavigate} from "react-router-dom";


const Card = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        width: '550px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignInContainer = styled(Stack)(({theme}) => ({
    height: 'auto',
    backgroundImage:
        'rgba(255, 255, 255, 0.8)',
    backgroundRepeat: 'no-repeat',
    [theme.breakpoints.up('sm')]: {
        height: '100dvh',
    },
    ...theme.applyStyles('dark', {
        backgroundImage:
            'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
}));

export default function SignIn() {
    const {isDarkMode, showCustomTheme} = useContext(ThemeContext);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const mode = isDarkMode ? 'dark' : 'light';
    const defaultTheme = createTheme({palette: {mode}});
    const SignInTheme = createTheme(getThemeSignInSignUp(mode));

    const [formData, setFormData] = React.useState<LoginRequestData>({
        username: '',
        password: '',
    });

    const [usernameError, setUsernameError] = React.useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData(prevData => ({...prevData, [name]: value}));
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const validateInputs = () => {

        let isValid = true;

        if (!formData.username || formData.username.length < 1) {
            setPasswordError(true);
            setPasswordErrorMessage('Username is required');
            isValid = false;
        } else {
            setUsernameError(false);
            setUsernameErrorMessage('');
        }

        if (!formData.password || formData.password.length < 8) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 8 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };
    console.log(showCustomTheme);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateInputs()) {
            try {
                const response = await dispatch(loginUser(formData)).unwrap();
                console.log("response", response);
                await dispatch(getUser()).unwrap();
                navigate('/');

            } catch (error) {
                console.error('Failed to login:', error);
            }
        }
    };

    return (
        <ThemeProvider theme={showCustomTheme ? SignInTheme : defaultTheme}>
            <CssBaseline/>

            <SignInContainer direction="column" justifyContent="space-between">
                <Stack
                    sx={{
                        justifyContent: 'center',
                        height: '100dvh',
                    }}
                >
                    <Card variant="outlined">
                        <Box
                            component="img"
                            src={logo}
                            alt="Logo"
                            sx={{width: 60, height: 60}}
                        />
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                        >
                            Sign in
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                gap: 2,
                            }}
                        >
                            <FormControl>
                                <FormLabel htmlFor="username">Username</FormLabel>
                                <TextField
                                    onChange={handleChange}
                                    autoComplete="username"
                                    name="username"
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
                                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                    <Link
                                        component="button"
                                        onClick={handleClickOpen}
                                        variant="body2"
                                        sx={{alignSelf: 'baseline'}}
                                    >
                                        Forgot your password?
                                    </Link>
                                </Box>
                                <TextField
                                    onChange={handleChange}
                                    error={passwordError}
                                    helperText={passwordErrorMessage}
                                    name="password"
                                    placeholder="••••••••"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    color={passwordError ? 'error' : 'primary'}
                                />
                            </FormControl>
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary"/>}
                                label="Remember me"
                            />
                            <ForgotPassword open={open} handleClose={handleClose}/>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={validateInputs}
                            >
                                Sign in
                            </Button>
                            <Typography sx={{textAlign: 'center'}}>
                                Don&apos;t have an account?{' '}
                                <span>
                  <Link
                      href="/account/signup"
                      variant="body2"
                      sx={{alignSelf: 'center'}}
                  >
                    Sign up
                  </Link>
                </span>
                            </Typography>
                        </Box>
                        <Divider>or</Divider>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                onClick={() => alert('Sign in with Google')}
                                startIcon={<GoogleIcon/>}
                            >
                                Sign in with Google
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                onClick={() => alert('Sign in with Facebook')}
                                startIcon={<FacebookIcon/>}
                            >
                                Sign in with Facebook
                            </Button>
                        </Box>
                    </Card>
                </Stack>
            </SignInContainer>
        </ThemeProvider>
    );
}