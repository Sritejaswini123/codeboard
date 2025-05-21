import fs from "fs/promises";
import path from "path";
import db from "../database/db";
import { users } from "../database/schemas/users";
import { vCreateUser } from "../validations/userValidations";
import { Context } from "hono";

export const seedRealUserHandler = [ async (c: Context) => {
    try {
      const filePath = path.join(process.cwd(), "src", "data", "users.json");
      const jsonData = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(jsonData);

      const validUsers = [];
      const errors = [];

      for (const entry of parsed) {
        const result = vCreateUser.safeParse(entry);
        if (result.success) {
          validUsers.push({
            ...result.data,
            dob: new Date(result.data.dob),
            doj: new Date(result.data.doj),
          });
        } else {
          errors.push({
            email: entry.first_name,
            issues: result.error.format(),
          });
        }
      }

      if (validUsers.length > 0) {
        await db.insert(users).values(validUsers).onConflictDoNothing();
      }

      return c.json({
        success: true,
        inserted: validUsers.length,
        failed: errors.length,
        errors,
      });
    } catch (error) {
      console.error("Seeding error:", error);
      return c.json({ success: false, message: "Failed to seed users" }, 500);
    }
  }
];
