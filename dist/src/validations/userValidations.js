import z from "zod";
export const vCreateUser = z.object({
    first_name: z.string({
        required_error: "First name is required",
        invalid_type_error: "First name must be a string",
<<<<<<< HEAD
    }).min(3, { message: "First name must be at least 3 characters long" }),
    last_name: z.string({
        required_error: "Last name is required",
        invalid_type_error: "Last name must be a string",
    }).min(3, { message: "Last name must be at least 3 characters long" }).optional(),
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }).email({ message: "Invalid email address" })
        .refine(val => {
        const allowedDomains = ["gmail.com", "yahoo.com", "orotron.com"];
        const domain = val.split("@")[1];
        return allowedDomains.includes(domain);
    }, { message: "Email domain not allowed" }),
=======
    })
        .min(3, { message: "First name must be at least 3 characters long" }),
    last_name: z.string({
        required_error: "Last name is required",
        invalid_type_error: "Last name must be a string",
    })
        .min(3, { message: "Last name must be at least 3 characters long" })
        .optional(),
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }).email({ message: "Invalid email address" }),
    is_active: z.boolean().default(true),
>>>>>>> 017e6737290c9832a0f859a94590d3b404d6e14d
    phone: z.string({
        required_error: "Phone number is required",
        invalid_type_error: "Phone number must be a string",
    })
<<<<<<< HEAD
        .min(10, { message: "Phone number must be at least 10 digits long" })
        .max(15, { message: "Phone number must be at most 15 digits long" })
        .optional(),
    dob: z.string({
        required_error: "Date of birth is required",
        invalid_type_error: "Date of birth must be a string",
    }).min(1, { message: "Date of birth is required" }),
=======
        .min(10, { message: "Phone number must be at least 10 digits" })
        .max(16, { message: "Phone number can't exceed 15 digits" }),
    dob: z.string({
        required_error: "Date of birth is required",
        invalid_type_error: "Date of birth must be a string",
    })
        .min(1, { message: "Date of birth is required" }),
>>>>>>> 017e6737290c9832a0f859a94590d3b404d6e14d
    doj: z.string({
        required_error: "Date of joining is required",
        invalid_type_error: "Date of joining must be a string",
    }).min(1, { message: "Date of joining is required" }),
    designation: z.string({
        required_error: "Designation is required",
        invalid_type_error: "Designation must be a string",
<<<<<<< HEAD
    }).min(3, { message: "Designation must be at least 3 characters long" }),
=======
    })
        .min(3, { message: "Designation must be at least 3 characters long" }),
>>>>>>> 017e6737290c9832a0f859a94590d3b404d6e14d
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
