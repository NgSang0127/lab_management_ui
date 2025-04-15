import {api} from "../../config/api.ts";
import {PageResponse} from "../../state/Page/ActionType.ts";
import {handleAxiosError} from "../../utils/handleAxiosError.ts";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {User} from "../../state/Authentication/Action.ts";
import axios from "axios";

export interface AssetRequest{
    name: string;
    description?: string;
    price?: number;
    image?: string;
    status: Status;
    purchaseDate?: string;
    categoryId: number;
    locationId: number;
    roomId?: number;
    quantity?: number;
    warranty?: number;
    operationYear?: number;
    operationStartDate?: string;
    operationTime?: OperationTime;
    lifeSpan?: number;
    configurations?: AssetConfiguration[];
    assignedUserId?: number;
    assignedUserName?: string;

}

export interface AssetBorrowing{
    id?:number;
    assetId:number;
    userId:number;
    username:string;
    assetName:string;
    borrowDate:string;
    returnDate:string;
    expectedReturnDate:string;
    status: BorrowingStatus;
    remarks:string;
}

export enum BorrowingStatus{
    PENDING='PENDING',
    APPROVED='APPROVED',
    BORROWED='BORROWED',
    RETURNED='RETURNED',
    OVERDUE='OVERDUE'
}

export enum OperationTime{
    MORNING='MORNING',
    AFTERNOON='AFTERNOON',
    NIGHT='NIGHT',
    FULL_DAY='FULL_DAY',
    TWENTY_FOUR_SEVEN='TWENTY_FOUR_SEVEN'
}

export enum Status{
    IN_USE='IN_USE',
    AVAILABLE='AVAILABLE',
    MAINTENANCE='MAINTENANCE',
    RETIRED='RETIRED',
    BORROWED='BORROWED',
}


export interface AssetResponse{
    id: number;
    name: string;
    description?: string;
    image?: string;
    serialNumber: string;
    status: Status;
    purchaseDate?: string;
    price?: number;
    categoryId: number;
    locationId: number;
    roomId?: number;
    quantity?: number;
    warranty?: number;
    operationYear?: number;
    operationStartDate?: string;
    operationTime?: OperationTime;
    lifeSpan?: number;
    configurations?: AssetConfiguration[];
    assignedUserId?: number;
    assignedUserName?: string;
}
export interface AssetSpecificResponse{
    id:number,
    name:string,
    description:string,
    image:string,
    status:Status,
    purchaseDate:string,
    price:number,
    categoryName:string,
    locationName:string,
    roomName:string,
}

export interface AssetHistoryResponse{
    assetId:number,
    userId:number,
    username:string,
    assetName:string,
    previousStatus:Status,
    newStatus:Status,
    changeDate:string,
    remarks:string
}

export interface AssetConfiguration {
    specKey: string;
    specValue: string;
}


export async function fetchAssets(page: number, size: number,keyword:string,roomName:string,statuses:string,categoryIds:string,sortBy:string,sortOrder:string): Promise<PageResponse<AssetResponse>> {
    try {
        const response = await api.get<PageResponse<AssetResponse>>('/admin/assets', {
            params: {
                page,
                size,
                keyword,
                roomName,
                statuses,
                categoryIds,
                sortBy,
                sortOrder
            }
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function fetchAssetById(id: number): Promise<AssetResponse> {
    try {
        const response = await api.get<AssetResponse>(`/admin/assets/${id}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function postCreateAsset(request: AssetRequest): Promise<AssetResponse> {
    try {
        const response = await api.post<AssetResponse>(`/admin/assets`, request);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function postDuplicatedAsset(id:number):Promise<AssetResponse>{
    try{
        const response=await api.post<AssetResponse>(`/admin/assets/${id}/duplicate`);
        return response.data;
    }catch (error){
        handleAxiosError(error);
    }
}

export async function putUpdateAssetById(id: number, request: AssetRequest): Promise<AssetResponse> {
    try {
        const response = await api.put<AssetResponse>(`/admin/assets/${id}`, request);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function deleteAssetById(id: number): Promise<any> {
    try {
        const response = await api.delete(`/admin/assets/${id}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function postAssignAssetToUser(assetId: number, userId: number): Promise<AssetResponse> {
    try {
        const response = await api.post<AssetResponse>(`/history/${assetId}/assign/${userId}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function postUnassignAsset(assetId: number): Promise<AssetResponse> {
    try {
        const response = await api.post<AssetResponse>(`/history/${assetId}/unassign`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function fetchAssetsByUserId(userId: number,page: number, size: number,keyword:string,statuses:string,sortBy:string,sortOrder:string ): Promise<PageResponse<AssetSpecificResponse>> {
    try {
        const response = await api.get<PageResponse<AssetSpecificResponse>>(`/admin/assets/user/${userId}`, {
            params: {
                page,
                size,
                keyword,
                statuses,
                sortBy,
                sortOrder
            }
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function fetchAssetHistories(page: number, size: number,keyword:string,statuses:string,sortBy:string,sortOrder:string): Promise<PageResponse<AssetHistoryResponse>> {
    try {
        const response = await api.get<PageResponse<AssetHistoryResponse>>(`/history`, {
            params: {
                page,
                size,
                keyword,
                statuses,
                sortBy,
                sortOrder
            }
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function fetchAssetBorrowings(page:number,size:number,keyword:string,statuses:string,sortBy:string,sortOrder:string):Promise<PageResponse<AssetBorrowing>>{
    try{
        const response=await api.get<PageResponse<AssetBorrowing>>(`/borrowings`,{
            params:{
                page,
                size,
                keyword,
                statuses,
                sortBy,
                sortOrder
            }
        })
        return response.data;
    }catch (error){
        handleAxiosError(error);
    }
}


export async function postBorrowing(request:AssetBorrowing): Promise<AssetBorrowing>{
    try {
        const response = await api.post<AssetBorrowing>('/borrowings',request);
        return response.data;
    }catch (error){
        handleAxiosError(error);
    }
}

export async function putApproveBorrow(id:number): Promise<AssetBorrowing>{
    try{
        const response=await api.put<AssetBorrowing>(`/borrowings/${id}/approve`);
        return response.data;
    }catch (error){
        handleAxiosError(error);
    }
}

export async function putReturnAsset(id:number): Promise<AssetBorrowing>{
    try{
        const response= await api.put<AssetBorrowing>(`/borrowings/${id}/return`);
        return response.data;
    }catch (error){
        handleAxiosError(error);
    }
}

export async function fetchBorrowingsById(id:number): Promise<AssetBorrowing>{
    try{
        const response = await api.get<AssetBorrowing>(`/borrowings/${id}`);
        return response.data;
    }catch (error){
        handleAxiosError(error);
    }
}

export async function fetchBorrowingsByUser(userId:number): Promise<AssetBorrowing[]>{
    try{
        const response= await api.get<AssetBorrowing[]>(`/borrowings/user/${userId}`);
        return response.data;
    }catch (e) {
        handleAxiosError(e);

    }
}

export async function postCheckOverDue():Promise<string>{
    try{
        const response=await api.post<string>(`/borrowings/check-overdue`);
        return response.data;
    }catch (error){
        handleAxiosError(error);
    }
}


