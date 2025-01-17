import {PageResponse} from "../../state/Page/ActionType.ts";
import {api} from "../../config/api.ts";
import axios from "axios";


export interface CategoryResponse{
    id:number,
    name:string,
    description:string,
}

interface CategoryRequest{
    id:number,
    name:string,
    description:string,
}


export async function fetchCategories(page: number, size: number): Promise<PageResponse<CategoryResponse>> {
    try {
        const response = await api.get<PageResponse<CategoryResponse>>('/admin/categories', {
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

export async function fetchCategoryById(id: number): Promise<CategoryResponse> {
    try {
        const response = await api.get<CategoryResponse>(`/admin/categories/${id}`);
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

export async function postCreateCategory(request: CategoryRequest): Promise<CategoryResponse> {
    try {
        const response = await api.post<CategoryResponse>(`/admin/categories`, request);
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

export async function putUpdateCategoryById(id: number, request: CategoryRequest): Promise<CategoryResponse> {
    try {
        const response = await api.put<CategoryResponse>(`/admin/categories/${id}`, request);
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

export async function deleteCategoryById(id: number): Promise<string> {
    try {
        const response = await api.delete(`/admin/categories/${id}`);
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