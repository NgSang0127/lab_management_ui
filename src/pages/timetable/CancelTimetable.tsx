import React, { useEffect, useState, useCallback } from "react";
import {
    Button,
    TextField,
    Typography,
    Paper,
    Box,
    Fade,
    Grid,
    Card,
    CardContent,
    CardActionArea,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../state/store.ts";
import { fetchTimetableByDate, cancelTimetable } from "../../state/timetable/thunk.ts";
import { useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import CustomAlert from "../../components/support/CustomAlert.tsx";
import LoadingIndicator from "../../components/support/LoadingIndicator.tsx";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const CancelTimetable: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { timetableDate, isLoading, error } = useSelector((state: RootState) => state.timetable);
    const [cancelDate, setCancelDate] = useState<Date | null>(null);
    const [selectedTimetable, setSelectedTimetable] = useState<number | null>(null);

    const [alert, setAlert] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        if (cancelDate) {
            const formattedDate = format(cancelDate, "yyyy-MM-dd");
            dispatch(fetchTimetableByDate({ date: formattedDate }));
        }
    }, [cancelDate, dispatch]);

    // Get display name for timetable (course name if available, else timetableName, else N/A)
    const getDisplayName = (timetable: any) => {
        const name = timetable.courses?.length > 0 && timetable.courses[0]?.name
            ? timetable.courses[0].name
            : timetable.timetableName || "N/A";
        return name;
    };

    // Handle cancellation of timetable
    const handleCancel = useCallback(async () => {
        if (selectedTimetable) {
            const selectedTimetableDetails = timetableDate.find((t) => t.id === selectedTimetable);

            if (selectedTimetableDetails && cancelDate) {
                const formattedCancelDate = format(cancelDate, "dd/MM/yyyy");

                const result = await dispatch(
                    cancelTimetable({
                        cancelDate: formattedCancelDate,
                        startLesson: selectedTimetableDetails.startLesson,
                        roomName: selectedTimetableDetails.room.name,
                        timetableId: selectedTimetableDetails.id,
                    })
                );

                if (cancelTimetable.fulfilled.match(result)) {
                    setAlert({
                        open: true,
                        message: t("timetable.cancelTimetable.success.cancel"),
                        severity: "success",
                    });
                    navigate("/timetable/by-week");
                } else {
                    setAlert({
                        open: true,
                        message: t("timetable.cancelTimetable.errors.cancel"),
                        severity: "error",
                    });
                }
            }
        } else {
            setAlert({
                open: true,
                message: t("timetable.cancelTimetable.errors.default"),
                severity: "error",
            });
        }
    }, [selectedTimetable, timetableDate, cancelDate, dispatch, navigate, t]);

    // Close alert
    const handleCloseAlert = useCallback(() => {
        setAlert((prev) => ({ ...prev, open: false }));
    }, []);

    // Handle timetable card selection
    const handleCardClick = (timetableId: number) => {
        setSelectedTimetable(timetableId);
    };

    return (
        <>
            <Helmet>
                <title>Cancel Timetable | Lab Management IT</title>
            </Helmet>
            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 3,
                }}
            >
                <LoadingIndicator open={isLoading} />
                <Fade in timeout={600}>
                    <Paper
                        elevation={6}
                        sx={{
                            padding: { xs: 3, md: 5 },
                            maxWidth: 800,
                            width: "100%",
                            borderRadius: 3,
                            backgroundColor: "#ffffff",
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                            },
                        }}
                    >
                        <Typography
                            variant="h4"
                            gutterBottom
                            align="center"
                            sx={{
                                fontWeight: 700,
                                color: "#1976d2",
                                mb: 4,
                                letterSpacing: 0.5,
                            }}
                        >
                            {t("timetable.cancelTimetable.title")}
                        </Typography>

                        {/* Date Picker with dd/MM/yyyy format */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label={t("timetable.cancelTimetable.dateCancel")}
                                value={cancelDate}
                                onChange={(newValue) => {
                                    setCancelDate(newValue);
                                }}
                                enableAccessibleFieldDOMStructure={false}
                                format="dd/MM/yyyy"
                                slots={{
                                    textField: (params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                    backgroundColor: "#fff",
                                                },
                                            }}
                                        />
                                    ),
                                }}
                                views={["year", "month", "day"]}
                            />
                        </LocalizationProvider>

                        {/* Timetable Grid */}
                        {cancelDate && (
                            <>
                                {isLoading ? (
                                    <Typography variant="body1" align="center" sx={{ my: 3 }}>
                                        {t("timetable.cancelTimetable.loading")}
                                    </Typography>
                                ) : error ? (
                                    <Typography variant="body1" color="error" align="center" sx={{ my: 3 }}>
                                        {error}
                                    </Typography>
                                ) : timetableDate.length > 0 ? (
                                    <Grid container spacing={2} sx={{ mt: 2 }}>
                                        {timetableDate.map((timetable) => (
                                            <Grid size={{xs:12,sm:6}} key={timetable.id}>
                                                <Card
                                                    sx={{
                                                        border: selectedTimetable === timetable.id ? "2px solid #1976d2" : "1px solid #e0e0e0",
                                                        borderRadius: 2,
                                                        transition: "all 0.2s ease",
                                                        "&:hover": {
                                                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                                            transform: "translateY(-2px)",
                                                        },
                                                        backgroundColor: selectedTimetable === timetable.id ? "#e3f2fd" : "#fff",
                                                    }}
                                                >
                                                    <CardActionArea onClick={() => handleCardClick(timetable.id)}>
                                                        <CardContent>
                                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                                {getDisplayName(timetable)}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Room {timetable.room?.name || "N/A"} - StartLesson {timetable.startLesson}
                                                            </Typography>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Typography variant="body1" align="center" sx={{ my: 3 }}>
                                        {t("timetable.cancelTimetable.no_data")}
                                    </Typography>
                                )}
                            </>
                        )}

                        {/* Cancel Button */}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCancel}
                            fullWidth
                            disabled={!cancelDate || !selectedTimetable}
                            sx={{
                                mt: 4,
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: 600,
                                textTransform: "none",
                                backgroundColor: "#1976d2",
                                "&:hover": {
                                    backgroundColor: "#1565c0",
                                    transform: "translateY(-2px)",
                                    transition: "all 0.2s ease",
                                },
                                "&.Mui-disabled": {
                                    color: "rgba(255, 255, 255, 0.7)",
                                    backgroundColor: "rgba(25, 118, 210, 0.5)",
                                },
                            }}
                        >
                            {t("timetable.cancelTimetable.cancel_button")}
                        </Button>
                    </Paper>
                </Fade>

                {/* Custom Alert */}
                <CustomAlert
                    open={alert.open}
                    message={alert.message}
                    severity={alert.severity}
                    onClose={handleCloseAlert}
                />
            </Box>
        </>
    );
};

export default CancelTimetable;