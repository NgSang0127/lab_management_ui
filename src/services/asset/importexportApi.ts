import { api } from "../../config/api.ts";
import axios from "axios";
import {handleAxiosError} from "../../utils/handleAxiosError.ts";

interface ExportResponse {
    blob: Blob;
    filename: string;
}


export async function importAssetsFromCSV(file: File): Promise<string> {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/admin/assets/import-export/import/csv", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data; // Mong đợi là một thông báo thành công
    } catch (error) {
        handleAxiosError(error);
    }
}


export async function importAssetsFromExcel(file: File): Promise<string> {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/admin/assets/import-export/import/excel", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data; // Mong đợi là một thông báo thành công
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function exportAssetsToCSV(): Promise<ExportResponse> {
    try {
        const response = await api.get("/admin/assets/import-export/export/csv", {
            responseType: "blob",
        });

        // Extract filename from 'Content-Disposition' header
        const disposition = response.headers['content-disposition'];
        let filename = "assets_export.csv"; // Default filename

        if (disposition && disposition.includes('filename=')) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        return { blob: response.data, filename };
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function exportAssetsToExcel(): Promise<ExportResponse> {
    try {
        const response = await api.get("/admin/assets/import-export/export/excel", {
            responseType: "blob",
        });

        const disposition = response.headers['content-disposition'];
        let filename = "assets_export.xlsx"; // Default filename

        if (disposition && disposition.includes('filename=')) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        return { blob: response.data, filename };
    } catch (error) {
        handleAxiosError(error);
    }
}
