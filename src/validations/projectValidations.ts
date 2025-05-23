import z from "zod";

export const vCreateProject = z.object({
  title: z.string().min(6, { message: "First name required" }),
  description: z.string().min(10, { message: "Description is required" }),
  assigned_to: z.number().min(1, { message: "Invalid user_id" }),
});

export type ValidatedProject = z.infer<typeof vCreateProject>;