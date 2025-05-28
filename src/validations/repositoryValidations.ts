import { z } from "zod";

export const vCreateRepository = z.object({
  project_id: z.number().min(1, { message: "Project ID must be a positive integer" }),
  repository_name: z.string().min(1, { message: "Repository name cannot be empty" }).optional(),
  repository_link: z.string().url({ message: "Repository link must be a valid URL" }),
});

export type ValidatedRepository = z.infer<typeof vCreateRepository>;
