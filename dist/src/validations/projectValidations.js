import z from "zod";
export const vCreateProject = z.object({
<<<<<<< HEAD
    title: z.string().min(6, { message: "First name required" }),
    description: z.string().min(2, { message: "Description is required" }),
});
=======
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string",
    }).min(6, { message: "Title name required" }),
    description: z.string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string",
    }).min(5, { message: "Description is required" }),
    is_active: z.boolean().optional()
    // userIDs:z.array(z.number()).min(1,{message:"userId is required"}),
    // project_id:z.number({required_error: "Project ID is required",
    //   invalid_type_error: "Project ID must be a number",}).optional()
});
export const vUpdateProject = vCreateProject;
>>>>>>> 017e6737290c9832a0f859a94590d3b404d6e14d
