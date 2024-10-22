import React, {useState} from 'react';
import {AppBar, Toolbar, IconButton, Typography, InputBase, Avatar} from '@mui/material';
import {Search as SearchIcon, AccountCircle} from '@mui/icons-material';
import Box from "@mui/material/Box";
import logo from "@images/logo.png";
import {Link, useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import {useSelector} from "react-redux";
import {RootState} from "../../state/store.ts";
import {blue} from "@mui/material/colors";


const navItems = [
    {text: 'About Us', path: '/about'},
    {text: 'Services', path: '/services'},
    {text: 'Featured', path: '/featured'},
    {text: 'Contact Me', path: '/contact'},
];

const Navbar: React.FC = () => {
    const [showSearch, setShowSearch] = useState(false);
    const {user} = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const handleAvatar=()=>{
        if (user?.role==="STUDENT"){
            navigate("timetable/by-week");
        }else {
            navigate("/admin/schedule")
        }
    }



    const handleSearchClick = () => {
        setShowSearch(!showSearch);
    };

    return (
        <AppBar position="static" className="bg-white shadow-none" color="secondary">
            <Toolbar className="flex justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <Button
                        onClick={() => navigate("/")}
                        sx={{padding: 0, minWidth: 'auto'}}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="Logo"
                            sx={{width: 60, height: 60}}
                        />
                    </Button>
                </div>

                <div className="hidden md:flex space-x-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.text}
                            to={item.path}
                            style={{textDecoration: 'none'}}
                        >
                            <Typography
                                variant="body1"
                                className="text-black hover:underline cursor-pointer"
                            >
                                {item.text} {/* Hiển thị văn bản */}
                            </Typography>
                        </Link>
                    ))}
                </div>

                {/* Right side: Search icon and Account icon */}
                <div className="flex items-center space-x-4">
                    {/* Search icon */}
                    <IconButton onClick={handleSearchClick} className="text-black">
                        <SearchIcon/>
                    </IconButton>

                    {showSearch && (
                        <div className="relative rounded-md bg-gray-100 p-1 px-2">
                            <InputBase
                                placeholder="Search…"
                                classes={{root: 'text-black'}}
                                inputProps={{'aria-label': 'search'}}
                            />
                        </div>
                    )}
                    {
                        user?.enabled ?
                            <IconButton onClick={handleAvatar}>
                                <Avatar
                                    sx={{bgcolor: "white", color: blue.A400}}>{user?.firstName[0].toUpperCase()}
                                </Avatar>
                            </IconButton>
                            :
                            <IconButton edge="end" aria-label="account" className="text-black"
                                        onClick={() => navigate("account/signin")}>
                                <AccountCircle sx={{fontSize: "2rem"}}/>
                            </IconButton>
                    }

                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
