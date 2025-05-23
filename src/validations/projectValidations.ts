import z from "zod";

export const vCreateProject = z.object({
  title: z.string({ required_error: 'Project_title is required' }).min(3, { message: "Project title must be more than 3 characters long" }),
  description: z.string({ required_error: 'Description  is required' }).min(3, { message: "Description must be more than 3 characters long" })
});

export const vUpdateProject=vCreateProject;
export type ValidatedCreateProject = z.infer<typeof vCreateProject>;
export type ValidatedUpdateProject=z.infer<typeof vUpdateProject>;