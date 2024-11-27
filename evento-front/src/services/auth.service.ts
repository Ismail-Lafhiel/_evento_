import Cookies from 'js-cookie';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const TOKEN_COOKIE_NAME = 'access_token';
const EVENTO_URL = 'http://localhost:3001'; // adjust as needed

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  fullname: string;
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
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post<AuthResponse>(`${EVENTO_URL}/users/login`, {
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
      localStorage.setItem('user', JSON.stringify(user));

      return { access_token, user };
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  logout: () => {
    Cookies.remove(TOKEN_COOKIE_NAME);
    localStorage.removeItem('user');
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
      const userStr = localStorage.getItem('user');
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

  // Add this method to handle axios interceptors
  setupAxiosInterceptors: () => {
    axios.interceptors.request.use((config) => {
      const token = Cookies.get(TOKEN_COOKIE_NAME);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          authService.logout();
        }
        return Promise.reject(error);
      }
    );
  }
};
