import z from "zod";
export const vCreateProject = z.object({
    title: z.string().min(5, { message: "title is required" }),
    description: z.string().min(3, { message: "Description is required" }),
    is_active: z.boolean().default(true).optional()
});
