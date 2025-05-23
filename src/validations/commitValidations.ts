import { z } from "zod";

export const vCreateCommit = z.object({
  
  user_project_id: z.number().min(1,{message: "Project ID must be a positive integer",}),

  lines_of_code: z.number().min(0, {message: "Lines of code cannot be negative",}),

  commit_link: z.string({ required_error: "url is required" }).min(0,{message: "Commit link must be a valid URL",}),

  commit_name: z.string({ required_error: 'Commit_message is required' }).min(1, {message: "Commit name cannot be empty",}),
});
export type ValidatedCreateCommit = z.infer<typeof vCreateCommit>;
