import { z } from "zod";

export const createPageSchema = z.object({
  title: z.string().min(2, "Page title must be at least 2 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-/]*$/, "Slug can only contain lowercase letters, numbers, hyphens, and slashes"),
  description: z.string().max(160, "SEO description should not exceed 160 characters").optional(),
  status: z.enum(["Draft", "Published"]).default("Draft"),
});

export const updatePageSchema = z.object({
  title: z.string().min(2, "Page title must be at least 2 characters").optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-/]*$/, "Slug can only contain lowercase letters, numbers, hyphens, and slashes")
    .optional(),
  description: z.string().max(160, "SEO description should not exceed 160 characters").optional(),
  status: z.enum(["Draft", "Published"]).optional(),
});

export type CreatePageSchemaInput = z.infer<typeof createPageSchema>;
export type UpdatePageSchemaInput = z.infer<typeof updatePageSchema>;
