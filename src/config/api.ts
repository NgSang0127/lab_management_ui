import axios from "axios";

export const API_URL = "http://localhost:8080/api/v1";

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        // Nếu lỗi 401 và chưa retry, thử refresh token
        if (err.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Gửi request refresh token (cookie tự động gửi kèm)
                await axios.post(`${API_URL}/auth/refresh-token`, {}, { withCredentials: true });

                // Retry request ban đầu
                return api(originalRequest);
            } catch (e) {
                console.error("Error refreshing token:", e);
                return Promise.reject(e);
            }
        }
        return Promise.reject(err);
    }
);
