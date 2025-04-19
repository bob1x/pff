import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + 'api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

API.interceptors.request.use(config => {
    const url = config.url || '';
    // Don’t attach token on auth routes:
    if (
        url.startsWith('/auth/signup') ||
        url.startsWith('/auth/login') ||
        url.startsWith('/auth/refresh')
    ) {
        return config;
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
        // Ensure headers object exists
        config.headers = config.headers ?? {};
        // Use the Bearer scheme for JWT
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default API;