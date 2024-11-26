import axios from "axios";

const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL;

export interface RegisterData {
  fullname: string;
  username: string;
  email: string;
  password: string;
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
};
