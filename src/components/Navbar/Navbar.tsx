import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, InputBase, Avatar, Box, Button } from '@mui/material';
import { Search as SearchIcon, AccountCircle } from '@mui/icons-material';
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../state/store.ts";
import { blue } from "@mui/material/colors";
import { logout } from "../../state/Authentication/Reducer.ts";
import logo from "@images/logo.png";

const navItems = [
    { text: 'About Us', path: '/about' },
    { text: 'Services', path: '/services' },
    { text: 'Featured', path: '/featured' },
    { text: 'Contact Me', path: '/contact' },
];

const Navbar: React.FC = () => {
    const [showSearch, setShowSearch] = useState(false);
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleAvatar = () => {
        navigate(user?.role === "TEACHER" ? "/admin/hcmiu" : "/admin/profile");
    };


    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'accessToken' && event.newValue === null) {
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
                zIndex: 1200,
                backgroundColor: '#0093E9',
                backgroundImage: 'linear-gradient(294deg, #0093E9 0%, #80D0C7 100%)',
                boxShadow: 'none',
            }}
        >
            <Toolbar className="flex justify-between items-center">
                <Button
                    onClick={() => navigate("/")}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 0,
                        '&:hover': {
                            backgroundColor: 'transparent', // Giữ màu nền trong suốt khi hover
                        },
                        cursor: 'pointer' // Đảm bảo con trỏ chuột hiển thị là pointer
                    }}
                    disableRipple // Tắt hiệu ứng ripple
                >
                    <Box component="img" src={logo} alt="Logo" sx={{ width: 60, height: 60 }} />
                    <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 'bold', marginLeft: 1 }}>
                        LAB MANAGEMENT IT
                    </Typography>
                </Button>

                <div className="hidden md:flex space-x-4">
                    {navItems.map((item) => (
                        <Link key={item.text} to={item.path} style={{ textDecoration: 'none' }}>
                            <Typography variant="body1" color="textPrimary" className="hover:underline">
                                {item.text}
                            </Typography>
                        </Link>
                    ))}
                </div>

                <div className="flex items-center space-x-4">
                    <IconButton onClick={() => setShowSearch(!showSearch)} color="primary">
                        <SearchIcon />
                    </IconButton>
                    {showSearch && (
                        <div className="relative bg-gray-100 p-1 rounded-md px-2">
                            <InputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
                        </div>
                    )}
                    {user?.enabled ? (
                        <div className="flex items-center">
                            <IconButton onClick={handleAvatar} sx={{
                                border: 'none',
                                outline: 'none',
                                boxShadow: 'none',
                            }}>
                                <Avatar sx={{ bgcolor: "white", color: blue.A400 }} src={user?.image || undefined}>
                                    {!user?.image && user?.firstName ? user?.firstName[0].toUpperCase() : null}
                                </Avatar>
                            </IconButton>

                        </div>
                    ) : (
                        <IconButton edge="end" onClick={() => navigate("/account/signin")} color="primary">
                            <AccountCircle sx={{ fontSize: "2rem" }} />
                        </IconButton>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
