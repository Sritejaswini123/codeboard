import z from "zod";

export const vCreateProject = z.object({
  title: z.string().min(6, { message: "First name required" }),
  description: z.string().min(2, { message: "Description is required" }),
});
export type ValidatedCreateProject = z.infer<typeof vCreateProject>;
