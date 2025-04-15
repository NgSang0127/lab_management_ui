import {api} from "../../config/api.ts";
import {handleAxiosError} from "../../utils/handleAxiosError.ts";
import {PageResponse} from "../../state/Page/ActionType.ts";

export interface SoftwareRequest{
    softwareName:string;
    isFree:boolean;
}

export interface SoftwareResponse{
    id:number;
    softwareName:string;
    isFree:boolean;
}

export async function fetchSoftwares(page:number,size:number):Promise<PageResponse<SoftwareResponse>>{
    try {
        const response =await api.get<PageResponse<SoftwareResponse>>('/admin/softwares',{
            params: {
                page,
                size
            }
        });
        return response.data;
    }catch (error){
        handleAxiosError(error);
    }
}

export async function fetchSoftwareById(id: number): Promise<SoftwareResponse> {
    try {
        const response = await api.get<SoftwareResponse>(`/admin/softwares/${id}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function postCreateSoftware(request: SoftwareRequest): Promise<SoftwareResponse> {
    try {
        const response = await api.post<SoftwareResponse>(`/admin/softwares`, request);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function putUpdateSoftwareById(id: number, request: SoftwareRequest): Promise<SoftwareResponse> {
    try {
        const response = await api.put<SoftwareResponse>(`/admin/softwares/${id}`, request);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function deleteSoftwareById(id: number): Promise<string> {
    try {
        const response = await api.delete(`/admin/softwares/${id}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function getSoftwaresByRoomId(roomId:number):Promise<SoftwareResponse[]>{
    try{
        const  response=await api.get<SoftwareResponse[]>(`/admin/softwares/by-room/${roomId}`);
        return response.data;
    }catch (e) {
        handleAxiosError(e);
    }
}