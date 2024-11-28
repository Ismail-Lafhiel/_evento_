import api from "./api.service";
import { Location } from "../types/types";

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export const locationService = {
  // Get all locations
  getAllLocations: async (): Promise<Location[]> => {
    try {
      const response = await api.get<ApiResponse<Location[]>>('/locations');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch locations");
    }
  },

  // Get location by ID
  getLocationById: async (id: string): Promise<Location> => {
    try {
      const response = await api.get<ApiResponse<Location>>(`/locations/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch location");
    }
  },

  // Create new location
  createLocation: async (locationData: Omit<Location, '_id' | 'createdAt' | 'updatedAt'>): Promise<Location> => {
    try {
      const response = await api.post<ApiResponse<Location>>('/locations', locationData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create location");
    }
  },

  // Update location
  updateLocation: async (id: string, locationData: Partial<Location>): Promise<Location> => {
    try {
      const response = await api.put<ApiResponse<Location>>(`/locations/${id}`, locationData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update location");
    }
  },

  // Delete location
  deleteLocation: async (id: string): Promise<void> => {
    try {
      await api.delete(`/locations/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete location");
    }
  }
};
