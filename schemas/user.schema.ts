import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["Admin", "Editor", "Viewer"], {
    message: "Role must be Admin, Editor, or Viewer",
  }),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  role: z.enum(["Admin", "Editor", "Viewer"]).optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});

export type CreateUserSchemaInput = z.infer<typeof createUserSchema>;
export type UpdateUserSchemaInput = z.infer<typeof updateUserSchema>;
