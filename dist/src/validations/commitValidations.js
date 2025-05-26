import { z } from "zod";
export const vCreateCommit = z.object({
    month: z.string().min(1, { message: "Month cannot be empty" }),
    date: z.string().min(1, { message: "Date cannot be empty" }), // ISO date string
    time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
        message: "Time must be in HH:mm format (24-hour)",
    }),
    user_id: z.number().min(1, { message: "User ID must be a positive integer" }),
    project_id: z.number().min(1, { message: "Project ID must be a positive integer" }),
    repository_id: z.number().min(1, { message: "Repository ID must be a positive integer" }),
    lines_of_code: z.number().min(1, { message: "Lines of code must be at least 1" }),
    commit_message: z.string().min(1, { message: "Commit message cannot be empty" }),
    commit_link: z.string().url({ message: "Commit link must be a valid URL" }),
});
