import {api} from "../../config/api.ts";
import axios from "axios";
import {handleAxiosError} from "../../utils/handleAxiosError.ts";
import {PageResponse} from "../../state/Page/ActionType.ts";


export interface RoomRequest{
    name:string,
    location:string,
    capacity:number,
    status:RoomStatus,
    softwareIds:number[]
}

export interface RoomResponse{
    id:number;
    name:string;
    location:string;
    capacity:number;
    status: RoomStatus;
    softwareList: Software[];
}

export interface Software{
    id:number;
    softwareName:string;
    isFree:boolean;
}

export enum RoomStatus{
    AVAILABLE='AVAILABLE',
    OCCUPIED='OCCUPIED',
    MAINTENANCE='MAINTENANCE',
    OUT_OF_SERVICE='OUT_OF_SERVICE',
    RESERVED='RESERVED',
    CLEANING='CLEANING',
    CLOSED='CLOSED',
    UNAVAILABLE='UNAVAILABLE'
}

export async function fetchRooms(page:number,size:number):Promise<PageResponse<RoomResponse>>{
    try {
        const response =await api.get<PageResponse<RoomResponse>>('/admin/rooms',{
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

export async function fetchRoomById(id: number): Promise<RoomResponse> {
    try {
        const response = await api.get<RoomResponse>(`/admin/rooms/${id}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function postCreateRoom(request: RoomRequest): Promise<RoomResponse> {
    try {
        const response = await api.post<RoomResponse>(`/admin/rooms`, request);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function putUpdateRoomById(id: number, request: RoomRequest): Promise<RoomResponse> {
    try {
        const response = await api.put<RoomResponse>(`/admin/rooms/${id}`, request);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function deleteRoomById(id: number): Promise<string> {
    try {
        const response = await api.delete(`/admin/rooms/${id}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}