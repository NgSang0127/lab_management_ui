import React, { useEffect, useState } from "react";
import { Button, TextField, Typography, Card, CardContent, CircularProgress, Snackbar, Alert } from "@mui/material";
import { createAndSendNotification } from "../../api/notification/notification.ts";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import UserNotificationCenter from "./UserNotificationCenter.tsx";

const AdminNotificationCenter: React.FC = () => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        console.log("🔗 Admin đang kết nối WebSocket...");

        const socket = new SockJS("http://localhost:8080/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("✅ Admin WebSocket đã kết nối!");

                client.subscribe("/topic/admin-notifications", (messageOutput) => {
                    console.log("📩 Admin nhận thông báo:", messageOutput.body);
                });

                console.log("📡 Admin đã subscribe vào /topic/admin-notifications");
            },
            onDisconnect: () => {
                console.log("❌ Admin WebSocket bị ngắt kết nối!");
            },
        });

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
        };
    }, []);

    const sendNotification = async () => {
        if (!title || !message) {
            setSnackbar({ open: true, message: "Vui lòng nhập tiêu đề và nội dung!", severity: "error" });
            return;
        }

        setLoading(true);
        try {
            await createAndSendNotification({ title, message });
            setTitle("");
            setMessage("");
            setSnackbar({ open: true, message: "Thông báo đã được gửi!", severity: "success" });
        } catch (error) {
            console.error("Lỗi khi gửi thông báo:", error);
            setSnackbar({ open: true, message: "Gửi thông báo thất bại!", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

        <Card sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 2, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
                    Gửi Thông Báo
                </Typography>
                <TextField
                    label="Tiêu đề"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Nội dung thông báo"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    margin="dense"
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={sendNotification}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Gửi Thông Báo"}
                </Button>
            </CardContent>

            {/* Snackbar hiển thị thông báo */}
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Card>
            <UserNotificationCenter/>
        </div>
    );
};

export default AdminNotificationCenter;
