import z from "zod";
export const vCreateProject = z.object({
    title: z.string({
        required_error: "Project title is required",
        invalid_type_error: "Project title must be a string",
    }).min(3, { message: "Project title must be at least 3 characters long" }),
    description: z.string({
        required_error: "Project description is required",
        invalid_type_error: "Project description must be a string",
    }).min(2, { message: "Description is required" }),
    projectProfile: z.string({
        required_error: "User profile image is required",
        invalid_type_error: "User profile image must be a string",
    }).min(5, " Image url must be at least 5 characters")
        .max(255, "Image Url  is too long")
});
