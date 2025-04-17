import React, { useRef } from "react";
import { Avatar, Box, Button, Typography, Divider, List, ListItem, ListItemText, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import UserProfile from "../../components/setting/UserProfile.tsx";
import ChangePassword from "../../components/setting/ChangePassword.tsx";
import TwoFactorAuth from "../../components/setting/TwoFactorAuth.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store.ts";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from '@mui/icons-material/X';
import { DEFAULT_COVER_IMAGE } from "../../assets/link/CoverImage.ts";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Helmet } from "react-helmet-async";

const SettingPage: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useSelector((state: RootState) => state.auth);

    const userProfileRef = useRef<HTMLDivElement>(null);
    const changePasswordRef = useRef<HTMLDivElement>(null);
    const twoFactorAuthRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <Helmet>
                <title>Setting | Lab Management IT</title>
            </Helmet>
            <Box sx={{ bgcolor: 'background.paper', minHeight: "100vh", py: 4, m: 0,borderRadius:2 }}>
                <Box
                    sx={{
                        width: '100%',
                        px: { xs: 2, sm: 10 }
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            height: "400px",
                            borderRadius: "16px",
                            overflow: "hidden",
                            bgcolor: 'grey.300',
                        }}
                    >
                        <img
                            src={DEFAULT_COVER_IMAGE}
                            alt="Cover"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                            }}
                        />
                    </Box>
                </Box>


                <Box sx={{ maxWidth: "1300px", mx: "auto", px: { xs: 2, sm: 4 } }}>
                    {/* Main Layout: Sidebar + Content */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 4,
                            flexDirection: { xs: "column", md: "row" },
                            marginTop: "-100px",
                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        {/* Sidebar */}
                        <Box
                            sx={{
                                width: { xs: "100%", md: "300px" },
                                bgcolor: 'background.default',
                                borderRadius: "12px",
                                p: 3,
                                boxShadow: theme => theme.shadows[1],
                            }}
                        >
                            {/* user Information */}
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                                    <Avatar
                                        src={user?.image}
                                        alt={user?.fullName}
                                        sx={{ width: 60, height: 60, bgcolor: "primary.main" }}
                                    >
                                        {user?.firstName?.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" fontWeight="bold" color="text.primary">
                                            {user?.fullName || `${user?.firstName} ${user?.lastName}`}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {user?.role || "User"}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* user Details */}
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        <strong>Email:</strong> {user?.email || "Not provided"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        <strong>Phone:</strong> {user?.phoneNumber || "Not provided"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        <strong>Location:</strong> {"VietNam"}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.2, mt: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Social:</strong>{" "}
                                        </Typography>
                                        <IconButton
                                            component="a"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Facebook"
                                            sx={{
                                                color: 'primary.main',
                                                transition: 'color 0.3s',
                                                '&:hover': {
                                                    color: 'primary.light',
                                                },
                                            }}
                                        >
                                            <FacebookIcon />
                                        </IconButton>
                                        <IconButton
                                            component="a"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="YouTube"
                                            sx={{
                                                color: 'error.main',
                                                transition: 'color 0.3s',
                                                '&:hover': {
                                                    color: 'error.light',
                                                },
                                            }}
                                        >
                                            <YouTubeIcon />
                                        </IconButton>
                                        <IconButton
                                            component="a"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Instagram"
                                            sx={{
                                                color: 'secondary.main',
                                                transition: 'color 0.3s',
                                                '&:hover': {
                                                    color: 'secondary.light',
                                                },
                                            }}
                                        >
                                            <InstagramIcon />
                                        </IconButton>
                                        <IconButton
                                            component="a"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Twitter"
                                            sx={{
                                                color: 'grey.800',
                                                transition: 'color 0.3s',
                                                '&:hover': {
                                                    color: 'grey.900',
                                                },
                                            }}
                                        >
                                            <XIcon />
                                        </IconButton>
                                    </Box>
                                </Box>

                                {/* Edit Button */}
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={() => scrollToSection(userProfileRef)}
                                    sx={{
                                        width: "100%",
                                        borderColor: "primary.main",
                                        color: "primary.main",
                                        "&:hover": { bgcolor: "primary.light", borderColor: "primary.main" },
                                    }}
                                >
                                    {t("setting.userProfile.edit")}
                                </Button>
                            </Box>

                            <Divider sx={{ mb: 2, borderColor: 'grey.300' }} />

                            {/* Navigation */}
                            <List>
                                {[
                                    { label: t("setting.userProfile.title"), ref: userProfileRef },
                                    { label: t("setting.userProfile.security"), ref: changePasswordRef },
                                    { label: t("setting.userProfile.twoFactorAuth"), ref: twoFactorAuthRef },
                                ].map((item) => (
                                    <ListItem
                                        key={item.label}
                                        onClick={() => scrollToSection(item.ref)}
                                        sx={{
                                            cursor: "pointer",
                                            "&:hover": { bgcolor: "grey.100" },
                                            borderRadius: "8px",
                                        }}
                                    >
                                        <ListItemText primary={item.label} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>

                        {/* Content */}
                        <Box sx={{ flex: 1 }}>
                            <motion.div
                                ref={userProfileRef}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <UserProfile />
                            </motion.div>
                            <motion.div
                                ref={changePasswordRef}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <ChangePassword />
                            </motion.div>
                            <motion.div
                                ref={twoFactorAuthRef}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <TwoFactorAuth />
                            </motion.div>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default SettingPage;