import { z } from "zod";

export const vCreateCommit = z.object({

    user_id: z
      .number({
        required_error: "UserId is required",
        invalid_type_error: "UserId must be a Number",
      })
      .min(1, { message: "UserId must be a positive integer" }),
      
    project_id: z
      .number({
        required_error: "ProjectId is required",
        invalid_type_error: "ProjectId must be a Number",
      })
      .min(1, { message: "ProjectId must be a positive integer" }),

    repository_id: z
      .number({
        required_error: "repositoryid is required",
        invalid_type_error: "repositoryid must be a Number",
      })
      .min(1, { message: "repositoryid must be a positive integer" }),

    month: z
      .string({
        required_error: "Month is required",
        invalid_type_error: "Month must be a string",
      })
      .min(1, { message: "Month of commit is required" }),

    date: z
      .string({
        required_error: "Date is required",
        invalid_type_error: "Date must be a string",
      })
      .min(1, { message: "Date of commit is required" }),

    time: z
      .string({
        required_error: "Time is required",
        invalid_type_error: "Time must be a string",
      })
      .min(1, { message: "Time is required" }),

    lines_of_code: z
      .number({
        required_error: "Lines of code is required",
        invalid_type_error: "Lines of code must be a number",
      })
      .min(0, { message: "Lines of code cannot be negative" }),

    commit_link: z
      .string({
        required_error: "Commit name is required",
        invalid_type_error: "Commit name must be a string",
      })
      .url({ message: "Commit link must be a valid URL" })
      .transform((val) => val.trim()),

    commit_message: z
      .string({
        required_error: "Commit message  is required",
        invalid_type_error: "Commit message must be a string",
      })
      .min(1, { message: "Commit message cannot be empty" })
      .transform((val) => val.trim()),
  })
  .superRefine((data, ctx) => {
    // (YYYY-MM-DD)
    const parsedDate = new Date(data.date);
    if (isNaN(parsedDate.getTime()) || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
      ctx.addIssue({
        path: ["date"],
        code: z.ZodIssueCode.custom,
        message: "Invalid date format. Use YYYY-MM-DD.",
      });
    }

    const isValidTime = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(data.time);
    if (!isValidTime) {
      ctx.addIssue({
        path: ["time"],
        code: z.ZodIssueCode.custom,
        message: "Invalid time format.Use HH:mm:ss (24-hour).",
      });
    }

    // Validate month (01-12 or full/short name)
    const validMonths = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
      "jan",
      "feb",
      "mar",
      "apr",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    if (!validMonths.includes(data.month.toLowerCase())) {
      ctx.addIssue({
        path: ["month"],
        code: z.ZodIssueCode.custom,
        message:
          "Invalid month. Use MM (01-12) or month name (like -> January).",
      });
    }
  });

export type ValidatedCreateCommit = z.infer<typeof vCreateCommit>;
