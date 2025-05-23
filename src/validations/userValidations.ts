import z from "zod";

export const vCreateUser = z.object({
  first_name: z.string({ required_error: 'First_Name is required' }).min(3, { message: 'First_Name must be at least 3 characters long' }),
  last_name: z.string({ required_error: 'last_Name is required' }).min(3, { message: 'Last_Name must be at least 3 characters long' }).optional(),
  email: z.string({ required_error: 'emaail is required' }).email({ message: 'Invalid email format' }),
  phone: z.string({ required_error: 'phone is required' }).regex(/^\d+$/, { message: 'Phone number must contain only digits' })
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number must be at most 15 digits' }),
  doj: z.string({ required_error: 'doj is required' }).regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date of joining must be in YYYY-MM-DD format' })
    .refine(val => !isNaN(new Date(val).getTime()), {
      message: 'Date of joining must be a valid date',
    }),
  dob: z.string({ required_error: 'dob  is required' }).regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date of birth must be in YYYY-MM-DD format' })
    .refine(val => {
      const age = new Date().getFullYear() - new Date(val).getFullYear();
      return age >= 18;
    }, { message: 'Date of birth must be a valid past date' }),
  designation: z.string({ required_error: 'designation is required' }).min(3, { message: 'Designation must be at least 3 characters long' }),
  is_active: z.boolean().default(true),
})
export const vUpdateUser = vCreateUser;
export type ValidatedCreateUser = z.infer<typeof vCreateUser>;
export type ValidatedUpdateUser = z.infer<typeof vUpdateUser>;