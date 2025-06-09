import { z } from "zod";
export const vCreateUserProject = z.object({
    // user_id: z.number().min(1, { message: "User ID should not be empty" }),
    project_id: z.number().min(1, { message: "Project ID should not be empty" }),
    userIds: z.array(z.number().int().positive()).nonempty(),
});
