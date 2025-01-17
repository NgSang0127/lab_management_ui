import {FC, useContext} from 'react';
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
    Typography, useTheme, useMediaQuery,
} from '@mui/material';
import {
    ManageSearch,
    Dashboard,
    Notifications,
    Settings,
    ExitToApp,
    Menu,
    Close,
    DateRange
} from '@mui/icons-material';
import {useLocation, Link, useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from "../../state/store.ts";
import {logout} from "../../state/Authentication/Reducer.ts";
import {endSession} from "../../state/User/Reducer.ts";
import {snipeItPath} from "../../route/SnipeItRoute.tsx";
import {SidebarContext} from "../../context/SidebarContext.tsx";
const SIDEBAR_WIDTH = 250;
const COLLAPSED_WIDTH = 80;
const HOVER_COLOR = '#35dae3';
const ACTIVE_COLOR = '#73f8e7';
const SIDEBAR_BG_COLOR = '#12171d';
const TEXT_COLOR = '#f1f6f9';
const Sidebar: FC= ( ) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {user} = useSelector((state: RootState) => state.auth);
    const location = useLocation();
    const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const menuItems = [
        {text: 'Dashboard', icon: <Dashboard/>, link: ''},
        {text: 'View Timetable', icon: <DateRange/>, link: 'by-week'},
        {text: 'Bookings', icon: <ManageSearch/>, link: 'book'},
        {text: 'Notifications', icon: <Notifications/>, link: 'notification'},
        {text: 'Settings', icon: <Settings/>, link: 'setting'},
    ];
    const handleLogout = () => {
        dispatch(endSession());
        dispatch(logout() as never);
        navigate("/account/signin");
        if (isMobile) toggleSidebar();
    };
    const handleDrawerClose = () => {
        if (isMobile) {
            toggleSidebar();
        }
    };
    const renderMenuItems = () =>
        menuItems.map((item, index) => {
            const isActive =
                (location.pathname === '/profile/dashboard' && item.link === '') ||
                location.pathname === `/profile/dashboard/${item.link}`;
            return (
                <ListItem key={index} disablePadding sx={{display: 'block', marginBottom: 2}}>
                    <ListItemButton
                        component={Link}
                        to={item.link}
                        onClick={handleDrawerClose}
                        sx={{
                            minHeight: 48,
                            justifyContent: isSidebarOpen ? 'initial' : 'center',
                            px: isSidebarOpen ? 2.5 : 0,
                            color: TEXT_COLOR,
                            '&:hover': {backgroundColor: HOVER_COLOR, borderRadius: '8px'},
                            backgroundColor: isActive ? ACTIVE_COLOR : 'transparent',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'row',
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
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            );
        });
    return (
        <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={isMobile ? isSidebarOpen : true}
            onClose={toggleSidebar}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
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
                    paddingTop: '20px',
                    overflowX: 'hidden',
                },
            }}
        >
            <div className="pt-12">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2.5,
                        height: '64px',
                    }}
                >
                    {isSidebarOpen && <Typography variant="h6">Hi ! {user?.username}</Typography>}
                    <IconButton onClick={toggleSidebar}
                                sx={{color: 'white', border: 'none', outline: 'none', boxShadow: 'none'}}>
                        {isSidebarOpen ? <Close/> : <Menu/>}
                    </IconButton>
                </Box>
                <Divider sx={{borderColor: 'rgba(255, 255, 255, 0.1)'}}/>
                <List>{renderMenuItems()}</List>
                <Divider sx={{borderColor: 'rgba(255, 255, 255, 0.1)'}}/>
                <List>
                    <ListItem disablePadding sx={{display: 'block'}}>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                minHeight: 48,
                                justifyContent: isSidebarOpen ? 'initial' : 'center',
                                px: isSidebarOpen ? 2.5 : 0, // Điều chỉnh padding dựa trên isSidebarOpen
                                '&:hover': {backgroundColor: HOVER_COLOR, borderRadius: '8px'},
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'row', // Đảm bảo các phần tử con nằm theo hàng ngang
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
                                <ExitToApp/>
                            </ListItemIcon>
                            <ListItemText primary="Logout" sx={{opacity: isSidebarOpen ? 1 : 0}}/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
};
export default Sidebar;