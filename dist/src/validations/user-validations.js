import z from "zod";
export const vCreateUser = z.object({
    first_name: z.string().min(3, { message: "First name must be at least 3 characters long" }),
    last_name: z.string().min(3, { message: "Last name must be at least 3 characters long" }).optional(),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 characters long" }).max(15).optional(),
    dob: z.string().min(1, { message: "Date of birth is required" }),
    doj: z.string().min(1, { message: "Date of joining is required" }),
    status: z.string().min(1, { message: "Status is required" }).optional(),
    designation: z.string().min(3, { message: "Designation must be at least 3 characters long" }),
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
