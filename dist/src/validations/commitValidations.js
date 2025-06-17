import { z } from "zod";
const validMonths = [
    "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december",
    "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"
];
export const vCreateCommit = z.object({
    month: z.string({
        required_error: "Month is required",
        invalid_type_error: "Month must be a string",
    })
        .min(1, { message: "Month cannot be empty" })
        .transform(val => val.trim().toLowerCase())
        .refine(val => validMonths.includes(val), {
        message: "Month must be a valid name (e.g. January or Jan)",
    }),
    date: z.string({
        required_error: "Date is required",
        invalid_type_error: "Date must be a string",
    })
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Date must be in YYYY-MM-DD format"
    }).refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date"
    }),
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
    }).min(1, { message: "Commit link cannot be empty",
    }).url({ message: "Commit link must be a valid URL" }),
});
