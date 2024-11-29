import { User } from "../types/types";
import api from "./api.service";

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

interface ParticipantsResponse {
  participants: User[];
  count: number;
}
export const userService = {
  getAllParticipants: async (): Promise<ParticipantsResponse> => {
    try {
      const response = await api.get<ApiResponse<ParticipantsResponse>>(
        "/users/participants"
      );
      if (!Array.isArray(response.data.data.participants)) {
        throw new Error("Invalid response format");
      }
      return response.data.data;
    } catch (error: any) {
      console.error("API Error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch participants"
      );
    }
  },
};
