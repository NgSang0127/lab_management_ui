import React from 'react';
import {Container, Typography, Button, Box} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import '../../components/error/Unauthorized.css';
import {Helmet} from "react-helmet-async";

const Unauthorized: React.FC = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/');
    };

    const handleSignIn = () => {
        navigate('/account/signin');
    };

    return (
        <>
            <Helmet>
                <title>403 | Lab Management IT</title>
            </Helmet>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    px: 2,
                }}
            >
                <Container
                    maxWidth="xl"
                    sx={{
                        display: "flex",
                        flexDirection: {xs: "column", md: "row"},
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: {xs: "auto", md: "700px"},
                        height: {xs: "auto", md: "700px"},
                        textAlign: {xs: "center", md: "left"},
                        py: {xs: 3, md: 4},
                        px: {xs: 2, md: 4},
                        bgcolor: "background.paper",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                        borderRadius: 3,
                        overflow: "hidden",
                    }}
                >
                    <div className="error-image-container">
                        <img
                            src="https://res.cloudinary.com/dsboloq8v/image/upload/v1744822591/3828547_wlgdua.jpg"
                            alt={t('error.403.image_alt', 'error 403 Forbidden Illustration')}
                            className="error-image border-1 rounded"

                        />
                    </div>

                    <div className="error-text-container">
                        <Typography
                            variant="h3"
                            fontWeight="bold"
                            color="text.primary"
                            sx={{
                                fontSize: {xs: "2rem", md: "3rem"},
                                mb: 1,
                            }}
                        >
                            {t('error.403.oops', 'Oops...')}
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            color="text.primary"
                            sx={{
                                fontSize: {xs: "1.25rem", md: "1.5rem"},
                                mb: 1,
                            }}
                        >
                            {t('error.403.title', 'Access Denied')}
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                                fontSize: {xs: "0.9rem", md: "1rem"},
                                lineHeight: 1.6,
                                maxWidth: "80%",
                                mb: 3,
                                mx: {xs: "auto", md: 0},
                            }}
                        >
                            {t('error.403.message', 'You do not have permission to access this page. Please go back to the' +
                                ' home page or sign in.')}
                        </Typography>

                        <div className="button-container">
                            <Button
                                className="go-back-button"
                                onClick={handleGoBack}
                                aria-label={t('error.403.button_go_back', 'Go Back')}
                            >
                                {t('error.403.button_go_back', 'Go Back')}
                            </Button>
                            <Button
                                className="sign-in-button"
                                onClick={handleSignIn}
                                aria-label={t('error.403.button_sign_in', 'Sign In')}
                            >
                                {t('error.403.button_sign_in', 'Sign In')}
                            </Button>
                        </div>
                    </div>
                </Container>
            </Box>
        </>
    );
};

export default Unauthorized;