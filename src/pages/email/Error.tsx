import React from 'react';
import {Box, Typography, Button, Container} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {useLocation, useNavigate} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {motion} from "framer-motion";

const Error: React.FC = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the error message from the URL
    const searchParams = new URLSearchParams(location.search);
    const errorMessage = searchParams.get('message') || t('error.default_message', 'An unknown error occurred.');

    const handleRetry = () => {
        navigate('/');
    }

    // Hiệu ứng animation cho icon
    const iconVariants = {
        initial: {scale: 0, opacity: 0},
        animate: {scale: 1, opacity: 1, transition: {duration: 0.5, ease: "easeOut"}},
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                textAlign: "center",
                py: {xs: 4, md: 6}, // Padding responsive
                bgcolor: "background.default",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    p: {xs: 4, md: 6},
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Box shadow tinh tế
                    bgcolor: "background.paper",
                    maxWidth: {xs: "90%", sm: "70%", md: "50%"},
                    width: "100%",
                }}
            >
                {/* Icon lỗi với hiệu ứng animation */}
                <motion.div
                    variants={iconVariants}
                    initial="initial"
                    animate="animate"
                >
                    <ErrorOutlineIcon
                        sx={{
                            fontSize: {xs: 40, md: 48},
                            color: "error.main",
                            mb: 1,
                        }}
                    />
                </motion.div>

                {/* Tiêu đề lỗi */}
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="error.main"
                    sx={{
                        fontSize: {xs: "1.75rem", md: "2.125rem"},
                    }}
                >
                    {t('check_email.error.title', 'Error')}
                </Typography>

                {/* Thông điệp lỗi */}
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        fontSize: {xs: "0.9rem", md: "1rem"},
                        lineHeight: 1.6,
                        maxWidth: "80%",
                    }}
                >
                    {errorMessage}
                </Typography>

                {/* Nút Retry */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRetry}
                    aria-label={t('check_email.error.button', 'Try Again')}
                    sx={{
                        mt: 3,
                        px: 4,
                        py: 1.5,
                        fontSize: {xs: "0.875rem", md: "1rem"},
                        fontWeight: "medium",
                        borderRadius: 2,
                        textTransform: "none",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
                        },
                        width: {xs: "50%", sm: "30%", md: "25%"},
                        minWidth: "200px",
                    }}
                >
                    {t('check_email.error.button', 'Try Again')}
                </Button>
            </Box>
        </Container>
    );
};


export default Error;