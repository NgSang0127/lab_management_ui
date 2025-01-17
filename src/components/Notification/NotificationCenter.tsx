import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AlertColor } from '@mui/material';

interface Notification {
    id: number;
    message: string;
    severity: AlertColor;
}

const NotificationCenter: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Function to trigger new notifications
    const triggerNotification = (message: string, severity: AlertColor) => {
        const newNotification = { id: Date.now(), message, severity };
        setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
    };

    // Simulate different types of events
    useEffect(() => {
        const events = [
            { message: 'Scheduled maintenance in progress. Some features may be unavailable.', severity: 'warning' },
            { message: 'Exclusive 20% off on all services. Grab the offer now!', severity: 'success' },
            { message: 'New update available: check out the latest features!', severity: 'info' },
            { message: 'Hurry! Limited time sale on selected items.', severity: 'success' },
            { message: 'We are experiencing a temporary service disruption. We apologize for the inconvenience.', severity: 'error' },
            { message: 'Join our event this weekend for exciting giveaways and prizes!', severity: 'info' },
        ];

        const eventInterval = setInterval(() => {
            const event = events[Math.floor(Math.random() * events.length)];
            triggerNotification(event.message, event.severity);
        }, 5000);

        return () => clearInterval(eventInterval); // Cleanup on unmount
    }, []);

    // Handle closing notifications
    const handleCloseNotification = (id: number) => {
        setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification.id !== id));
    };

    // Show snackbar for notifications
    const handleOpenSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div>
            {/* Manual Trigger Buttons */}
            <Button
                onClick={() => triggerNotification('New promotion: 30% off all items today!', 'success')}
                variant="contained"
                color="primary"
            >
                Trigger Promotion
            </Button>
            <Button
                onClick={() => triggerNotification('Scheduled maintenance tomorrow at 12 AM.', 'warning')}
                variant="outlined"
                color="secondary"
                sx={{ ml: 2 }}
            >
                Trigger Maintenance
            </Button>

            {/* Notification List */}
            <List>
                {notifications.map((notification) => (
                    <ListItem key={notification.id} sx={{ border: '1px solid', borderRadius: '8px', margin: '10px 0' }}>
                        <Alert severity={notification.severity} sx={{ width: '100%' }}>
                            <ListItemText primary={notification.message} />
                        </Alert>
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="close" onClick={() => handleCloseNotification(notification.id)}>
                                <CloseIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>

            {/* Snackbar for more urgent or highlighted notifications */}
            <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handleCloseSnackbar}>
                <Alert severity="info" sx={{ width: '100%' }} onClose={handleCloseSnackbar}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default NotificationCenter;
