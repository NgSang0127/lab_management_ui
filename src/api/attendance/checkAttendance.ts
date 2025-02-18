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
            if (error.response && typeof error.response.data === "string") {
                throw new Error(error.response.data);
            }
            throw new Error("No response from server");
        }
        throw new Error("Unknown error");
    }
}
