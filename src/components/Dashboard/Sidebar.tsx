import  {FC} from 'react';
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
} from '@mui/material';
import {
    ManageSearch,
    Dashboard,
    AccountBalance,
    Notifications,
    QueryStats,
    People,
    Settings,
    ExitToApp,
    Menu,
    Close,
} from '@mui/icons-material';
import {useLocation, Link, useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from "../../state/store.ts";
import {logout} from "../../state/Authentication/Reducer.ts";
import {endSession} from "../../state/User/Reducer.ts";
import {snipeItPath} from "../../route/SnipeItRoute.tsx";

const SIDEBAR_WIDTH = 250;
const COLLAPSED_WIDTH = 80;
const HOVER_COLOR = '#35dae3';
const ACTIVE_COLOR = '#73f8e7';
const SIDEBAR_BG_COLOR = '#12171d';
const TEXT_COLOR = '#f1f6f9';

const Sidebar: FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({isOpen, toggleSidebar}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {user} = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    const menuItems = [
        {text: 'Dashboard', icon: <Dashboard/>, link: ''},
        {text: 'Manage Assets', icon: <AccountBalance/>, link: snipeItPath},
        {text: 'Bookings', icon: <ManageSearch/>, link: 'book'},
        {text: 'Notifications', icon: <Notifications/>, link: '/notifications'},
        {text: 'Analytics', icon: <QueryStats/>, link: '/analytics'},
        {text: 'User Management', icon: <People/>, link: 'user-management'},
        {text: 'Settings', icon: <Settings/>, link: 'setting'},
    ];

    const handleLogout = () => {
        dispatch(logout() as never);
        dispatch(endSession() as never);
        navigate("/account/signin");
    };

    const renderMenuItems = () =>
        menuItems.map((item, index) => {
            const isActive =
                (location.pathname === '/admin/hcmiu' && item.link === '') ||
                location.pathname === `/admin/hcmiu/${item.link}`;
            return (
                <ListItem key={index} disablePadding sx={{display: 'block', marginBottom: 2}}>
                    <ListItemButton
                        component={Link}
                        to={item.link}
                        sx={{
                            minHeight: 48,
                            justifyContent: isOpen ? 'initial' : 'center',
                            px: 2.5,
                            color: TEXT_COLOR,
                            '&:hover': {backgroundColor: HOVER_COLOR, borderRadius: '8px'},
                            backgroundColor: isActive ? ACTIVE_COLOR : 'transparent',
                            borderRadius: '8px',
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 56,
                                mr: isOpen ? 1 : 0,
                                justifyContent: 'center',
                                color: TEXT_COLOR,
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            sx={{
                                opacity: isOpen ? 1 : 0,
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
            variant="permanent"
            sx={{
                width: isOpen ? SIDEBAR_WIDTH : COLLAPSED_WIDTH,
                flexShrink: 0,
                position: 'fixed',
                top: '64px',
                left: 0,
                zIndex: 1000,
                '& .MuiDrawer-paper': {
                    width: isOpen ? SIDEBAR_WIDTH : COLLAPSED_WIDTH,
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
            <div className="pt-20">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2.5,
                        height: '64px',
                    }}
                >
                    {isOpen && <Typography variant="h6">Hi ! {user?.username}</Typography>}
                    <IconButton onClick={toggleSidebar}
                                sx={{color: 'white', border: 'none', outline: 'none', boxShadow: 'none'}}>
                        {isOpen ? <Close/> : <Menu/>}
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
                                justifyContent: isOpen ? 'initial' : 'center',
                                px: 2.5,
                                '&:hover': {backgroundColor: HOVER_COLOR, borderRadius: '8px'},
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 56,
                                    mr: isOpen ? 1 : 0,
                                    justifyContent: 'center',
                                    color: 'white',
                                }}
                            >
                                <ExitToApp/>
                            </ListItemIcon>
                            <ListItemText primary="Logout" sx={{opacity: isOpen ? 1 : 0}}/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
};

export default Sidebar;