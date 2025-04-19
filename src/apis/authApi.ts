// src/api/authApi.ts
import axios from 'axios';

export interface AuthUser {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    role: 'user' | 'hr';
}

export interface AuthResponse {
    access: string;
    refresh: string;
    user: AuthUser;
    
}

export interface SignupParams {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
}

export interface LoginParams {
    email: string;
    password: string;
}

// Axios instance pointed at your JWT endpoints
const authClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + 'auth/',
    headers: { 'Content-Type': 'application/json' },
});

// Interceptor to attach access token if present
authClient.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const authApi = {
    /** Sign up a new user, store tokens */
    async signup(data: SignupParams): Promise<AuthResponse> {
        const res = await authClient.post<AuthResponse>('signup/', data);
        const { access, refresh, user } = res.data;
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        return { access, refresh, user };
    },

    /** Log in an existing user, store tokens */
    async login(data: LoginParams): Promise<AuthResponse> {
        const res = await authClient.post<AuthResponse>('login/', data);
        const { access, refresh, user } = res.data;
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        return { access, refresh, user };
    },

    /** Refresh the access token using stored refresh token */
    async refresh(): Promise<{ access: string }> {
        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) throw new Error('No refresh token stored');
        const res = await authClient.post<{ access: string }>('refresh/', { refresh });
        const { access } = res.data;
        localStorage.setItem('accessToken', access);
        return { access };
    },

    /** Log out: blacklist refresh token and clear storage */
    async logout(): Promise<void> {
        const refresh = localStorage.getItem('refreshToken');
        if (refresh) {
            try {
                await authClient.post('logout/', { refresh });
            } catch {
                // ignore errors on logout
            }
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
};

export default authApi;
