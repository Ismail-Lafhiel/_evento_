import axios from "axios";
import { authService } from "./auth.service";

const api = axios.create({
  baseURL: import.meta.env.VITE_EVENTO_URL,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
    }
    return Promise.reject(error);
  }
);

export default api;
