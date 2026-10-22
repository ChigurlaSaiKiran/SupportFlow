import { z } from "zod";

const baseTicketFields = {
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title too long"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  priorityId: z.coerce.number().min(1, "Priority is required"),
  categoryId: z.coerce.number().min(1, "Category is required"),
  departmentId: z.coerce.number().min(1, "Department is required"),
  assignedToId: z.coerce.number().optional(),
};

export const ticketCreateSchema = z.object(baseTicketFields);

export const ticketEditSchema = z.object({
  ...baseTicketFields,
  statusId: z.coerce.number().min(1, "Status is required"),
});
