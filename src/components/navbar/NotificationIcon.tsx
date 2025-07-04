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
    const { user } = useSelector((state: RootState) => state.auth);
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
        if(user.role === 'STUDENT' || user.role === 'TEACHER'){
            navigate(`/profile/dashboard/notification`);
        } else {
            navigate(`/admin/hcmiu/notification`);
        }
        handleClose();
    };

    const handleViewAllNotifications = () => {
        if(user.role === 'STUDENT' || user.role === 'TEACHER'){
            navigate(`/profile/dashboard/notification`);
        } else {
            navigate(`/admin/hcmiu/notification`);
        }
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
                    "& .MuiPaper-root": {
                        padding: 0,
                        background: "linear-gradient(145deg, #ffffff, #f0f4f8)",
                        minWidth: { xs: "280px", sm: "400px" },
                        maxHeight: "500px",
                        borderRadius: "12px",
                        boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",
                        transform: { xs: "translateX(-10px)", sm: "translateX(-20px)" },
                    },
                    "& .MuiMenu-list": {
                        padding: "0px !important",
                        margin: "0px !important",
                    },
                    "& .MuiMenuItem-root": {
                        padding: "0px !important",
                        margin: "0px !important",
                        minHeight: "auto !important",
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
                {/* Header */}
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
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "primary.main"
                        }}
                    >
                        <NotificationsIcon />
                        Thông báo
                    </Typography>
                    {unreadCount > 0 && (
                        <Button
                            size="small"
                            startIcon={<MarkAsReadIcon />}
                            onClick={handleMarkAllAsRead}
                            sx={{
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                minWidth: "auto",
                                px: 1,
                            }}
                        >
                            Đánh dấu tất cả
                        </Button>
                    )}
                </Box>
                <Divider />

                {/* Notification List */}
                {displayedNotifications.length > 0 ? (
                    displayedNotifications.map((notif, index) => (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <MenuItem
                                onClick={handleViewDetail}
                                sx={{
                                    display: "block",
                                    width: "100%",
                                    padding: "0px !important",
                                    margin: "0px !important",
                                    minHeight: "auto !important",
                                    backgroundColor: "background.default",
                                    "&:hover": {
                                        backgroundColor: "grey.50",
                                        transform: "translateY(-1px)",
                                        transition: "all 0.2s ease-in-out",
                                    },
                                }}
                            >
                                <Box sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 1.5,
                                    width: "100%",
                                    py: 1.5,
                                    px: { xs: 1.5, sm: 2 },
                                }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: "primary.main",
                                            width: { xs: 32, sm: 36 },
                                            height: { xs: 32, sm: 36 },
                                            flexShrink: 0,
                                        }}
                                    >
                                        <NotificationsIcon fontSize="small" />
                                    </Avatar>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                            sx={{
                                                fontSize: { xs: "0.9rem", sm: "1rem" },
                                                mb: 0.5,
                                            }}
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
                                                mb: 0.5,
                                            }}
                                        >
                                            {notif.message}
                                        </Typography>
                                        <Box sx={{
                                            display: "flex",
                                            gap: 1,
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                        }}>
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
                                                sx={{
                                                    fontSize: { xs: "0.65rem", sm: "0.75rem" },
                                                    height: "20px",
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </MenuItem>
                            {index < displayedNotifications.length - 1 && (
                                <Divider sx={{
                                    bgcolor: "grey.200",
                                    margin: "0px !important",
                                    height: "1px",
                                }} />
                            )}
                        </motion.div>
                    ))
                ) : (
                    <MenuItem sx={{
                        justifyContent: "center",
                        py: 3,
                        margin: 0,
                        minHeight: "auto",
                    }}>
                        <Box sx={{ textAlign: "center" }}>
                            <NotificationsIcon sx={{ fontSize: 40, color: "grey.400", mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                Không có thông báo mới
                            </Typography>
                        </Box>
                    </MenuItem>
                )}

                {/* View All Button */}
                <Box sx={{
                    p: 1,
                    textAlign: "center",
                    bgcolor: "grey.50",
                    borderRadius: "0 0 12px 12px"
                }}>
                    <Button
                        size="small"
                        onClick={handleViewAllNotifications}
                        sx={{
                            fontWeight: "bold",
                            fontSize: { xs: "0.85rem", sm: "1rem" },
                            background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                            color: "primary.contrastText",
                            "&:hover": {
                                background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                            },
                            borderRadius: "8px",
                            px: 3,
                            py: 0.5,
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