import { z } from "zod";

export const vCreateCommit = z.object({
 
  month: z.string({
    required_error: "Month is required",
    invalid_type_error: "Month must be a string",
  })
  .min(1, { message: "Month cannot be empty" }) 
  .refine((val) => {
    const monthNumber = parseInt(val.trim(), 10);
    return !isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12;
  }, {
    message: "Month must be a valid number between 1 and 12",
  }),


  date: z.string({
    required_error: "Date is required",
    invalid_type_error: "Date must be a string",
  }).min(1, { message: "Date cannot be empty" }), // ISO date string

 time: z.string({
  required_error: "Time is required",
  invalid_type_error: "Time must be a string",
 }).regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
  message: "Time must be in HH:mm format (24-hour)",
}),

  user_id: z.number({
    required_error: "User ID is required",
    invalid_type_error: "User ID must be a number",
  }).min(1, { message: "User ID must be a positive integer" }),

  project_id: z.number({
    required_error: "Project ID is required",
    invalid_type_error: "Project ID must be a number",
  }).min(1, { message: "Project ID must be a positive integer" }),

  repository_id: z.number({
    required_error: "Repository ID is required",
    invalid_type_error: "Repository ID must be a number",
  }).min(1, { message: "Repository ID must be a positive integer" }),

  lines_of_code: z.number({
    required_error: "Lines of code is required",
    invalid_type_error: "Lines of code must be a number",
  }).min(1, { message: "Lines of code must be at least 1" }),

  commit_message: z.string({
    required_error: "Commit message is required",
    invalid_type_error: "Commit message must be a string",
  }).min(1, { message: "Commit message cannot be empty" }),

  commit_link: z.string({
    required_error: "Commit link is required",
    invalid_type_error: "Commit link must be a string",
  }).min(1, { message: "Commit link cannot be empty"
  }).url({ message: "Commit link must be a valid URL" }),
});

export type ValidatedCreateCommit = z.infer<typeof vCreateCommit>;
