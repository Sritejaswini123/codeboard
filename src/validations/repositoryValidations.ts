import z from "zod";
export const vAddRepository = z.object({
    project_id: z.number().min(1,{message:"project id should not be empty"}),
    repository_name:z.string({required_error: "Repo name is required",
    invalid_type_error: "Repo name must be a string",}).min(3,{message:"Repository name required and more than 3 characters"}),
    repository_url:z.string().url({ message: "Repo url must be a valid URL" }),
})
export type validatedAddRepository = z.infer<typeof vAddRepository>