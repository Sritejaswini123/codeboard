import z from "zod";
export const vAddRepository = z.object({
    project_id: z.number().min(1,{message:"project id should not be empty"}),
    title:z.string({required_error: "Repo title is required",
    invalid_type_error: "Repo title must be a string",}).min(3,{message:"Repository title required and more than 3 characters"}),
    repo_link:z.string().url({ message: "Repo link must be a valid URL" }),
    description:z.string().optional()
})
export type validateAddRepository = z.infer<typeof vAddRepository>