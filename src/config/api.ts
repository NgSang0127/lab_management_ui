import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Instead of hardcoded localhost, use the current host and protocol
const currentHost = window.location.hostname;
const protocol = window.location.protocol;
export const API_URL = `${protocol}//${currentHost}:8080/api/v1`;

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        "Accept-Language": localStorage.getItem("language") || "en",
    },
    withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
});

// Token refresh state
let isRefreshing = false;
let failedQueue: any[] = [];
let refreshAttemptCount = 0;
const MAX_REFRESH_ATTEMPTS = 3;

// Process queued requests after token refresh
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });

    failedQueue = [];

    // Reset attempt counter on successful refresh
    if (!error) {
        refreshAttemptCount = 0;
    }
};

api.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (err: AxiosError) => {
        const originalRequest = err.config as any;

        // If error is 401 and we haven't tried to refresh the token yet
        if (err.response?.status === 401 && !originalRequest._retry) {
            // Check if we've made too many refresh attempts
            if (refreshAttemptCount >= MAX_REFRESH_ATTEMPTS) {
                console.log("Too many refresh attempts, redirecting to login");
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');

                // Only redirect if not already on auth pages
                if (!window.location.pathname.includes('/signin') &&
                    !window.location.pathname.includes('/signup')) {
                    window.location.href = '/account/signin';
                }
                return Promise.reject(new Error('Authentication failed after multiple attempts'));
            }

            // If we're already refreshing, add this request to the queue
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;
            refreshAttemptCount++;

            try {
                // Check if it's a public endpoint - if so, just continue without authentication
                const isPublicEndpoint = (url: string) => {
                    return url.includes('/auth/') ||
                        url.includes('/lesson-time') ||
                        url.includes('/timetable/weeks-range') ||
                        url.includes('/timetable/semester') ||
                        url.includes('/admin/rooms') ||
                        url.includes('/timetable/by-week');
                };

                if (originalRequest.url && isPublicEndpoint(originalRequest.url)) {
                    // For public endpoints, just retry without authentication
                    delete originalRequest.headers['Authorization'];
                    return api(originalRequest);
                }

                // Try to refresh the token
                const storedRefreshToken = localStorage.getItem('refreshToken');
                const headers: Record<string, string> = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                };

                // Add refresh token as a custom header if it exists in localStorage
                if (storedRefreshToken) {
                    headers['X-Refresh-Token'] = storedRefreshToken;
                }

                const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
                    withCredentials: true,
                    headers: headers
                });
                console.log("res",response.data);

                if (response.data?.accessToken) {
                    // If we got a new token, store it
                    const newToken = response.data.accessToken;
                    localStorage.setItem('accessToken', newToken);

                    // Also store refresh token if present
                    if (response.data?.refreshToken) {
                        localStorage.setItem('refreshToken', response.data.refreshToken);
                    }

                    // Set as default header for all future requests
                    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

                    // Update authorization header for the current request
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                    // Process any queued requests with the new token
                    processQueue(null, newToken);

                    // Retry the original request
                    return api(originalRequest);
                } else {
                    // If response doesn't contain token, check if it's a public endpoint
                    if (originalRequest.url && isPublicEndpoint(originalRequest.url)) {
                        // For public endpoints, just retry without authentication
                        delete originalRequest.headers['Authorization'];
                        return api(originalRequest);
                    }

                    // For protected endpoints, handle the error
                    const refreshError = new Error('Failed to refresh token - no token in response');
                    processQueue(refreshError);

                    // Only clear credentials if we've tried multiple times
                    if (refreshAttemptCount >= MAX_REFRESH_ATTEMPTS) {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('user');

                        // Only redirect if not already on auth pages
                        if (!window.location.pathname.includes('/signin') &&
                            !window.location.pathname.includes('/signup')) {
                            window.location.href = '/account/signin';
                        }
                    }

                    return Promise.reject(refreshError);
                }
            } catch (error) {
                // Check if it's a public endpoint - if so, just continue without authentication
                const isPublicEndpoint = (url: string) => {
                    return url.includes('/auth/') ||
                        url.includes('/lesson-time') ||
                        url.includes('/timetable/weeks-range') ||
                        url.includes('/timetable/semester') ||
                        url.includes('/admin/rooms') ||
                        url.includes('/timetable/by-week');
                };

                if (originalRequest.url && isPublicEndpoint(originalRequest.url)) {
                    // For public endpoints, retry without authentication
                    console.log("Public endpoint detected, continuing without authentication");
                    delete originalRequest.headers['Authorization'];
                    processQueue(null);
                    return api(originalRequest);
                }

                processQueue(error);
                console.error("Error refreshing token:", error);

                // Only clear credentials if we've tried multiple times
                if (refreshAttemptCount >= MAX_REFRESH_ATTEMPTS) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('user');

                    // Only redirect if not already on auth pages
                    if (!window.location.pathname.includes('/signin') &&
                        !window.location.pathname.includes('/signup')) {
                        window.location.href = '/account/signin';
                    }
                }

                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(err);
    }
);