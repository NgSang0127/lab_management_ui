import React from "react";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Drawer, useMediaQuery, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../state/store.ts";
import { logout } from "../../state/auth/thunk.ts";

// Define types for menu items
interface MenuItem {
    title: string;
    icon: JSX.Element;
}

// Define props for ProfileNavigation
interface ProfileNavigationProps {
    open: boolean;
    handleClose: () => void;
}

const menu: MenuItem[] = [
    {
        title: "Notification",
        icon: <NotificationsIcon />
    },
    {
        title: "Settings",
        icon: <SettingsIcon />
    },
    {
        title: "Logout",
        icon: <LogoutIcon />
    }
];

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({ open, handleClose }) => {
    const isSmallScreen = useMediaQuery("(max-width:900px)");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleNavigate = (item: MenuItem) => {
        if (item.title === "Logout") {
            dispatch(logout());
            navigate("/");
        } else {
            navigate(`my-profile/${item.title.toLowerCase()}`);
        }
    };

    return (
        <div>
            <Drawer
                variant={isSmallScreen ? "temporary" : "permanent"}
                open={isSmallScreen ? open : true}
                onClose={handleClose}
                anchor="left"
                sx={{
                    zIndex: 1,
                    position: "relative",
                    bgcolor: "black", // Set the background color here
                    boxShadow: 3 // Optional: Add a shadow for better visibility
                }}
            >
                <div className="w-[50vw] lg:w-[20vw] h-[100vh] flex flex-col justify-center text-xl gap-9 pt-16">
                    {menu.map((item, index) => (
                        <div key={item.title}>
                            <div
                                onClick={() => handleNavigate(item)}
                                className="px-5 flex item-center space-x-5 cursor-pointer"
                            >
                                {item.icon}
                                <span>{item.title}</span>
                            </div>
                            {index !== menu.length - 1 && <Divider />}
                        </div>
                    ))}
                </div>
            </Drawer>
        </div>
    );
};


export default ProfileNavigation;
