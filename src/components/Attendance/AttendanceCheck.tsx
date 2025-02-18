import  { useState } from "react";
import { postCheckAttendance } from "../../api/attendance/checkAttendance.ts";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import CustomAlert from "../Support/CustomAlert.tsx";
import LoadingIndicator from "../Support/LoadingIndicator.tsx";
import {useTranslation} from "react-i18next";

const AttendanceCheck = () => {
    const {t}=useTranslation();
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
        <div className="flex justify-center items-center min-h-screen   ">
            <Card className="shadow-xl w-full max-w-lg p-6 rounded-2xl bg-white">
                <CardContent className="flex flex-col items-center text-center">
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
