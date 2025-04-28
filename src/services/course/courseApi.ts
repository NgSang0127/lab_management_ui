import {PageResponse} from "../../state/page/types.ts";
import {api} from "../../config/api.ts";
import {handleAxiosError} from "../../utils/handleAxiosError.ts";


export interface CourseRequest {
    id?: number;
    name: string;
    code: string;
    nh: string;
    th: string;
    description: string;
    credits: number;
    instructorId: number;
}

export async function fetchCourses(page: number, size: number,keyword:string): Promise<PageResponse<CourseRequest>> {
    try {
        const response = await api.get<PageResponse<CourseRequest>>('/courses', {
            params: {
                page,
                size,
                keyword,
            }
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}