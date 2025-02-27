import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
    Badge,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Tooltip,
    CircularProgress
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MarkAsReadIcon from "@mui/icons-material/DoneAll";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../state/store.ts";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { fetchNotifications, fetchUnreadNotifications } from "../../state/Notification/Reducer.ts";
import {NotificationResponse} from "../../api/notification/notification.ts";
import {markNotificationAsRead} from "../../state/Notification/Action.ts";

const UserNotificationCenter: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { notifications, unReadNotifications, isLoading, page, last } = useSelector((state: RootState) => state.notify);
    const [selectedNotification, setSelectedNotification] = useState<NotificationResponse | null>(null);
    const token = localStorage.getItem("accessToken");

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
                        dispatch(fetchUnreadNotifications()); // Cập nhật số lượng chưa đọc
                    } catch (error) {
                        console.error("❌ Error parsing JSON:", error);
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
        dispatch(fetchNotifications(page));
        dispatch(fetchUnreadNotifications());
    }, [dispatch]);

    // Mark notification as read
    const handleMarkAsRead = (id: number, status: string) => {
        if (status === "READ") return;
        dispatch(markNotificationAsRead(id));
    };

    // Open notification details
    const handleOpenDetail = (notification: NotificationResponse) => {
        setSelectedNotification(notification);
        if (notification.status === "UNREAD") {
            handleMarkAsRead(notification.id, notification.status);
        }
    };

    return (
        <Card className="max-w-6xl mx-auto mt-5 p-4 rounded-xl shadow-lg bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
                <Typography variant="h5" sx={{ textAlign: "center", flexGrow: 1 }} className="font-bold text-gray-900 dark:text-white">
                    🔔 Notification Center
                </Typography>
                <Tooltip title="Unread Notifications">
                    <Badge badgeContent={unReadNotifications.length} color="error">
                        <NotificationsIcon fontSize="large" className="text-gray-700 dark:text-gray-300" />
                    </Badge>
                </Tooltip>
            </div>


            <CardContent className="mt-3">
                <List className="max-h-custom overflow-auto">
                    {notifications?.length === 0 ? (
                        <Typography variant="body2" className="text-center text-gray-500">
                            No notifications available.
                        </Typography>
                    ) : (
                        notifications.map((notif) => (
                            <ListItem
                                key={notif.id}
                                className={`rounded-lg transition-all cursor-pointer p-3 my-2 ${
                                    notif.status === "UNREAD" ? "bg-blue-200" : "bg-gray-100 dark:bg-gray-700"
                                }`}
                                onClick={() => handleOpenDetail(notif)}
                            >
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle1" className="font-semibold text-gray-900 dark:text-white">
                                            {notif.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <>
                                            <Typography variant="body2" className="truncate text-gray-700 dark:text-gray-300">
                                                {notif.message}
                                            </Typography>
                                            <Typography variant="caption" className="text-gray-500">
                                                {format(new Date(notif.createdDate), "dd/MM/yyyy HH:mm:ss", { locale: vi })}
                                            </Typography>
                                        </>
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
                        ))
                    )}
                </List>

                {!last && (
                    <Button
                        onClick={() => dispatch(fetchNotifications(page + 1))}
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : "Xem thêm"}
                    </Button>
                )}
            </CardContent>

            <Dialog open={Boolean(selectedNotification)} onClose={() => setSelectedNotification(null)} fullWidth>
                <DialogTitle>{selectedNotification?.title}</DialogTitle>
                <DialogContent>
                    <Typography>{selectedNotification?.message}</Typography>
                    <Typography variant="caption" color="textSecondary">
                        {selectedNotification &&
                            format(new Date(selectedNotification.createdDate), "dd/MM/yyyy HH:mm:ss", { locale: vi })}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedNotification(null)} color="primary">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default UserNotificationCenter;
