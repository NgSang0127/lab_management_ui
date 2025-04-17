import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    Badge,
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Divider,
    Chip,
    Avatar,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MarkAsReadIcon from "@mui/icons-material/DoneAll";
import { RootState, useAppDispatch } from "../../state/store.ts";
import { fetchUnreadNotifications, markAsRead } from "../../state/notification/thunk.ts";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { motion } from "framer-motion";
import { markNotificationAsRead } from "../../state/notification/notificationSlice.ts";

const NotificationIcon: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const unreadNotifications = useSelector((state: RootState) => state.notify.unReadNotifications || []);
    const unreadCount = unreadNotifications.length;

    const displayedNotifications = unreadNotifications.slice(0, 5);

    useEffect(() => {
        dispatch(fetchUnreadNotifications());
    }, [dispatch]);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAllAsRead = async () => {
        for (const notif of displayedNotifications) {
            try {
                await dispatch(markAsRead(notif.id)).unwrap();
                dispatch(markNotificationAsRead(notif.id));
            } catch (error) {
                console.error("error marking notification as read:", error);
            }
        }
    };

    const handleViewDetail = () => {
        navigate(`/admin/hcmiu/notification`);
        handleClose();
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
                        padding: 0,
                        background: "linear-gradient(145deg, #ffffff, #f0f4f8)",
                        minWidth: { xs: "280px", sm: "400px" },
                        maxHeight: "500px",
                        borderRadius: "12px",
                        boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",
                        transform: { xs: "translateX(-10px)", sm: "translateX(-20px)" },
                    },
                    ".MuiMenu-list": {
                        padding: "0px",
                    },
                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: { overflow: "visible" },
                    },
                }}
            >
                {/* Tiêu đề */}
                <Box
                    sx={{
                        padding: { xs: 1.5, sm: 2 },
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        bgcolor: "grey.50",
                        borderRadius: "12px 12px 0 0",
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ display: "flex", alignItems: "center", gap: 1, color: "primary.main" }}
                    >
                        <NotificationsIcon />
                        Thông báo
                    </Typography>
                    {unreadCount > 0 && (
                        <Button
                            size="small"
                            startIcon={<MarkAsReadIcon />}
                            onClick={handleMarkAllAsRead}
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                            Đánh dấu tất cả
                        </Button>
                    )}
                </Box>
                <Divider />

                {/* Danh sách thông báo chưa đọc (tối đa 5) */}
                {displayedNotifications.length > 0 ? (
                    displayedNotifications.map((notif, index) => (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <MenuItem
                                onClick={() => handleViewDetail}
                                sx={{
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    backgroundColor: "background.default",
                                    "&:hover": {
                                        backgroundColor: "grey.50",
                                        transform: "translateY(-1px)",
                                        transition: "all 0.2s ease-in-out",
                                    },
                                    py: 1.5,
                                    px: { xs: 1.5, sm: 2 },
                                    borderRadius: "0px",
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: "primary.main",
                                            width: { xs: 32, sm: 36 },
                                            height: { xs: 32, sm: 36 },
                                        }}
                                    >
                                        <NotificationsIcon fontSize="small" />
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                                        >
                                            {notif.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                            }}
                                        >
                                            {notif.message}
                                        </Typography>
                                        <Box sx={{ display: "flex", gap: 1, mt: 0.5, alignItems: "center" }}>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                                            >
                                                {format(new Date(notif.createdDate), "dd/MM/yyyy HH:mm:ss", {
                                                    locale: vi,
                                                })}
                                            </Typography>
                                            <Chip
                                                label="Chưa đọc"
                                                size="small"
                                                color="primary"
                                                sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </MenuItem>
                            <Divider sx={{ bgcolor: "grey.200" }} />
                        </motion.div>
                    ))
                ) : (
                    <MenuItem sx={{ justifyContent: "center", py: 2 }}>
                        <Box sx={{ textAlign: "center" }}>
                            <NotificationsIcon sx={{ fontSize: 40, color: "grey.400", mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                Không có thông báo mới
                            </Typography>
                        </Box>
                    </MenuItem>
                )}

                {/* Nút Xem tất cả */}
                <Box sx={{ p: 1, textAlign: "center", bgcolor: "grey.50", borderRadius: "0 0 12px 12px" }}>
                    <Button
                        size="small"
                        onClick={() => {
                            navigate(`/admin/hcmiu/notification`);
                            handleClose();
                        }}
                        sx={{
                            fontWeight: "bold",
                            fontSize: { xs: "0.85rem", sm: "1rem" },
                            background: theme => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                            color: "primary.contrastText",
                            "&:hover": {
                                background: theme => `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                            },
                            borderRadius: "8px",
                            px: 3,
                        }}
                    >
                        Xem tất cả
                    </Button>
                </Box>
            </Menu>
        </>
    );
};

export default NotificationIcon;