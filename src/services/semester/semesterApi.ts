import {api} from "../../config/api.ts";
import {handleAxiosError} from "../../utils/handleAxiosError.ts";
import {Semester} from "../../state/timetable/timetableSlice.ts";
import {PageResponse} from "../../state/page/types.ts";




export async function fetchSemesters(page: number, size: number): Promise<PageResponse<Semester>> {
    try {
        const response = await api.get<PageResponse<Semester>>('/admin/semester', {
            params: {
                page,
                size
            }
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function fetchActiveSemester(): Promise<Semester[]> {
    try {
        const response = await api.get<Semester[]>(`/admin/semester/active`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function postCreateSemester(request: Semester): Promise<Semester> {
    try {
        const response = await api.post<Semester>(`/admin/semester`, request);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function putUpdateSemesterById(id: number, request: Semester): Promise<Semester> {
    try {
        const response = await api.put<Semester>(`/admin/semester/${id}`, request);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function deleteSemesterById(id: number): Promise<string> {
    try {
        const response = await api.delete(`/admin/semester/${id}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}