import z from "zod";
export const vCreateProject = z.object({
    title: z.string().min(3, { message: "First name must be at least 3 characters long" }),
    description: z.string().min(3, { message: "Last name must be at least 3 characters long" }),
    assigned_to: z.number().min(1, { message: "Invalid email user_id" }),
});
