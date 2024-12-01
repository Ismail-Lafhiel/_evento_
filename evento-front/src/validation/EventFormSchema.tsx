import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const eventFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  sportType: z
    .string()
    .min(2, "Sport type must be at least 2 characters")
    .max(50, "Sport type cannot exceed 50 characters"),

  date: z.string().refine((date) => {
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }, "Event date must be today or in the future"),

  location: z
    .string()
    .min(1, "Please select a location")
    .refine((val) => objectIdRegex.test(val), "Invalid location selected"),

  capacity: z.coerce
    .number()
    .min(1, "Capacity is required")
    .max(200, "Capacity cannot exceed 200"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
});

export type EventFormData = z.infer<typeof eventFormSchema>;
