// validators/userProjects.ts
import z from "zod";

export const vCreateUserProject = z.object({
  user_id: z.number({ required_error: "user_id is required" }),
  project_id: z.number({ required_error: "project_id is required" }),
});

export const vUpdateUserProject = z.object({
  user_id: z.number().optional(),
  project_id: z.number().optional(),
});

export type ValidatedCreateUserProject = z.infer<typeof vCreateUserProject>;
export type ValidatedUpdateUserProject = z.infer<typeof vUpdateUserProject>;
