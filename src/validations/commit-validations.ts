import { z } from "zod";

export const vCreateCommit = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {message: "Invalid date format",}), 
  
  time: z.string().refine((val) => /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])$/.test(val), {
    message: "Invalid time format. Expected HH:mm",
  }), 
  
  project_id: z.number().min(1,{message: "Project ID must be a positive integer",}),

  user_id: z.number().min(1,{message: "User ID must be a positive integer",}),

  lines_of_code: z.number().min(0, {message: "Lines of code cannot be negative",}),

  commit_link: z.string().url({message: "Commit link must be a valid URL",}),

  commit_name: z.string().min(1, {message: "Commit name cannot be empty",}),
});