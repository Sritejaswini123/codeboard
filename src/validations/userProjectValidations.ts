// validators/userProjects.ts
import z from "zod";

export const vCreateUserProject = z.object({
user_id: z.array(z.number()).min(1, "At least one user must be provided"),
  project_id: z.number({ required_error: "project_id is required" }),
});

export const vUpdateUserProject = z.object({
  user_id: z.number().optional(),
  project_id: z.number().optional(),
});

export type ValidatedCreateUserProject = z.infer<typeof vCreateUserProject>;
export type ValidatedUpdateUserProject = z.infer<typeof vUpdateUserProject>;
