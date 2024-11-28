import { User } from "../types/types";
import api from "./api.service";

export const userService = {
  getAllParticipants: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>("/users/participants");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch participants"
      );
    }
  },
};
