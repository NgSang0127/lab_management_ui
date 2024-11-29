import React from 'react';
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
    Home,
    Dashboard,
    MeetingRoom,
    Notifications,
    Analytics,
    People,
    Settings,
    ExitToApp,
    Menu,
    Close,
} from '@mui/icons-material';
import { useLocation, Link } from 'react-router-dom'; // Import Link and useLocation

const Sidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({
                                                                               isOpen,
                                                                               toggleSidebar,
                                                                           }) => {
    const location = useLocation(); // Get the current route path

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, link: '/' },
        { text: 'Manage Labs', icon: <MeetingRoom />, link: '/manage-labs' },
        { text: 'Bookings', icon: <Home />, link: '/bookings' },
        { text: 'Notifications', icon: <Notifications />, link: '/notifications' },
        { text: 'Analytics', icon: <Analytics />, link: '/analytics' },
        { text: 'User Management', icon: <People />, link: '/users' },
        { text: 'Settings', icon: <Settings />, link: '/settings' },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: isOpen ? 250 : 80,
                flexShrink: 0,
                position: 'fixed',
                top: '64px',
                left: 0,
                zIndex: 1000,
                '& .MuiDrawer-paper': {
                    width: isOpen ? 250 : 80,
                    boxSizing: 'border-box',
                    backgroundColor: '#12171d',
                    color: '#f1f6f9',
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
                    {isOpen && <Typography variant="h6">Lab Management</Typography>}
                    <IconButton onClick={toggleSidebar} sx={{ color: 'white' }}>
                        {isOpen ? <Close /> : <Menu />}
                    </IconButton>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                <List>
                    {menuItems.map((item, index) => (
                        <ListItem key={index} disablePadding sx={{ display: 'block',marginBottom: 2 }}>
                            <ListItemButton
                                component={Link} // Use Link to navigate
                                to={item.link}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: isOpen ? 'initial' : 'center',
                                    px: 2.5,
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#35dae3', // Hover effect
                                        borderRadius: '8px'
                                    },
                                    backgroundColor:
                                        location.pathname === item.link ? '#444' : 'transparent', // Active link color
                                    borderColor:
                                        location.pathname === item.link ? '#ffffff' : 'transparent', // Border color for active item
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
                    ))}
                </List>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                <List>
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: isOpen ? 'initial' : 'center',
                                px: 2.5,
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
                                <ExitToApp />
                            </ListItemIcon>
                            <ListItemText primary="Logout" sx={{ opacity: isOpen ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
};

export default Sidebar;
