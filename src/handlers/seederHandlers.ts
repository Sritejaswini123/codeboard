import path from "path";
import { Context } from "vm";
import { createRecordMany } from "../../seeder/seederDb";
import { generateFakeUsers } from "../../seeder/userSeeder";
import { CREATED } from "../constants/httpStatusCodes";
import db from "../database/db";
import { users } from "../database/schemas/users";
import factory from "../factory";
import { sendResponse } from "../utils/sendResponse";
import { vCreateUser } from "../validations/userValidations";
import fs from 'fs/promises'
export const seedUsersHandler = factory.createHandlers(async (c) => {
  try {
    const count = Number(c.req.query("count")) || 100;
    const fakeUsers = generateFakeUsers(count);
    const insertedUsers = await createRecordMany(users, fakeUsers);
    if (!Array.isArray(insertedUsers)) {
      throw new TypeError("User insertion failed");
    }
    return sendResponse(c, CREATED, `${insertedUsers.length} users created`, insertedUsers);
  }
  catch (error) {
    console.error("Seeder error:", error);
    return c.json({ error: "Failed to seed users" }, 500);
  }
});






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