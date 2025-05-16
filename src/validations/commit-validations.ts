import { z } from "zod";

export const vCreateCommit = z.object({
  date: z.string().date(), 
  
  time: z.string().time(),
  
  project_id: z.number().min(1,{message: "Project ID must be a positive integer",}),

  user_id: z.number().min(1,{message: "User ID must be a positive integer",}),

  lines_of_code: z.number().min(0, {message: "Lines of code cannot be negative",}),

  commit_link: z.string().url({message: "Commit link must be a valid URL",}),

  commit_name: z.string().min(1, {message: "Commit name cannot be empty",}),
});
export const vUpdatecommit=vCreateCommit;
export type ValidatedCreateProject = z.infer<typeof vCreateCommit>;
export type vUpdatedProject = z.infer<typeof vUpdatecommit>;