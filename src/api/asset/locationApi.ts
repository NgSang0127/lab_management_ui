import {PageResponse} from "../../state/Page/ActionType.ts";
import {api} from "../../config/api.ts";
import axios from "axios";


export interface LocationResponse{
    id:number,
    name:string,
    address:string,
}

interface LocationRequest{
    name:string,
    address:string,
}


export async function fetchLocations(page: number, size: number): Promise<PageResponse<LocationResponse>> {
    try {
        const response = await api.get<PageResponse<LocationResponse>>('/admin/locations', {
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

export async function fetchLocationById(id: number): Promise<LocationResponse> {
    try {
        const response = await api.get<LocationResponse>(`/admin/locations/${id}`);
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

export async function postCreateLocation(request: LocationRequest): Promise<LocationResponse> {
    try {
        const response = await api.post<LocationResponse>(`/admin/locations`, request);
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

export async function putUpdateLocationById(id: number, request: LocationRequest): Promise<LocationResponse> {
    try {
        const response = await api.put<LocationResponse>(`/admin/locations/${id}`, request);
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

export async function deleteLocationById(id: number): Promise<string> {
    try {
        const response = await api.delete(`/admin/locations/${id}`);
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