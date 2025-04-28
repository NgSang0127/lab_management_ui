import React, { useState, useEffect, useCallback, useContext, memo } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    InputBase,
    Avatar,
    Box,
    Button,
    useTheme,
    useMediaQuery,
    ToggleButtonGroup,
    ToggleButton,
    Menu,
    MenuItem,
    Collapse,
} from '@mui/material';
import { Search as SearchIcon, AccountCircle, Menu as MenuIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../state/store';
import { logout } from '../../state/auth/thunk.ts';
import logo from '@images/logo.png';
import SidebarAdmin from '../sidebar/SidebarAdmin.tsx';
import { SidebarContext } from '../../context/SidebarContext.tsx';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import NotificationIcon from './NotificationIcon.tsx';
import Stack from '@mui/material/Stack';

const CustomToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    borderRadius: '20px',
    overflow: 'hidden',
    backgroundColor: theme.palette.grey[200],
    marginRight: '12px',
    '& .MuiToggleButton-root': {
        border: 'none',
        padding: '6px 12px',
        minWidth: '40px',
        color: theme.palette.text.secondary,
        fontWeight: 'bold',
        transition: 'all 0.3s',
    },
    '& .MuiToggleButton-root.Mui-selected': {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
    },
}));

const SearchBar = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
    borderRadius: 20,
    paddingX: 1,
    marginLeft: 2,
});

const NavButtonStyles = {
    color: 'grey.50',
    textTransform: 'none',
    fontWeight: 500,
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        textDecoration: 'none',
    },
    '&.active': {
        color: 'warning.main',
    },
};

