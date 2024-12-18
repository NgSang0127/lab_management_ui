import React, {useContext, useState} from 'react';
import {
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
    Typography
} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import ForgotPassword from './ForgotPassword';
import {ThemeProvider, createTheme, styled} from '@mui/material/styles';
import {ThemeContext} from '../../theme/ThemeContext.tsx';
import {LoginRequestData} from '../../state/Authentication/ActionType.ts';
import {useAppDispatch} from '../../state/store.ts';
import {getUser, loginUser} from '../../state/Authentication/Reducer.ts';
import {useNavigate} from 'react-router-dom';
import logo from '@images/logo.png';
import getThemeSignInSignUp from '../../theme/getThemeSignInSignUp.ts';
import Divider from "@mui/material/Divider";
import {FacebookIcon, GoogleIcon} from "../../theme/CustomIcons.tsx";

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

// Styled components
const Card = styled(Box)(({theme}) => cardStyles(theme));
const SignInContainer = styled(Stack)(({theme}) => ({
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

// Refactored component
export default function SignIn() {
    const {isDarkMode, showCustomTheme} = useContext(ThemeContext);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const mode = isDarkMode ? 'dark' : 'light';
    const defaultTheme = createTheme({palette: {mode}});
    const signInTheme = createTheme(getThemeSignInSignUp(mode));

    // Consolidated state for errors
    const [formData, setFormData] = useState<LoginRequestData>({username: '', password: ''});
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({username: '', password: ''});
    const [open, setOpen] = useState(false);

    // Handlers - extracted for modularity
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData(prevData => ({...prevData, [name]: value}));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleForgotPasswordOpen = () => {
        event.preventDefault();
        setOpen(true);
        setErrors({username: '', password: ''}); // Clear errors when dialog opens
    };
    const handleForgotPasswordClose = () => {
        setOpen(false);
    }

    const validateInputs = () => {
        const validationErrors = {
            username: formData.username ? '' : 'Username is required',
            password: formData.password.length >= 8 ? '' : 'Password must be at least 8 characters',
        };
        setErrors(validationErrors);

        return !validationErrors.username && !validationErrors.password;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (validateInputs()) {
            try {
                await dispatch(loginUser(formData)).unwrap();
                await dispatch(getUser()).unwrap();
                navigate('/');
            } catch (error) {
                console.error('Failed to login:', error);
            }
        }
    };

    return (
        <ThemeProvider theme={showCustomTheme ? signInTheme : defaultTheme}>
            <CssBaseline/>
            <SignInContainer direction="column" justifyContent="space-between">
                <Stack sx={{justifyContent: 'center', height: '100dvh'}}>
                    <Card>
                        <Box component="img" src={logo} alt="Logo" sx={{width: 60, height: 60}}/>
                        <Typography component="h1" variant="h4"
                                    sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}>
                            Sign in
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={formContainerStyles}>
                            <FormControl>
                                <FormLabel htmlFor="username">Username</FormLabel>
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
                                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                    <Link component="button" onClick={handleForgotPasswordOpen} variant="body2"
                                          sx={{alignSelf: 'baseline'}}
                                    >
                                        Forgot your password?
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
                                        input:{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={togglePasswordVisibility} edge="end">
                                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        )},
                                    }}
                                />
                            </FormControl>
                            <FormControlLabel control={<Checkbox value="remember" color="primary"/>}
                                              label="Remember me"/>
                            <ForgotPassword open={open} handleClose={handleForgotPasswordClose}/>
                            <Button type="submit" fullWidth variant="contained">
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