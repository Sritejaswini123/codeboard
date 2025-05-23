import z from "zod";

export const vCreateProject = z.object({
  title: z.string().min(6, { message: "project title required" }),
  description: z.string().min(10, { message: "Description is required" })
});

export const vUpdateProject=vCreateProject;
export type ValidatedCreateProject = z.infer<typeof vCreateProject>;
export type ValidatedUpdateProject=z.infer<typeof vUpdateProject>;