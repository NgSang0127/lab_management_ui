import {api} from "../../config/api.ts";
import axios from "axios";

interface checkAttendanceRequest{
    latitude: number,
    longitude :number,
}
export async function postCheckAttendance(request: checkAttendanceRequest): Promise<string> {
    try {
        const response = await api.post<string>("/attendance", request);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.message ||
                (typeof error.response?.data === "string" ? error.response.data : null) ||
                "Not allowed access method";
            throw new Error(message);
        }
        throw new Error("Unknown error");
    }
}
