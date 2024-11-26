import axios from "axios";
import { authService } from "./auth.service";

const api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_SERVICE_URL,
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
