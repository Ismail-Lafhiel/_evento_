import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import api from "./api.service";

const TOKEN_COOKIE_NAME = "access_token";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  fullname: string;
}

export interface RegisterData {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  statusCode: number;
  message: string;
  data: {
    access_token: string;
    user: User;
  };
}

export const authService = {
  register: async (userData: RegisterData) => {
    try {
      const response = await api.post("/users/register", userData);
      return response.data;
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  login: async (username: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>("/users/login", {
        username,
        password,
      });

      const { access_token, user } = response.data.data;

      // Store the token
      Cookies.set(TOKEN_COOKIE_NAME, access_token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      // Store user data
      localStorage.setItem("user", JSON.stringify(user));

      return { access_token, user };
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  logout: () => {
    Cookies.remove(TOKEN_COOKIE_NAME);
    localStorage.removeItem("user");
  },

  getToken: () => {
    return Cookies.get(TOKEN_COOKIE_NAME);
  },

  isAuthenticated: () => {
    const token = Cookies.get(TOKEN_COOKIE_NAME);
    if (!token) return false;

    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch {
      return false;
    }
  },

  getCurrentUser: (): User | null => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getUserRole: (): string | null => {
    const user = authService.getCurrentUser();
    return user?.role || null;
  },

  // Updated setupAxiosInterceptors to work with the api instance
  setupAxiosInterceptors: () => {
    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          authService.logout();
        }
        return Promise.reject(error);
      }
    );
  },
};
