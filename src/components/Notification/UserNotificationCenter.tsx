import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
    Badge,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Tooltip,
    CircularProgress,
    Box,
    Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MarkAsReadIcon from "@mui/icons-material/DoneAll";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../state/store.ts";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { fetchNotifications, fetchUnreadNotifications, markAsRead } from "../../state/Notification/Reducer.ts";
import { NotificationResponse } from "../../api/notification/notification.ts";
import { motion } from "framer-motion";
import {markNotificationAsRead} from "../../state/Notification/Action.ts";

const ITEMS_PER_PAGE = 10;

const UserNotificationCenter: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { notifications, unReadNotifications, isLoading, page, last } = useSelector(
        (state: RootState) => state.notify
    );
    const [selectedNotification, setSelectedNotification] = useState<NotificationResponse | null>(null);
    const token = localStorage.getItem("accessToken");
    const listRef = useRef<HTMLUListElement>(null);

    // WebSocket Setup
    useEffect(() => {
        if (!user?.id) return;
        const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe(`/user/${user?.id}/notification`, (messageOutput) => {
                    try {
                        const notification: NotificationResponse = JSON.parse(messageOutput.body);
                        dispatch(fetchUnreadNotifications());
                        // Reset về trang đầu tiên khi có thông báo mới
                        dispatch(fetchNotifications({ page: 0, size: ITEMS_PER_PAGE }));
                    } catch (error) {
                        console.error("Error parsing JSON:", error);
                    }
                });
            },
        });
        client.activate();
        return () => {
            client.deactivate();
        };
    }, [user, dispatch]);

    // Fetch notifications on mount
    useEffect(() => {
        dispatch(fetchNotifications({ page: 0, size: ITEMS_PER_PAGE }));
        dispatch(fetchUnreadNotifications());
    }, [dispatch]);

    // Infinite scroll logic
    useEffect(() => {
        const handleScroll = () => {
            if (listRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = listRef.current;
                if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading && !last) {
                    // Tải trang tiếp theo khi cuộn đến cuối
                    dispatch(fetchNotifications({ page: page + 1, size: ITEMS_PER_PAGE }));
                }
            }
        };

        const listElement = listRef.current;
        if (listElement) {
            listElement.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (listElement) {
                listElement.removeEventListener("scroll", handleScroll);
            }
        };
    }, [dispatch, isLoading, last, page]);

    // Mark notification as read (gọi cả client và server)
    const handleMarkAsRead = async (id: number, status: string) => {
        if (status === "READ") return;

        try {
            // Gọi API server để đánh dấu đã đọc
            await dispatch(markAsRead(id)).unwrap();

            // Cập nhật state client-side
            dispatch(markNotificationAsRead(id));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    // Open notification details and mark as read if unread
    const handleOpenDetail = (notification: NotificationResponse) => {
        setSelectedNotification(notification);
        // Tự động đánh dấu đã đọc khi nhấn vào thông báo nếu trạng thái là UNREAD
        if (notification.status === "UNREAD") {
            handleMarkAsRead(notification.id, notification.status);
        }
    };

    return (
        <Card
            sx={{
                maxWidth: 1000,
                mx: "auto",
                mt: 4,
                p: 3,
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
                background: "linear-gradient(135deg, #f5f7fa, #e4e7eb)",
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
                    Trung Tâm Thông Báo
                </Typography>
                <Tooltip title="Thông báo chưa đọc">
                    <Badge badgeContent={unReadNotifications?.length || 0} color="error">
                        <NotificationsIcon sx={{ fontSize: 30, color: "primary.main" }} />
                    </Badge>
                </Tooltip>
            </Box>

            <CardContent>
                <List
                    ref={listRef}
                    sx={{ overflow: "auto", bgcolor: "#fff", borderRadius: 2 }}
                >
                    {notifications?.length === 0 ? (
                        <Typography variant="body2" sx={{ textAlign: "center", py: 2, color: "text.secondary" }}>
                            Không có thông báo nào.
                        </Typography>
                    ) : (
                        (notifications ?? []).map((notif, index) => (
                            <motion.div
                                key={notif.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ListItem
                                    sx={{
                                        borderRadius: 2,
                                        my: 1,
                                        bgcolor: notif.status === "UNREAD" ? "blue.50" : "grey.100",
                                        "&:hover": {
                                            bgcolor: notif.status === "UNREAD" ? "blue.100" : "grey.200",
                                            transform: "translateY(-2px)",
                                            transition: "all 0.2s ease-in-out",
                                        },
                                        cursor: "pointer",
                                    }}
                                    onClick={() => handleOpenDetail(notif)}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: notif.status === "UNREAD" ? "primary.main" : "grey.400" }}>
                                            <NotificationsIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ fontWeight: "medium", color: "text.primary" }}
                                            >
                                                {notif.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "text.secondary",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 1,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {notif.message}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                                    {format(new Date(notif.createdDate), "dd/MM/yyyy HH:mm:ss", {
                                                        locale: vi,
                                                    })}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                    {notif.status === "UNREAD" && (
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsRead(notif.id, notif.status);
                                            }}
                                        >
                                            <MarkAsReadIcon color="primary" />
                                        </IconButton>
                                    )}
                                </ListItem>
                                <Divider sx={{ bgcolor: "grey.200" }} />
                            </motion.div>
                        ))
                    )}
                    {isLoading && (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    )}
                </List>
            </CardContent>

            <Dialog
                open={Boolean(selectedNotification)}
                onClose={() => setSelectedNotification(null)}
                fullWidth
                maxWidth="sm"
                sx={{ "& .MuiDialog-paper": { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <NotificationsIcon color="primary" />
                    <Typography variant="h6">{selectedNotification?.title}</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {selectedNotification?.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {selectedNotification &&
                            format(new Date(selectedNotification.createdDate), "dd/MM/yyyy HH:mm:ss", { locale: vi })}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setSelectedNotification(null)}
                        color="primary"
                        sx={{ borderRadius: 2 }}
                    >
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default UserNotificationCenter;