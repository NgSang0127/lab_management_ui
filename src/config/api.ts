import axios from "axios";

export const API_URL="http://localhost:8080/api/v1";
export const api=axios.create(
    {
        baseURL:API_URL,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
    }
)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});