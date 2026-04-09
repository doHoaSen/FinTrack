import axios from "axios";
import { useAuthStore } from "../../store/authStore";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    await api.post("/api/auth/refresh");
                    isRefreshing = false;
                    return api(originalRequest);
                } catch {
                    isRefreshing = false;
                    useAuthStore.getState().logout();
                    window.location.href = "/login";
                }
            }
        }

        return Promise.reject(error);
    }
);
