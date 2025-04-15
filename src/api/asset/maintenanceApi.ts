import {PageResponse} from "../../state/Page/ActionType.ts";
import {api} from "../../config/api.ts";
import axios from "axios";
import {handleAxiosError} from "../../utils/handleAxiosError.ts";

export interface MaintenanceRequest{
    assetId:number,
    scheduledDate:string,
    status: MaintenanceStatus,
    remarks:string
}
export interface MaintenanceResponse{
    id:number,
    assetId:number,
    scheduledDate:string,
    status: MaintenanceStatus,
    remarks:string,
    assetName:string,
    createDate:string,
    lastModifiedDate:string
}

export enum MaintenanceStatus {
    SCHEDULED='SCHEDULED',
    COMPLETED='COMPLETED',
    CANCELED='CANCELED',
}

export async function fetchMaintenances(page:number,size:number,keyword:string,status:string):Promise<PageResponse<MaintenanceResponse>>{
    try{
        const response = await api.get<PageResponse<MaintenanceResponse>>('/admin/maintenances',{
            params:{
                page,
                size,
                keyword,
                status
            }
        });
        return response.data;
    }catch (error) {
        handleAxiosError(error);
    }
}

export async function fetchMaintenanceById(id: number): Promise<MaintenanceResponse> {
    try {
        const response = await api.get<MaintenanceResponse>(`/admin/maintenances/${id}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function postCreateMaintenance(request: MaintenanceRequest): Promise<MaintenanceResponse> {
    try {
        const response = await api.post<MaintenanceResponse>(`/admin/maintenances`, request);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function putUpdateMaintenanceById(id: number, request: MaintenanceRequest): Promise<MaintenanceResponse> {
    try {
        const response = await api.put<MaintenanceResponse>(`/admin/maintenances/${id}`, request);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function deleteMaintenanceById(id: number): Promise<string> {
    try {
        const response = await api.delete(`/admin/maintenances/${id}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}