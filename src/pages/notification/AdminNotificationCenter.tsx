import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Divider,
    Grid,
    styled,
    IconButton,
    Fade,
} from "@mui/material";
import { createAndSendNotification } from "../../services/notification/notification.ts";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import UserNotificationCenter from "../../components/Notification/UserNotificationCenter.tsx";
import { Send as SendIcon, Info as InfoIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Helmet } from "react-helmet-async";

const CustomAlertStyled = styled(Box)(({ theme }) => ({
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 1500,
    minWidth: "300px",
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
    background: `linear-gradient(135deg, ${theme.palette.success.light}, ${theme.palette.success.main})`,
    color: theme.palette.success.contrastText,
    boxShadow: theme.shadows[3],
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    '&.error': {
        background: `linear-gradient(135deg, ${theme.palette.error.light}, ${theme.palette.error.main})`, // Giữ nguyên
    },
}));

const AdminNotificationCenter: React.FC = () => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
        timestamp: Date | null;
    }>({ open: false, message: "", severity: "success", timestamp: null });

    useEffect(() => {
        console.log("🔗 admin đang kết nối WebSocket...");
        const socket = new SockJS("http://localhost:8080/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("✅ admin WebSocket đã kết nối!");
                client.subscribe("/topic/admin-notifications", (messageOutput) => {
                    console.log("📩 admin nhận thông báo:", messageOutput.body);
                });
                console.log("📡 admin đã subscribe vào /topic/admin-notifications");
            },
            onDisconnect: () => {
                console.log("❌ admin WebSocket bị ngắt kết nối!");
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
            setAlert({
                open: true,
                message: "Vui lòng nhập tiêu đề và nội dung!",
                severity: "error",
                timestamp: new Date(),
            });
            return;
        }

        setLoading(true);
        try {
            await createAndSendNotification({ title, message });
            setTitle("");
            setMessage("");
            setAlert({
                open: true,
                message: "Thông báo đã được gửi!",
                severity: "success",
                timestamp: new Date(),
            });
        } catch (error) {
            console.error("Lỗi khi gửi thông báo:", error);
            setAlert({
                open: true,
                message: "Gửi thông báo thất bại!",
                severity: "error",
                timestamp: new Date(),
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    return (
        <Box sx={{ py: 4, px: { xs: 2, sm: 4 } }}>
            <Helmet>
                <title>Notifications | Lab Management IT</title>
            </Helmet>
            {/* Custom Alert với thời gian */}
            <Fade in={alert.open} timeout={500}>
                <CustomAlertStyled className={alert.severity === "error" ? "error" : ""}>
                    <InfoIcon />
                    <Box>
                        <Typography variant="body1">{alert.message}</Typography>
                        <Typography variant="caption">
                            {alert.timestamp &&
                                format(new Date(alert.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: vi })}
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={handleCloseAlert}
                        sx={{ ml: "auto", color: "inherit" }}
                    >
                        <Typography variant="caption">Đóng</Typography>
                    </IconButton>
                </CustomAlertStyled>
            </Fade>

            {/* Form gửi thông báo */}
            <Card
                sx={{
                    maxWidth: 800,
                    mx: "auto",
                    mt: 4,
                    p: 3,
                    borderRadius: 3,
                    boxShadow: theme => theme.shadows[4],
                    background: theme => `linear-gradient(135deg, ${theme.palette.grey[100]}, ${theme.palette.grey[200]})`,
                }}
            >
                <CardContent>
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        gutterBottom
                        textAlign="center"
                        color="primary.main"
                    >
                        Gửi Thông Báo
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Tiêu đề"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                fullWidth
                                variant="outlined"
                                sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Nội dung thông báo"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                startIcon={<SendIcon />}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    background: theme => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                                    "&:hover": {
                                        background: theme => `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                    },
                                }}
                                onClick={sendNotification}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Gửi Thông Báo"}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Divider giữa form và danh sách thông báo */}
            <Divider sx={{ my: 4, borderColor: 'grey.300' }} />

            {/* Danh sách thông báo */}
            <UserNotificationCenter />
        </Box>
    );
};

export default AdminNotificationCenter;