import { z } from "zod";
export const vCreateCommit = z.object({
    user_project_id: z.number().min(1, { message: "Project ID must be a positive integer", }),
    lines_of_code: z.number().min(0, { message: "Lines of code cannot be negative", }),
    commit_link: z.string().url({ message: "Commit link must be a valid URL", }),
    commit_name: z.string().min(1, { message: "Commit name cannot be empty", }),
});
