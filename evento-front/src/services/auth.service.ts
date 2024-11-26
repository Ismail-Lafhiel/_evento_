import axios from "axios";
import Cookies from "js-cookie";

const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL;
const TOKEN_COOKIE_NAME = "access_token";

export interface RegisterData {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    email: string;
    fullname: string;
  };
}

export const authService = {
  register: async (userData: RegisterData) => {
    try {
      const response = await axios.post(
        `${AUTH_SERVICE_URL}/auth/register`,
        userData
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || "Registration failed");
      }
      throw new Error("Network error occurred");
    }
  },
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/auth/login`, {
        username,
        password,
      });

      // The token is inside response.data.data.access_token
      const token = response.data.data.access_token;

      // Store the token
      Cookies.set(TOKEN_COOKIE_NAME, token, {
        expires: 1, //day
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      console.log("token:", Cookies.get(TOKEN_COOKIE_NAME));

      return response.data.data;
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response) {
        throw new Error(error.response.data.message || "Login failed");
      }
      throw new Error("Network error occurred");
    }
  },
  logout: () => {
    Cookies.remove(TOKEN_COOKIE_NAME);
  },

  getToken: () => {
    return Cookies.get(TOKEN_COOKIE_NAME);
  },

  isAuthenticated: () => {
    return !!Cookies.get(TOKEN_COOKIE_NAME);
  },
};
