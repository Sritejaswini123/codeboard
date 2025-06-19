import { z } from "zod";
export const vCreateRepositories = z.object({
    project_id: z.number({
        required_error: "project id is required",
        invalid_type_error: "project id must be a number",
    })
        .min(0, { message: "project id cannot be negative" }),
    title: z.string({
        required_error: "title is required",
        invalid_type_error: "title must be a string",
    }).min(6, { message: "title is required" })
        .transform((val) => val.trim()),
    link: z.string({
        required_error: "link is required",
        invalid_type_error: "link must be a string",
    }).url({ message: "link must be a valid URL" })
        .transform((val) => val.trim()),
    description: z.string().transform((val) => val.trim()).optional()
    //    projectIds:z.number().min(1,{message:"Minimum 1 project id is required"}),
    //    is_active:z.boolean().default(true)
});
