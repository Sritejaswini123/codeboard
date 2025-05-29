import { z } from "zod";

export const vCreateRepositories=z.object({
    project_id:z.number({
        required_error: "project id is required",
        invalid_type_error: "project id must be a number",
      })
    .min(0, { message: "project id cannot be negative" }),

    repository_name:z.string({
        required_error: "repository_name is required",
        invalid_type_error: "repository_name must be a string",
    }).min(6, { message: "repository_name is required" }),

    repository_url:z.string({
        required_error: "repository_url is required",
        invalid_type_error: "repository_url must be a string",
    }).url({ message: "repository_url must be a valid URL" }),

   projectIds: z.array(z.number()).min(1, "At least one project must be assigned"),

   is_active:z.boolean().default(true)

});


export type ValidatedCreateRepository = z.infer<typeof vCreateRepositories>;