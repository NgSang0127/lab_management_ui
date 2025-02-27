import React, {useState, useEffect, useCallback, useContext} from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    InputBase,
    Avatar,
    Box,
    Button,
    Drawer,
    useTheme,
    useMediaQuery, ToggleButtonGroup, ToggleButton,
} from '@mui/material';
import {
    Search as SearchIcon,
    AccountCircle,
    Menu as MenuIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../state/store";
import { blue } from "@mui/material/colors";
import { logout } from "../../state/Authentication/Reducer";
import logo from "@images/logo.png";
import SidebarAdmin from "../Dashboard/SidebarAdmin.tsx";
import {SidebarContext} from "../../context/SidebarContext.tsx";
import {useTranslation} from "react-i18next";
import {styled} from "@mui/material/styles";
import NotificationIcon from "./NotificationIcon.tsx";
import Stack from "@mui/material/Stack";

// eslint-disable-next-line no-empty-pattern
const CustomToggleButtonGroup = styled(ToggleButtonGroup)(({ }) => ({
    borderRadius: "20px",
    marginRight: "30px",
    overflow: "hidden",
    backgroundColor: "#c4dfdf",
    "& .MuiToggleButton-root": {
        border: "none",
        padding: "8px 16px",
        minWidth: "50px",
        color: "#555",
        fontWeight: "bold",
        transition: "all 0.3s",
    },
    "& .MuiToggleButton-root.Mui-selected": {
        backgroundColor: "#004e7f",
        color: "#fff",
    },
    "& .MuiToggleButton-root:hover": {
        backgroundColor: "#20e3ca",
    },
}));

const Navbar: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useSelector((state: RootState) => state.auth);
    const { toggleSidebar } = useContext(SidebarContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const {t,i18n}=useTranslation();
    const [language, setLanguage] = useState(i18n.language || "vn");

    useEffect(() => {
        i18n.changeLanguage(language);  // Ensure i18n is updated with the initial language
    }, [language, i18n]);

    const handleLanguageChange = (_event: React.MouseEvent<HTMLElement>, newLanguage: string | null) => {
        if (newLanguage) {
            setLanguage(newLanguage);
            i18n.changeLanguage(newLanguage);
        }
    };

    // Define navigation items
    const navItems = [
        { text: t("navbar.about_us"), path: "/about" },
        { text: t("navbar.view_timetable"), path: "/timetable/by-week" },
        { text: t("navbar.featured"), path: "/featured" },
        { text: t("navbar.contact_me"), path: "/contact" },
        { text: t('attendance.title'), path: "/attendance/checkAttendance" },
    ];


    // Handle opening and closing of mobile drawer
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Handle avatar/menu clicks based on user role
    const handleAvatarClick = useCallback(() => {
        if (user?.role === "ADMIN" || user?.role === "OWNER" || user?.role === "CO_OWNER") {
            navigate("/admin/hcmiu");
        } else if (user?.role === "TEACHER" || user?.role === "STUDENT") {
            navigate("/profile/dashboard");
        } else {
            navigate("/profile");
        }
    }, [navigate, user]);


    // Handle storage changes for logout
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'accessToken' && event.newValue === null) {
                dispatch(logout() as never);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [dispatch]);

    // Render navigation links for desktop
    const renderNavLinks = () => (
        navItems.map((item) => (
            <Button
                key={item.text}
                component={Link}
                to={item.path}
                sx={{
                    color: 'white',
                    textTransform: 'none',
                    '&:hover': {
                        textDecoration: 'underline',
                        backgroundColor: 'transparent',
                    },
                }}
            >
                {item.text}
            </Button>
        ))
    );

    // Drawer content for mobile
    const drawer = ( <SidebarAdmin />);

    return (
        <AppBar
            position="sticky"
            sx={{
                zIndex: theme.zIndex.drawer + 1,
                background: 'linear-gradient(294deg, #0093E9 0%, #80D0C7 100%)',
                boxShadow: 'none',
            }}
        >
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                {/* Mobile Menu Icon */}
                {isMobile && (
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={toggleSidebar}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                {/* Logo and Title */}
                <Button
                    onClick={() => navigate("/")}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 0,
                        '&:hover': { backgroundColor: 'transparent' },
                        cursor: 'pointer',
                    }}
                    disableRipple
                >
                    <Box
                        component="img"
                        src={logo}
                        alt="Logo"
                        sx={{ width: 60, height: 60, mr: 1 }}
                    />
                    <Typography
                        variant="h6"
                        color="inherit"
                        sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}
                    >
                        LAB MANAGEMENT IT
                    </Typography>
                </Button>

                {/* Navigation Links and Search for Desktop */}
                {!isMobile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {renderNavLinks()}

                        {/* Search Bar */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
                                borderRadius: 1,
                                paddingX: 1,
                                marginLeft: 2,
                            }}
                        >
                            <SearchIcon />
                            <InputBase
                                placeholder={t('navbar.search')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        // Handle search submission
                                        console.log('Search Query:', searchQuery);
                                        // Navigate to search results page if exists
                                        // navigate(`/search?query=${searchQuery}`);
                                    }
                                }}
                                sx={{ ml: 1, color: 'inherit' }}
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Box>
                    </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CustomToggleButtonGroup
                        value={language}
                        exclusive
                        onChange={handleLanguageChange}
                        size="small"
                    >
                        <ToggleButton value="en">EN</ToggleButton>
                        <ToggleButton value="vn">VN</ToggleButton>
                    </CustomToggleButtonGroup>

                    {user?.enabled ? (
                        <Stack direction="row" alignItems="center" spacing={2}>
                            {/* Icon thông báo */}
                            <NotificationIcon />

                            {/* Avatar người dùng */}
                            <IconButton
                                onClick={handleAvatarClick}
                                color="inherit"
                                aria-label="account of current user"
                                sx={{ padding: 0 }}
                            >
                                <Avatar
                                    sx={{ bgcolor: blue.A400 }}
                                    src={user?.image || undefined}
                                >
                                    {!user?.image && user?.firstName
                                        ? user.firstName.charAt(0).toUpperCase()
                                        : <AccountCircle />}
                                </Avatar>
                            </IconButton>
                        </Stack>
                    ) : (
                        <IconButton
                            edge="end"
                            onClick={() => navigate("/account/signin")}
                            color="inherit"
                            aria-label="sign in"
                        >
                            <AccountCircle sx={{ fontSize: "2rem" }} />
                        </IconButton>
                    )}
                </Box>
            </Toolbar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
            >
                {drawer}
            </Drawer>
        </AppBar>
    );
};

export default Navbar;