const NavLink: React.FC<{ item: { text: string; path?: string; scrollTo?: string } }> = memo(({ item }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleScrollClick = (scrollTo: string) => {
        if (location.pathname !== '/') {
            navigate('/', { state: { scrollTo } });
            setTimeout(() => {
                document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        } else {
            document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return item.scrollTo ? (
        <Box onClick={() => handleScrollClick(item.scrollTo)} sx={{ ...NavButtonStyles, cursor: 'pointer' }}>
            {item.text}
        </Box>
    ) : (
        <Button component={Link} to={item.path ?? '/'} sx={NavButtonStyles}>
            {item.text}
        </Button>
    );
});

const Navbar: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { user } = useSelector((state: RootState) => state.auth);
    const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language || 'en');

    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language, i18n]);

    const handleLanguageChange = (_event: React.MouseEvent<HTMLElement>, newLanguage: string | null) => {
        if (newLanguage) {
            setLanguage(newLanguage);
            i18n.changeLanguage(newLanguage);
        }
    };

    const navItems = [
        { text: t('navbar.about_us'), path: '/about-us' },
        { text: t('navbar.view_timetable'), path: '/timetable/by-week' },
        { text: t('navbar.featured'), scrollTo: 'features-section' },
        { text: t('navbar.contact_me'), scrollTo: 'contact-section' },
        { text: t('attendance.title'), path: '/attendance/checkAttendance' },
    ];

    const handleDrawerToggle = useCallback(() => {
        if (user?.enabled) {
            toggleSidebar();
        } else {
            navigate('/account/signin');
        }
    }, [user?.enabled, navigate, toggleSidebar]);

    const handleAvatarClick = useCallback(() => {
        const roleRoutes: Record<string, string> = {
            ADMIN: '/admin/hcmiu',
            OWNER: '/admin/hcmiu',
            CO_OWNER: '/admin/hcmiu',
            TEACHER: '/profile/dashboard',
            Student: '/profile/dashboard',
        };
        navigate(roleRoutes[user?.role || ''] || '/profile');
    }, [navigate, user?.role]);

    const handleSearch = useCallback(() => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setIsSearchOpen(false);
        }
    }, [searchQuery, navigate]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'accessToken' && !event.newValue) {
                dispatch(logout() as never);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [dispatch]);

    return (
        <AppBar
            position="sticky"
            sx={{
                zIndex: theme.zIndex.drawer + 1,
                background: 'linear-gradient(294deg, #0093E9 0%, #80D0C7 100%)',
                boxShadow: 'none',
            }}
        >
            {isMobile ? (
                <>
                    <Toolbar
                        sx={{
                            justifyContent: 'center',
                            py: 1,
                            background: 'linear-gradient(294deg, #0093E9 0%, #80D0C7 100%)',
                        }}
                    >
                        <Button
                            onClick={() => navigate('/')}
                            sx={{ display: 'flex', alignItems: 'center', padding: 0, '&:hover': { backgroundColor: 'transparent' } }}
                            disableRipple
                        >
                            <Box component="img" src={logo} alt="Logo" sx={{ width: 40, height: 40, mr: 1 }} />
                            <Typography variant="h6" color="inherit" sx={{ fontWeight: 'bold' }}>
                                LAB MANAGEMENT IT
                            </Typography>
                        </Button>
                    </Toolbar>

                    <Toolbar sx={{ justifyContent: 'space-between', py: 0.5, bgcolor: 'grey.200', color: 'text.primary' }}>
                        <CustomToggleButtonGroup value={language} exclusive onChange={handleLanguageChange} size="small">
                            <ToggleButton value="en">EN</ToggleButton>
                            <ToggleButton value="vi-VN">VN</ToggleButton>
                        </CustomToggleButtonGroup>

                        <Stack direction="row" alignItems="center" spacing={1}>
                            {user?.enabled && <NotificationIcon />}
                            {user?.enabled ? (
                                <IconButton onClick={handleAvatarClick} sx={{ padding: 0 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', width: 37, height: 37 }} src={user?.image || undefined}>
                                        {!user?.image && user?.firstName ? user.firstName.charAt(0).toUpperCase() : <AccountCircle />}
                                    </Avatar>
                                </IconButton>
                            ) : (
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Box onClick={() => navigate('/account/signup')} sx={{ cursor: 'pointer' }}>
                                        <Typography sx={{ color: 'grey.50', fontWeight: 'bold', textTransform: 'none' }}>
                                            {"Đăng ký"}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ color: 'grey.50', fontWeight: 'bold', pl: 0.3, pr: 0.3 }}>|</Typography>
                                    <Box onClick={() => navigate('/account/signin')} sx={{ cursor: 'pointer' }}>
                                        <Typography sx={{ color: 'grey.50', fontWeight: 'bold', textTransform: 'none' }}>
                                            {"Đăng nhập"}
                                        </Typography>
                                    </Box>
                                </Stack>
                            )}
                        </Stack>
                    </Toolbar>

                    <Toolbar sx={{ justifyContent: 'space-between', py: 0.5, bgcolor: 'primary.main', color: 'text.primary' }}>
                        <IconButton onClick={handleDrawerToggle}>
                            <MenuIcon />
                        </IconButton>

                        <Stack direction="row" alignItems="center" spacing={1}>
                            <IconButton onClick={() => setIsSearchOpen((prev) => !prev)}>
                                <SearchIcon />
                            </IconButton>
                            <IconButton onClick={handleMenuOpen}>
                                <MoreVertIcon />
                            </IconButton>
                        </Stack>
                    </Toolbar>

                    <Collapse in={isSearchOpen}>
                        <Box sx={{ px: 2, pb: 1, bgcolor: 'primary.main' }}>
                            <SearchBar>
                                <SearchIcon sx={{ marginLeft: 1 }} />
                                <InputBase
                                    placeholder={t('navbar.search')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    sx={{ ml: 1, width: '100%' }}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </SearchBar>
                        </Box>
                    </Collapse>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        slotProps={{
                            paper: {
                                sx: { bgcolor: 'background.paper', color: 'primary.dark' },
                            },
                        }}
                    >
                        {navItems.map((item) => (
                            <MenuItem
                                key={item.text}
                                onClick={() => {
                                    if (item.scrollTo) {
                                        const scrollTo = item.scrollTo;
                                        if (location.pathname !== '/') {
                                            navigate('/', { state: { scrollTo } });
                                            setTimeout(() => {
                                                document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }, 300);
                                        } else {
                                            document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                    } else {
                                        navigate(item.path ?? '/');
                                    }
                                    handleMenuClose();
                                }}
                            >
                                {item.text}
                            </MenuItem>
                        ))}
                    </Menu>
                </>
            ) : (
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        onClick={() => navigate('/')}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: 0,
                            '&:hover': { backgroundColor: 'transparent' },
                        }}
                        disableRipple
                    >
                        <Box component="img" src={logo} alt="Logo" sx={{ width: 60, height: 60, mr: 1 }} />
                        <Typography
                            variant="h6"
                            color="inherit"
                            sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}
                        >
                            LAB MANAGEMENT IT
                        </Typography>
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box display="flex" gap={2}>
                            {navItems.map((item) => (
                                <NavLink key={item.text} item={item} />
                            ))}
                        </Box>

                        <SearchBar>
                            <SearchIcon sx={{ marginLeft: 1 }} />
                            <InputBase
                                placeholder={t('navbar.search')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                sx={{ ml: 3, color: 'inherit' }}
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </SearchBar>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CustomToggleButtonGroup value={language} exclusive onChange={handleLanguageChange} size="small">
                            <ToggleButton value="en">EN</ToggleButton>
                            <ToggleButton value="vi-VN">VN</ToggleButton>
                        </CustomToggleButtonGroup>

                        <Stack direction="row" alignItems="center" spacing={2}>
                            {user?.enabled && <NotificationIcon />}
                            {user?.enabled ? (
                                <IconButton onClick={handleAvatarClick} sx={{ padding: 0 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', width: 37, height: 37 }} src={user?.image || undefined}>
                                        {!user?.image && user?.firstName ? user.firstName.charAt(0).toUpperCase() : <AccountCircle />}
                                    </Avatar>
                                </IconButton>
                            ) : (
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Box onClick={() => navigate('/account/signup')} sx={{ cursor: 'pointer' }}>
                                        <Typography sx={{ color: 'grey.50', fontWeight: 'bold', textTransform: 'none' }}>
                                            {"Đăng ký"}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ color: 'grey.50', fontWeight: 'bold', pl: 0.3, pr: 0.3 }}>|</Typography>
                                    <Box onClick={() => navigate('/account/signin')} sx={{ cursor: 'pointer' }}>
                                        <Typography sx={{ color: 'grey.50', fontWeight: 'bold', textTransform: 'none' }}>
                                            {"Đăng nhập"}
                                        </Typography>
                                    </Box>
                                </Stack>
                            )}
                        </Stack>
                    </Box>
                </Toolbar>
            )}

            <Box
                sx={{
                    display: { xs: "block", sm: "none" },
                    transition: "width 0.3s ease-in-out",
                }}
            >
                <SidebarAdmin />
            </Box>
        </AppBar>
    );
};

export default memo(Navbar);