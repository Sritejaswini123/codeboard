import { z } from "zod";

export const vCreateuserProject=z.object({
    user_id:z.number().nonnegative().min(1,{message:"User ID should not be empty"}),
    project_id:z.number().nonnegative().min(1,{message:"Project ID should not be empty"})
})

export type ValidatedUserProject = z.infer<typeof vCreateuserProject>;