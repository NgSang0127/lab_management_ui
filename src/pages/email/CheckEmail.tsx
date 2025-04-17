import {Typography, Container, Box, Button} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import {Helmet} from "react-helmet-async";

const CheckEmail: React.FC = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();

    const iconVariants = {
        initial: {scale: 0, opacity: 0},
        animate: {scale: 1, opacity: 1, transition: {duration: 0.5, ease: "easeOut"}},
    };

    return (
        <>
            <Helmet>
                <title>Check Email | Lab Management IT</title>
            </Helmet>
            <Container
                maxWidth="lg"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh", // Đảm bảo chiều cao toàn màn hình
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
                        gap: 3, // Tăng khoảng cách giữa các phần tử
                        p: {xs: 4, md: 6}, // Padding responsive
                        borderRadius: 3,
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                        bgcolor: "background.paper",
                        maxWidth: {xs: "90%", sm: "70%", md: "50%"},
                        width: "100%",
                    }}
                >
                    {/* Icon với hiệu ứng animation */}
                    <motion.div
                        variants={iconVariants}
                        initial="initial"
                        animate="animate"
                    >
                        <EmailOutlinedIcon
                            sx={{
                                fontSize: {xs: 40, md: 48},
                                color: "primary.main",
                                mb: 1,
                            }}
                        />
                    </motion.div>

                    {/* Tiêu đề chính */}
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="text.primary"
                        sx={{
                            fontSize: {xs: "1.75rem", md: "2.125rem"}, // Responsive font size
                        }}
                    >
                        {t("check_email.title")}
                    </Typography>

                    {/* Mô tả */}
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            fontSize: {xs: "0.9rem", md: "1rem"},
                            lineHeight: 1.6,
                            maxWidth: "80%",
                        }}
                    >
                        {t("check_email.content")}
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/")}
                        aria-label={t("check_email.home", "Return to home")}
                        sx={{
                            mt: 3,
                            px: 4,
                            py: 1.5,
                            fontSize: {xs: "0.875rem", md: "1rem"},
                            fontWeight: "medium",
                            borderRadius: 1,
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
                        {t("check_email.home", "Return to home")}
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default CheckEmail;