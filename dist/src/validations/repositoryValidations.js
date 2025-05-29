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
// import z from "zod";
// export const vCreateUser = z.object({
//   first_name: z.string({
//     required_error: "First name is required",
//     invalid_type_error: "First name must be a string",
//   })
//     .min(3, { message: "First name must be at least 3 characters long" }),
//   last_name: z.string({
//     required_error: "Last name is required",
//     invalid_type_error: "Last name must be a string",
//   })
//     .min(3, { message: "Last name must be at least 3 characters long" })
//     .optional(),
//   email: z.string({
//     required_error: "Email is required",
//     invalid_type_error: "Email must be a string",
//   }).email({ message: "Invalid email address" }),
//   is_active: z.boolean().default(true),
//   phone: z.string({
//     required_error: "Phone number is required",
//     invalid_type_error: "Phone number must be a string",
//   })
//     .min(10, { message: "Phone number must be at least 10 digits" })
//     .max(16, { message: "Phone number can't exceed 15 digits" }),
//   dob: z.string({
//     required_error: "Date of birth is required",
//     invalid_type_error: "Date of birth must be a string",
//   })
//     .min(1, { message: "Date of birth is required" }),
//   doj: z.string({
//     required_error: "Date of joining is required",
//     invalid_type_error: "Date of joining must be a string",
//   }).min(1, { message: "Date of joining is required" }),
//   designation: z.string({
//     required_error: "Designation is required",
//     invalid_type_error: "Designation must be a string",
//   })
//   .min(3, { message: "Designation must be at least 3 characters long" }),
// }).superRefine((data, ctx) => {
//   const dobDate = new Date(data.dob);
//   if (isNaN(dobDate.getTime())) {
//     ctx.addIssue({
//       path: ["dob"],
//       code: z.ZodIssueCode.custom,
//       message: "Invalid date of birth",
//     });
//   }
//   const dojDate = new Date(data.doj);
//   if (isNaN(dojDate.getTime())) {
//     ctx.addIssue({
//       path: ["doj"],
//       code: z.ZodIssueCode.custom,
//       message: "Invalid date of joining",
//     });
//   }
// });
// export type ValidatedCreateUser = z.infer<typeof vCreateUser>;
