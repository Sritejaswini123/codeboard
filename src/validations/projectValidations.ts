import z from "zod";

export const vCreateProject = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }).min(6, { message: "Title name required" }),

  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  }).min(10, { message: "Description is required" }),
  
  userIDs:z.array(z.number()).min(1,{message:"userId is required"}),
  
  project_id:z.number({required_error: "Project ID is required",
    invalid_type_error: "Project ID must be a number",}).optional()
  
  
});
export const vUpdateProject =vCreateProject
export type ValidatedCreateProject = z.infer<typeof vCreateProject>;
export type validatedProjectData=z.infer<typeof vUpdateProject>;
