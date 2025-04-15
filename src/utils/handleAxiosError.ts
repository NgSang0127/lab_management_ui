import axios from "axios";

export const handleAxiosError = (error: unknown): Error => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        if (data) {
            if (typeof data === 'string') {
                return new Error(data);
            }

            if (typeof data === 'object') {
                const backendError =
                    (data as any).businessErrorDescription ||
                    (data as any).message ||
                    (data as any).error ||
                    'Unknown backend error';
                return new Error(backendError);
            }
        }

        return new Error('No response from server');
    }

    return new Error('Unknown error');
};
