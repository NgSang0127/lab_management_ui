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
    Chip,
    Avatar,
    Skeleton,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../state/store.ts";
import { fetchTimetableByDate, cancelTimetable } from "../../state/timetable/thunk.ts";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
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

    const getDisplayName = (timetable: any) => {
        return timetable.courses?.length > 0 && timetable.courses[0]?.name
            ? timetable.courses[0].name
            : timetable.timetableName || "N/A";
    };

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

    const handleCloseAlert = useCallback(() => {
        setAlert((prev) => ({ ...prev, open: false }));
    }, []);

    const handleCardClick = (timetableId: number) => {
        setSelectedTimetable(timetableId);
    };

    const getInstructorInitials = (fullName: string) => {
        return fullName
            .split(" ")
            .map((name) => name.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            <Helmet>
                <title>Cancel Timetable | Lab Management IT</title>
            </Helmet>
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: { xs: 2, sm: 3, md: 4 },
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                            "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>')",
                        pointerEvents: "none",
                    },
                }}
            >
                <LoadingIndicator open={isLoading} />
                <Fade in timeout={800}>
                    <Paper
                        elevation={0}
                        sx={{
                            padding: { xs: 2, sm: 3, md: 5 },
                            maxWidth: { xs: "100%", sm: 700, md: 900 },
                            width: "100%",
                            borderRadius: 4,
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                            position: "relative",
                            overflow: "hidden",
                            "@keyframes shimmer": {
                                "0%": { backgroundPosition: "-200% 0" },
                                "100%": { backgroundPosition: "200% 0" },
                            },
                        }}
                    >
                        <Typography
                            variant="h3"
                            gutterBottom
                            align="center"
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                mb: { xs: 1, sm: 2 },
                                letterSpacing: -0.5,
                            }}
                        >
                            {t("timetable.cancelTimetable.title")}
                        </Typography>

                        <Typography
                            variant="body1"
                            align="center"
                            sx={{
                                color: "rgba(0, 0, 0, 0.6)",
                                mb: { xs: 2, sm: 3, md: 4 },
                                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                            }}
                        >
                            Select a date and timetable to cancel
                        </Typography>

                        {/* Date Picker */}
                        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label={t("timetable.cancelTimetable.dateCancel")}
                                    value={cancelDate}
                                    onChange={(newValue) => setCancelDate(newValue)}
                                    enableAccessibleFieldDOMStructure={false}
                                    format="dd/MM/yyyy"
                                    slots={{
                                        textField: wrappedProps => (
                                            <TextField
                                                {...wrappedProps}
                                                fullWidth
                                                margin="normal"
                                                variant="outlined"
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 3,
                                                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                                                        border: "2px solid transparent",
                                                        fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                                                        "&:hover": {
                                                            transform: "translateY(-2px)",
                                                            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                                                        },
                                                        "&.Mui-focused": {
                                                            transform: "translateY(-2px)",
                                                            boxShadow: "0 10px 20px rgba(25, 118, 210, 0.3)",
                                                        },
                                                    },
                                                    "& .MuiInputLabel-root": {
                                                        color: "rgba(0, 0, 0, 0.7)",
                                                        fontWeight: 600,
                                                        fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                                                    },
                                                    "& .MuiInputLabel-root.Mui-focused": {
                                                        color: "#1976d2",
                                                    },
                                                }}
                                            />
                                        ),
                                    }}
                                    views={["year", "month", "day"]}
                                />
                            </LocalizationProvider>
                        </Box>

                        {/* Timetable Grid */}
                        {cancelDate && (
                            <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
                                {isLoading ? (
                                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                                        {[1, 2, 3, 4].map((item) => (
                                            <Grid size={{ xs: 12, sm: 6 }} key={item}>
                                                <Skeleton
                                                    height={160}
                                                    sx={{
                                                        borderRadius: 3,
                                                        transform: "scale(1)",
                                                        animation: "pulse 1.5s ease-in-out infinite",
                                                    }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : error ? (
                                    <Box
                                        sx={{
                                            textAlign: "center",
                                            py: { xs: 3, sm: 4 },
                                            px: 2,
                                            borderRadius: 3,
                                            background: "linear-gradient(135deg, #ff7675, #fd79a8)",
                                            color: "white",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                mb: 1,
                                                fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.3rem" },
                                            }}
                                        >
                                            Oops! Something went wrong
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                                        >
                                            {error}
                                        </Typography>
                                    </Box>
                                ) : timetableDate.length > 0 ? (
                                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                                        {timetableDate.map((timetable, index) => (
                                            <Grid size={{ xs: 12, sm: 6 }} key={timetable.id}>
                                                <Card
                                                    sx={{
                                                        borderRadius: 3,
                                                        border:
                                                            selectedTimetable === timetable.id
                                                                ? "2px solid transparent"
                                                                : "1px solid rgba(0, 0, 0, 0.08)",
                                                        background:
                                                            selectedTimetable === timetable.id
                                                                ? "linear-gradient(white, white) padding-box, linear-gradient(135deg, #1976d2, #42a5f5) border-box"
                                                                : "rgba(255, 255, 255, 0.9)",
                                                        backdropFilter: "blur(10px)",
                                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                        transform:
                                                            selectedTimetable === timetable.id
                                                                ? "scale(1.02)"
                                                                : "scale(1)",
                                                        boxShadow:
                                                            selectedTimetable === timetable.id
                                                                ? "0 15px 35px rgba(25, 118, 210, 0.3)"
                                                                : "0 4px 20px rgba(0, 0, 0, 0.08)",
                                                        "&:hover": {
                                                            transform: "translateY(-5px) scale(1.02)",
                                                            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)",
                                                        },
                                                        animation: `slideIn 0.6s ease-out ${index * 0.1}s both`,
                                                        "@keyframes slideIn": {
                                                            "0%": { opacity: 0, transform: "translateY(30px)" },
                                                            "100%": { opacity: 1, transform: "translateY(0)" },
                                                        },
                                                    }}
                                                >
                                                    <CardActionArea onClick={() => handleCardClick(timetable.id)}>
                                                        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    mb: { xs: 1.5, sm: 2 },
                                                                }}
                                                            >
                                                                <Avatar
                                                                    sx={{
                                                                        width: { xs: 40, sm: 48 },
                                                                        height: { xs: 40, sm: 48 },
                                                                        background:
                                                                            "linear-gradient(135deg, #1976d2, #42a5f5)",
                                                                        color: "white",
                                                                        fontWeight: 700,
                                                                        fontSize: { xs: "0.9rem", sm: "1.1rem" },
                                                                        mr: { xs: 1, sm: 2 },
                                                                    }}
                                                                >
                                                                    {getInstructorInitials(
                                                                        timetable.instructor.user.fullName
                                                                    )}
                                                                </Avatar>
                                                                <Box sx={{ flex: 1 }}>
                                                                    <Typography
                                                                        variant="h6"
                                                                        sx={{
                                                                            fontWeight: 700,
                                                                            color:
                                                                                selectedTimetable === timetable.id
                                                                                    ? "#1976d2"
                                                                                    : "#2d3748",
                                                                            mb: 0.5,
                                                                            fontSize: {
                                                                                xs: "1rem",
                                                                                sm: "1.1rem",
                                                                                md: "1.2rem",
                                                                            },
                                                                        }}
                                                                    >
                                                                        {getDisplayName(timetable)}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{
                                                                            color: "rgba(0, 0, 0, 0.6)",
                                                                            fontWeight: 500,
                                                                            fontSize: {
                                                                                xs: "0.8rem",
                                                                                sm: "0.9rem",
                                                                            },
                                                                        }}
                                                                    >
                                                                        {timetable.instructor.user.fullName}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>

                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    flexWrap: "wrap",
                                                                    gap: 1,
                                                                    mb: { xs: 1.5, sm: 2 },
                                                                }}
                                                            >
                                                                <Chip
                                                                    label={`Room ${timetable.room?.name || "N/A"}`}
                                                                    size="small"
                                                                    sx={{
                                                                        background:
                                                                            "linear-gradient(135deg, #1976d2, #42a5f5)",
                                                                        color: "white",
                                                                        fontWeight: 600,
                                                                        fontSize: {
                                                                            xs: "0.7rem",
                                                                            sm: "0.8rem",
                                                                        },
                                                                        "& .MuiChip-label": {
                                                                            px: { xs: 1.5, sm: 2 },
                                                                        },
                                                                    }}
                                                                />
                                                                <Chip
                                                                    label={`Lessons ${timetable.startLesson}-${
                                                                        timetable.startLesson +
                                                                        timetable.totalLessonDay -
                                                                        1
                                                                    }`}
                                                                    size="small"
                                                                    sx={{
                                                                        background: "rgba(25, 118, 210, 0.1)",
                                                                        color: "#1976d2",
                                                                        fontWeight: 600,
                                                                        border:
                                                                            "1px solid rgba(25, 118, 210, 0.3)",
                                                                        fontSize: {
                                                                            xs: "0.7rem",
                                                                            sm: "0.8rem",
                                                                        },
                                                                    }}
                                                                />
                                                            </Box>

                                                            {selectedTimetable === timetable.id && (
                                                                <Box
                                                                    sx={{
                                                                        mt: 2,
                                                                        p: { xs: 1.5, sm: 2 },
                                                                        borderRadius: 2,
                                                                        background:
                                                                            "linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(66, 165, 245, 0.1))",
                                                                        border:
                                                                            "1px solid rgba(25, 118, 210, 0.2)",
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        variant="caption"
                                                                        sx={{
                                                                            color: "#1976d2",
                                                                            fontWeight: 600,
                                                                            textTransform: "uppercase",
                                                                            letterSpacing: 0.5,
                                                                            fontSize: {
                                                                                xs: "0.7rem",
                                                                                sm: "0.75rem",
                                                                            },
                                                                        }}
                                                                    >
                                                                        Selected for cancellation
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Box
                                        sx={{
                                            textAlign: "center",
                                            py: { xs: 4, sm: 6 },
                                            px: 2,
                                            borderRadius: 3,
                                            background:
                                                "linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(66, 165, 245, 0.1))",
                                            border: "1px solid rgba(25, 118, 210, 0.2)",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                mb: 1,
                                                color: "#1976d2",
                                                fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.3rem" },
                                            }}
                                        >
                                            No timetables found
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "rgba(0, 0, 0, 0.6)",
                                                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                                            }}
                                        >
                                            {t("timetable.cancelTimetable.no_data")}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        )}

                        {/* Cancel Button */}
                        <Button
                            variant="contained"
                            onClick={handleCancel}
                            fullWidth
                            disabled={!cancelDate || !selectedTimetable}
                            sx={{
                                py: { xs: 1.5, sm: 2 },
                                borderRadius: 3,
                                fontWeight: 700,
                                textTransform: "none",
                                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                                background:
                                    !cancelDate || !selectedTimetable
                                        ? "rgba(0, 0, 0, 0.12)"
                                        : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                                color: !cancelDate || !selectedTimetable ? "rgba(0, 0, 0, 0.26)" : "white",
                                border: "none",
                                boxShadow:
                                    !cancelDate || !selectedTimetable
                                        ? "none"
                                        : "0 10px 30px rgba(25, 118, 210, 0.4)",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                    background:
                                        !cancelDate || !selectedTimetable
                                            ? "rgba(0, 0, 0, 0.12)"
                                            : "linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)",
                                    transform: !cancelDate || !selectedTimetable ? "none" : "translateY(-2px)",
                                    boxShadow:
                                        !cancelDate || !selectedTimetable
                                            ? "none"
                                            : "0 15px 40px rgba(25, 118, 210, 0.5)",
                                },
                                "&:active": {
                                    transform: !cancelDate || !selectedTimetable ? "none" : "translateY(0)",
                                },
                            }}
                        >
                            {t("timetable.cancelTimetable.cancel_button")}
                        </Button>
                    </Paper>
                </Fade>

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