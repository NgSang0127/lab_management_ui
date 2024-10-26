import axios from "axios";

export const API_URL = "http://localhost:8080/api/v1";

// Instance chính cho các API thông thường
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;
        if (err.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                console.log("No refresh token available.");
                return Promise.reject(err);
            }
            try {
                // Sử dụng instance `axios` riêng cho việc refresh token
                const refreshApi = axios.create({ baseURL: API_URL });
                const res = await refreshApi.post(
                    `/auth/refresh-token`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    }
                );
                const newAccessToken = res.data.access_token;
                localStorage.setItem("accessToken", newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (e) {
                console.error("Error refreshing token:", e);
                return Promise.reject(e);
            }
        }
        return Promise.reject(err);
    }
);
