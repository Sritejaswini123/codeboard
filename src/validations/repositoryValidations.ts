import { z } from "zod";

export const vCreateRepository = z.object({
    project_id: z
      .number({
        required_error: "ProjectId is required",
        invalid_type_error: "ProjectId must be a Number",
    })
  .min(1, { message: "ProjectId must be a positive integer" }),

  title: z.string({
    required_error: "Repository name is required",
    invalid_type_error: "Repository name must be a string",
  }).min(1, { message: "Repository name cannot be empty" }),

  description: z.string({
    required_error: "Repository description is required",
    invalid_type_error: "Repository description must be a string",
  }).min(5, { message: "Repository description cannot be empty" }).optional(),

  link: z
      .string({
        required_error: "repository link  is required",
        invalid_type_error: "repository link must be a string",
      })
      .url({ message: "Repository link must be a valid URL" }),

});
export type ValidatedRepository = z.infer<typeof vCreateRepository>;

