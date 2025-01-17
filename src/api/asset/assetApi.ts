import {api} from "../../config/api.ts";
import axios from "axios";
import {PageResponse} from "../../state/Page/ActionType.ts";



export interface AssetRequest{
    id:number,
    name:string,
    description:string,
    image:string,
    serialNumber:string,
    status:Status,
    purchaseDate:string,
    price:number,
    categoryId:number,
    locationId:number,
    assignedUserId:number,

}
export enum Status{
    IN_USE='IN_USE',
    AVAILABLE='AVAILABLE',
    MAINTENANCE='MAINTENANCE',
    RETIRED='RETIRED',
}


export interface AssetResponse{
    id:number,
    name:string,
    description:string,
    image:string,
    serialNumber:string,
    status:Status,
    purchaseDate:string,
    price:number,
    categoryId:number,
    locationId:number,
    assignedUserId:number,
    assignedUserName:string,
}
export interface AssetSpecificResponse{
    id:number,
    name:string,
    description:string,
    image:string,
    serialNumber:string,
    status:Status,
    purchaseDate:string,
    price:number,
    categoryName:string,
    locationName:string
}

export interface AssetHistoryResponse{
    assetId:number,
    userId:number,
    previousStatus:Status,
    newStatus:Status,
    changeDate:string,
    remarks:string
}


export async function fetchAssets(page: number, size: number,keyword:string,status:string): Promise<PageResponse<AssetResponse>> {
    try {
        const response = await api.get<PageResponse<AssetResponse>>('/admin/assets', {
            params: {
                page,
                size,
                keyword,
                status
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
                const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
                throw new Error(backendError);
            }
            throw new Error('No response from server');
        }
        throw new Error('Unknown error');
    }
}

export async function fetchAssetById(id: number): Promise<AssetResponse> {
    try {
        const response = await api.get<AssetResponse>(`/admin/assets/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
                const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
                throw new Error(backendError);
            }
            throw new Error('No response from server');
        }
        throw new Error('Unknown error');
    }
}

export async function postCreateAsset(request: AssetRequest): Promise<AssetResponse> {
    try {
        const response = await api.post<AssetResponse>(`/admin/assets`, request);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
                const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
                throw new Error(backendError);
            }
            throw new Error('No response from server');
        }
        throw new Error('Unknown error');
    }
}

export async function putUpdateAssetById(id: number, request: AssetRequest): Promise<AssetResponse> {
    try {
        const response = await api.put<AssetResponse>(`/admin/assets/${id}`, request);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
                const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
                throw new Error(backendError);
            }
            throw new Error('No response from server');
        }
        throw new Error('Unknown error');
    }
}

export async function deleteAssetById(id: number): Promise<any> {
    try {
        const response = await api.delete(`/admin/assets/${id}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
                const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
                throw new Error(backendError);
            }
            throw new Error('No response from server');
        }
        throw new Error('Unknown error');
    }
}

export async function postAssignAssetToUser(assetId: number, userId: number): Promise<AssetResponse> {
    try {
        const response = await api.post<AssetResponse>(`/admin/assets/${assetId}/assign/${userId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
                const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
                throw new Error(backendError);
            }
            throw new Error('No response from server');
        }
        throw new Error('Unknown error');
    }
}

export async function postUnassignAsset(assetId: number): Promise<AssetResponse> {
    try {
        const response = await api.post<AssetResponse>(`/admin/assets/${assetId}/unassign`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
                const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
                throw new Error(backendError);
            }
            throw new Error('No response from server');
        }
        throw new Error('Unknown error');
    }
}

export async function fetchAssetsByUserId(userId: number, page: number, size: number): Promise<PageResponse<AssetSpecificResponse>> {
    try {
        const response = await api.get<PageResponse<AssetSpecificResponse>>(`/admin/assets/user/${userId}`, {
            params: {
                page,
                size
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
                const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
                throw new Error(backendError);
            }
            throw new Error('No response from server');
        }
        throw new Error('Unknown error');
    }
}

export async function fetchAssetHistoriesByAssetId(assetId: number, page: number, size: number): Promise<PageResponse<AssetHistoryResponse>> {
    try {
        const response = await api.get<PageResponse<AssetHistoryResponse>>(`/admin/assets/${assetId}/history`, {
            params: {
                page,
                size
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
                const backendError = error.response.data.error || error.response.data.message || 'Unknown backend error';
                throw new Error(backendError);
            }
            throw new Error('No response from server');
        }
        throw new Error('Unknown error');
    }
}
