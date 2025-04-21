// src/apis/client.ts
import axios from 'axios';
import authApi from './authApi';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically attach token
API.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Retry on 401 with refresh
API.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Avoid infinite loop
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { access } = await authApi.refresh();
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return API(originalRequest); // retry original request
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default API;
