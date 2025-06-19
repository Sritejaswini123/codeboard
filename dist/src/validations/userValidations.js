import z from "zod";
export const vCreateUser = z.object({
    first_name: z.string({
        required_error: "First name is required",
        invalid_type_error: "First name must be a string",
    }).min(3, { message: "First name must be at least 3 characters long" })
        .transform((val) => val.trim()),
    last_name: z.string({
        required_error: "Last name is required",
        invalid_type_error: "Last name must be a string",
    })
        .min(3, { message: "Last name must be at least 3 characters long" })
        .transform((val) => val.trim())
        .optional(),
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }).email({ message: "Invalid email address" })
        .transform((val) => val.trim()),
    password: z.string({
        required_error: "password is required",
        invalid_type_error: "password must be a string",
    }).min(8, { message: "Minumum 8 characters required" })
        .transform((val) => val.trim()),
    is_active: z.boolean().default(true),
    phone: z.string({
        required_error: "Phone number is required",
        invalid_type_error: "Phone number must be a string",
    })
        .min(10, { message: "Phone number must be at least 10 digits" })
        .max(16, { message: "Phone number can't exceed 15 digits" })
        .transform((val) => val.trim()),
    dob: z.string({
        required_error: "Date of birth is required",
        invalid_type_error: "Date of birth must be a string",
    })
        .min(1, { message: "Date of birth is required" })
        .transform((val) => val.trim()),
    doj: z.string({
        required_error: "Date of joining is required",
        invalid_type_error: "Date of joining must be a string",
    }).min(1, { message: "Date of joining is required" })
        .transform((val) => val.trim()),
    designation: z.string({
        required_error: "Designation is required",
        invalid_type_error: "Designation must be a string",
    })
        .min(3, { message: "Designation must be at least 3 characters long" })
        .transform((val) => val.trim()),
}).superRefine((data, ctx) => {
    const dobDate = new Date(data.dob);
    if (isNaN(dobDate.getTime())) {
        ctx.addIssue({
            path: ["dob"],
            code: z.ZodIssueCode.custom,
            message: "Invalid date of birth",
        });
    }
    const dojDate = new Date(data.doj);
    if (isNaN(dojDate.getTime())) {
        ctx.addIssue({
            path: ["doj"],
            code: z.ZodIssueCode.custom,
            message: "Invalid date of joining",
        });
    }
});
export const vSignUp = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128),
    name: z.string().min(2).max(255),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    doj: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export const vSignIn = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128),
    rememberMe: z.boolean().optional().default(true),
});
export const vVerifyEmail = z.object({
    token: z.string().min(1),
});
export const loginSchema = z.object({
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }).email({ message: "Invalid email address" })
        .transform((val) => val.trim()),
    password: z.string({
        required_error: "password is required",
        invalid_type_error: "password must be a string",
    }).min(8, { message: "Minumum 8 characters required" })
        .transform((val) => val.trim()),
});
