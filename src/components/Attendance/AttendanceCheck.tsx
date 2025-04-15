import { useState } from "react";
import { postCheckAttendance } from "../../api/attendance/checkAttendance.ts";
import { Button, Card, CardContent, Typography, Box } from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import CustomAlert from "../Support/CustomAlert.tsx";
import LoadingIndicator from "../Support/LoadingIndicator.tsx";
import { useTranslation } from "react-i18next";

const AttendanceCheck = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"success" | "error" | "info" | null>(null);
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error" | "info",
    });

    const showAlert = (message: string, severity: "success" | "error" | "info") => {
        setAlert({ open: true, message, severity });
    };

    const handleCloseAlert = () => {
        setAlert((prev) => ({ ...prev, open: false }));
    };

    const checkAttendance = () => {
        if ("geolocation" in navigator) {
            setIsLoading(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log("Gửi tọa độ:", { latitude, longitude });

                    try {
                        const responseMessage = await postCheckAttendance({ latitude, longitude });
                        showAlert(responseMessage, "success");
                        setStatus("success");
                    } catch (e: any) {
                        showAlert(e.message, "error");
                        setStatus("error");
                    } finally {
                        setIsLoading(false);
                    }
                },
                () => {
                    showAlert("Location access denied", "error");
                    setStatus("error");
                    setIsLoading(false);
                }
            );
        } else {
            showAlert("Geolocation not supported!", "error");
            setStatus("error");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="shadow-xl w-full max-w-lg p-6 rounded-2xl bg-white">
                <CardContent className="flex flex-col items-center text-center">
                    {/* Nhúng Google Maps iframe ở đây */}
                    <Box sx={{ mb: 4, width: "100%" }}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.1316505608092!2d106.79904467583916!3d10.877590057317947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a415a9d221%3A0x550c2b41569376f9!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBRdeG7kWMgVOG6vyAtIMSQ4bqhaSBo4buNYyBRdeG7kWMgZ2lhIFRQLkhDTQ!5e0!3m2!1svi!2s!4v1743504507116!5m2!1svi!2s"
                            width="100%"
                            height="400"
                            style={{ border: "0", borderRadius: "8px" }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </Box>
                    <LocationOn className="text-blue-500 text-5xl mb-3" />
                    <Typography variant="h5" className="font-semibold text-gray-800 pb-5">
                        {t('attendance.title')}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 pb-10">
                        {t('attendance.body')}
                    </Typography>

                    <Button
                        onClick={checkAttendance}
                        variant="contained"
                        color="primary"
                        className="w-full py-2 px-4 text-lg font-medium shadow-md transition duration-300 hover:bg-blue-700"
                        disabled={isLoading}
                    >
                        {isLoading ? <LoadingIndicator open={isLoading} /> : t('attendance.check_button')}
                    </Button>

                    {status && (
                        <CustomAlert open={alert.open} onClose={handleCloseAlert} message={alert.message} severity={alert.severity} />
                    )}


                </CardContent>
            </Card>
        </div>
    );
};

export default AttendanceCheck;
