import api from "./api.service";
import { Event } from "../types/types";

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export const eventService = {
  // Get all events
  // src/services/event.service.ts

  getAllEvents: async (
    page: number = 1,
    limit: number = 10,
    search: string = ""
  ) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await api.get(`/events?${params}`);
      return response.data;
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

  updateEvent: async (
    id: string,
    eventData: Omit<Event, "_id" | "createdAt" | "updatedAt">
  ): Promise<Event> => {
    try {
      const response = await api.put<ApiResponse<Event>>(
        `/events/${id}`,
        eventData
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update event"
      );
    }
  },

  deleteEvent: async (id: string): Promise<void> => {
    try {
      await api.delete(`/events/${id}`);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete event"
      );
    }
  },

  addParticipant: async (eventId: string, userId: string): Promise<Event> => {
    try {
      const response = await api.post<ApiResponse<Event>>(
        `/events/${eventId}/participants/${userId}`
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Error details:", error.response);
      throw new Error(
        error.response?.data?.message || "Failed to add participant"
      );
    }
  },

  getEventWithParticipants: async (id: string): Promise<Event> => {
    try {
      const response = await api.get<ApiResponse<Event>>(`/events/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error("Error details:", error.response);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch event with participants"
      );
    }
  },

  removeParticipant: async (
    eventId: string,
    userId: string
  ): Promise<Event> => {
    try {
      const response = await api.delete<ApiResponse<Event>>(
        `/events/${eventId}/${userId}`
      );
      return response.data.data;
    } catch (error: any) {
      console.error("Error details:", error.response);
      throw new Error(
        error.response?.data?.message || "Failed to remove participant"
      );
    }
  },
};
