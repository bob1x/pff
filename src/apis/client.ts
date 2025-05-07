// src/apis/client.ts
import axios from 'axios'
import authApi from './authApi'

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
})

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

API.interceptors.response.use(
    (res) => res,

    async (error) => {
        const originalRequest = error.config
        const status = error.response?.status

        // 1) If it's a 401 *and* we haven't retried yet, try to refresh
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                const { access } = await authApi.refresh()
                originalRequest.headers.Authorization = `Bearer ${access}`
                return API(originalRequest)   // replay the original request
            } catch (refreshError) {
                // if refresh fails, clear everything and force login
                localStorage.clear()
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }

        // 2) If it's a 403, they genuinely aren’t allowed → unauthorized page
        if (status === 403) {
            window.location.href = '/unauthorized'
            return Promise.reject(error)
        }

        // 3) All other errors bubble up
        return Promise.reject(error)
    }
)

export default API
