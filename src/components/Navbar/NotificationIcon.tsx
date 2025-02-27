import React, { useEffect, useState } from "react";
import {useSelector } from "react-redux";

import {Badge, Box, Button, IconButton, Menu, MenuItem, Typography} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {RootState, useAppDispatch} from "../../state/store.ts";
import {fetchNotifications, fetchUnreadNotifications} from "../../state/Notification/Reducer.ts";
import Divider from "@mui/material/Divider";
import {useNavigate} from "react-router-dom";

const NotificationIcon = () => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate=useNavigate();

    const unreadCount = useSelector((state: RootState) => state.notify.unReadNotifications?.length || 0);
    const notifications = useSelector((state: RootState) => state.notify.notifications || []);

    useEffect(() => {
        dispatch(fetchUnreadNotifications());
        dispatch(fetchNotifications({ page: 0, size: 5 }));
    }, [dispatch]);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton color="inherit" onClick={handleOpen}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                    ".MuiPaper-root": {
                        padding:0,
                        backgroundColor: "#ffffff", // Màu nền menu
                        minWidth: "400px", // Kích thước menu
                        maxHeight: "500px", // Giới hạn chiều cao
                        borderRadius: "10px", // Bo góc menu
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Hiệu ứng đổ bóng
                        transform: "translateX(-20px)"
                    },
                    ".MuiMenu-list": {
                        padding: "0px",  // Reset padding của danh sách trong menu
                    }
                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}



            >
                {/* Tiêu đề */}
                <Box sx={{ padding: 2 ,textAlign: "center"}}>
                    <Typography variant="h6" fontWeight="bold">
                        Thông báo
                    </Typography>
                </Box>
                <Divider />

                {/* Danh sách thông báo */}
                {notifications.length > 0 ? (
                    notifications.map((notif, index) => (
                        <MenuItem key={index} sx={{
                            flexDirection: "column", alignItems: "flex-start",
                            backgroundColor: "#f5f6fa",
                            "&:hover": { backgroundColor: "#ecf4fe" },
                            borderRadius:'0px'
                        }}>
                            <div className="pl-5">
                            <Typography variant="subtitle1" fontWeight="bold">
                                {notif.title}
                            </Typography>
                            {/* Nội dung thông báo */}
                            <Typography variant="body2" color="text.secondary">
                                {notif.message}
                            </Typography>

                            </div>
                            {/* Tiêu đề thông báo */}
                            {/* Nút xem chi tiết */}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem>
                        <Typography>Không có thông báo</Typography>
                    </MenuItem>
                )}
                <Button
                    size="small"
                    sx={{
                        fontWeight: "bold",  // In đậm
                        fontSize: "1rem" // Chữ to hơn
                    }}
                    onClick={() => {
                        navigate(`admin/hcmiu/notification`);
                        handleClose();

                    }}
                >
                    Xem chi tiết
                </Button>
            </Menu>
        </>
    );
};

export default NotificationIcon;
