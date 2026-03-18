import { z } from "zod";

export const ticketSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title too long"),

  description: z.string().min(5, "Description must be at least 5 characters"),

  priority: z.string().min(1, "Priority is required"),

  departmentId: z
    .number({ invalid_type_error: "Department is required" })
    .min(1, "Department is required"),
});
