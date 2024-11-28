import api from "./api.service";
import { Event } from "../types/types";

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export const eventService = {
  // Get all events
  getAllEvents: async (): Promise<Event[]> => {
    try {
      const response = await api.get<ApiResponse<Event[]>>(
        "/events?populate=location"
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  },

  // Get event by ID
  getEventById: async (id: string): Promise<Event> => {
    try {
      const response = await api.get<ApiResponse<Event>>(`/events/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch event");
    }
  },

  // Create new event
  createEvent: async (
    eventData: Omit<Event, "_id" | "createdAt" | "updatedAt">
  ): Promise<Event> => {
    try {
      const response = await api.post<ApiResponse<Event>>("/events", eventData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to create event"
      );
    }
  },
};
