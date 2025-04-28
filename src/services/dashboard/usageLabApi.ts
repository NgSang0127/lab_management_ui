import {api} from "../../config/api.ts";
import {handleAxiosError} from "../../utils/handleAxiosError.ts";

export interface LabUsage{
    id:number;
    roomName:string;
    usagePercentage:number;
}

export async function fetchLabUsage(startDate:string,endDate:string): Promise<LabUsage[]> {
    try {
        const response = await api.get<LabUsage[]>(`/logs/lab-usage`,{
            params:{
                startDate:startDate,
                endDate:endDate
            }
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}