import z from "zod";
export const vCreateUser = z.object({
    first_name: z.string({
        required_error: "First name is required",
        invalid_type_error: "First name must be a string",
    }).min(3, { message: "First name must be at least 3 characters long" }),
    last_name: z.string({
        required_error: "Last name is required",
        invalid_type_error: "Last name must be a string",
    }).min(3, { message: "Last name must be at least 3 characters long" }).optional(),
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }).email({ message: "Invalid email address" }).refine((val) => {
        const allowedDomains = ["gmail.com", "yahoo.com", "orotron.com"];
        const domain = val.split("@")[1];
        return allowedDomains.includes(domain);
    }, { message: "Email domain not allowed" }),
    phone: z.string({
        required_error: "Phone number is required",
        invalid_type_error: "Phone number must be a string",
    })
        .min(10, { message: "Phone number must be at least 10 digits long" })
        .max(15, { message: "Phone number must be at most 15 digits long" })
        .optional(),
    designation: z.string({
        required_error: "Designation is required",
        invalid_type_error: "Designation must be a string",
    }).min(3, { message: "Designation must be at least 3 characters long" }),
    dob: z.string({
        required_error: "Date of birth is required",
        invalid_type_error: "Date of birth must be a string",
    }).regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in YYYY-MM-DD format" })
        .refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date of birth format",
    }),
    doj: z.string({
        required_error: "Date of joining is required",
        invalid_type_error: "Date of joining must be a string",
    }).regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in YYYY-MM-DD format" }).refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date of joining format",
    }),
    userProfileImage: z.string({
        required_error: "User profile image key is required",
        invalid_type_error: "User profile image key must be a string",
    })
        .min(5, "Key must be at least 5 characters")
        .max(255, "Key is too long")
        .regex(/^userprofiles\/[a-zA-Z0-9/_\-.]+$/, "Key must start with 'userprofiles/' and only contain valid characters"),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    })
    // .min(8, "Password must be at least 8 characters")
    // .max(255, "Password is too long")
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    //   message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    // }),
});
