import { FC, useContext } from 'react';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    Drawer,
    Box,
    Typography,
    useTheme,
    useMediaQuery,
    Avatar,
} from '@mui/material';
import {
    ManageSearch,
    Dashboard,
    AccountBalance,
    Notifications,
    ImportExport,
    People,
    Settings,
    ExitToApp,
    Menu,
    Close,
    SearchOff,
    Event,
} from '@mui/icons-material';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../state/store.ts';
import { logout } from '../../state/Authentication/Reducer.ts';
import { endSession } from '../../state/User/Reducer.ts';
import { SidebarContext } from '../../context/SidebarContext.tsx';
import { useTranslation } from 'react-i18next';
import { clearStatus } from '../../state/Authentication/Action.ts';

const SIDEBAR_WIDTH = 250;
const COLLAPSED_WIDTH = 80;
const HOVER_COLOR = '#35dae3';
const ACTIVE_COLOR = '#73f8e7';
const SIDEBAR_BG_COLOR = '#12171d';
const TEXT_COLOR = '#f1f6f9';

const SidebarAdmin: FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const location = useLocation();
    const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const menuItems = [
        { text: t('sidebar.dashboard'), icon: <Dashboard />, link: '' },
        {
            text: t('sidebar.manage_asset'),
            icon: <AccountBalance />,
            link: 'asset-management',
            subMenu: [
                { link: 'asset' },
                { link: 'location' },
                { link: 'category' },
                { link: 'manager' },
                { link: 'maintenance' },
                { link: 'borrow' },
                { link: 'software' },
                { link: 'asset-user' },
                { link: 'import-export' },
            ],
        },
        { text: t('sidebar.booking'), icon: <ManageSearch />, link: 'book' },
        { text: t('sidebar.notification'), icon: <Notifications />, link: 'notification' },
        { text: t('sidebar.events'), icon: <Event />, link: 'events' },
        { text: t('sidebar.cancel'), icon: <SearchOff />, link: 'timetable/cancel' },
        { text: t('sidebar.import'), icon: <ImportExport />, link: 'timetable/import' },
        { text: t('sidebar.user_management'), icon: <People />, link: 'user-management' },
        { text: t('sidebar.setting'), icon: <Settings />, link: 'setting' },
    ];

    const handleLogout = async () => {
        try {

            await dispatch(endSession()).unwrap();

            await dispatch(logout()).unwrap();
        } catch (error) {
            console.error("Logout process failed:", error);
        } finally {
            dispatch(clearStatus());
            navigate('/account/signin');
            if (isMobile) toggleSidebar();
        }
    };


    const handleDrawerClose = () => {
        if (isMobile) {
            toggleSidebar();
        }
    };

    const renderMenuItems = () =>
        menuItems.map((item, index) => {
            const isActive =
                (location.pathname === '/admin/hcmiu' && item.link === '') ||
                location.pathname === `/admin/hcmiu/${item.link}`;
            const hasActiveSubMenu = item.subMenu?.some((subItem) =>
                location.pathname.startsWith(`/admin/hcmiu/${item.link}/${subItem.link}`)
            );

            return (
                <ListItem key={index} disablePadding sx={{ display: 'block', marginBottom: 2.5 }}>
                    <ListItemButton
                        component={Link}
                        to={`/admin/hcmiu/${item.link}`}
                        onClick={handleDrawerClose}
                        sx={{
                            minHeight: 52,
                            justifyContent: isSidebarOpen ? 'initial' : 'center',
                            px: isSidebarOpen ? 2.5 : 0,
                            color: TEXT_COLOR,
                            '&:hover': { backgroundColor: HOVER_COLOR, borderRadius: '8px' },
                            backgroundColor: isActive || hasActiveSubMenu ? ACTIVE_COLOR : 'transparent',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'row',
                            transition: 'background-color 0.3s ease',
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 56,
                                mr: isSidebarOpen ? 1 : -1,
                                justifyContent: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                color: TEXT_COLOR,
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            sx={{
                                opacity: isSidebarOpen ? 1 : 0,
                                transition: 'opacity 0.3s ease',
                                whiteSpace: 'nowrap',
                                '& .MuiTypography-root': {
                                    fontSize: '0.95rem',
                                    fontWeight: 400,
                                },
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            );
        });

    return (
        <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={isSidebarOpen}
            onClose={toggleSidebar}
            ModalProps={{
                keepMounted: true,
            }}
            sx={{
                width: isSidebarOpen ? SIDEBAR_WIDTH : COLLAPSED_WIDTH,
                flexShrink: 0,
                position: 'fixed',
                top: '64px',
                left: 0,
                zIndex: 1000,
                '& .MuiDrawer-paper': {
                    width: isSidebarOpen ? SIDEBAR_WIDTH : COLLAPSED_WIDTH,
                    boxSizing: 'border-box',
                    backgroundColor: SIDEBAR_BG_COLOR,
                    color: TEXT_COLOR,
                    transition: 'width 0.3s',
                    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingTop: isMobile ? '180px' : '90px',
                    overflowX: 'hidden',
                },
            }}
        >
            <Box sx={{ flexGrow: 1 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2.5,
                        background: 'linear-gradient(90deg, #1a222b 0%, #2a343f 100%)',
                        borderRadius: isSidebarOpen ? '8px' : '0',
                        mx: isSidebarOpen ? 1 : 0,
                        mb: 2,
                        transition: 'all 0.3s ease',
                    }}
                >
                    {isSidebarOpen ? (
                        <>
                            <Avatar
                                src={user?.image}
                                alt={user?.username}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    mr: 2,
                                    bgcolor: 'primary.main',
                                }}
                            >
                                {user?.username?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: TEXT_COLOR }}>
                                    {t('sidebar.welcome')}, {user?.username}!
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#b0b7c0', fontSize: '0.85rem', mt: 0.5 }}>
                                    Role: {user?.role || 'Unknown'}
                                </Typography>
                            </Box>
                            <IconButton
                                onClick={toggleSidebar}
                                sx={{
                                    color: TEXT_COLOR,
                                    '&:hover': { backgroundColor: HOVER_COLOR },
                                    borderRadius: '50%',
                                }}
                            >
                                {isSidebarOpen ? <Close /> : <Menu />}
                            </IconButton>
                        </>
                    ) : (
                        <IconButton
                            onClick={toggleSidebar}
                            sx={{
                                color: TEXT_COLOR,
                                mx: 'auto',
                                '&:hover': { backgroundColor: HOVER_COLOR },
                                borderRadius: '50%',
                            }}
                        >
                            <Menu />
                        </IconButton>
                    )}
                </Box>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mx: 1 }} />

                <List sx={{ px: 1 }}>{renderMenuItems()}</List>
            </Box>

            <Box>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mx: 1 }} />
                <List sx={{ px: 1 }}>
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                minHeight: 48,
                                justifyContent: isSidebarOpen ? 'initial' : 'center',
                                px: isSidebarOpen ? 2.5 : 0,
                                color: TEXT_COLOR,
                                '&:hover': { backgroundColor: HOVER_COLOR, borderRadius: '8px' },
                                borderRadius: '8px',
                                transition: 'background-color 0.3s ease',
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 56,
                                    mr: isSidebarOpen ? 1 : -1,
                                    justifyContent: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: TEXT_COLOR,
                                }}
                            >
                                <ExitToApp />
                            </ListItemIcon>
                            <ListItemText
                                primary={t('sidebar.logout')}
                                sx={{
                                    opacity: isSidebarOpen ? 1 : 0,
                                    transition: 'opacity 0.3s ease',
                                    '& .MuiTypography-root': {
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                    },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
};

export default SidebarAdmin;