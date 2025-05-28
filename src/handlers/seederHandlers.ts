import type { Context } from "node:vm";

import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

import type { NewUserProject } from "../database/schemas/userProjects";

import { createRecordMany } from "../../seeder/seederDb";
import { generateFakeUsers } from "../../seeder/userSeeder";
import { CREATED } from "../constants/httpStatusCodes";
import db from "../database/db";
import { user_projects } from "../database/schemas/userProjects";
import { users } from "../database/schemas/users";
import factory from "../factory";
import { sendResponse } from "../utils/sendResponse";
import { vCreateProject } from "../validations/projectValidations";
import { vCreateUser } from "../validations/userValidations";

// seed with falso
export const seedUsersHandler = factory.createHandlers(async (c) => {
  try {
    const count = Number(c.req.query("count")) || 100;
    const fakeUsers = generateFakeUsers(count);
    const insertedUsers = await createRecordMany(users, fakeUsers);
    if (!Array.isArray(insertedUsers)) {
      throw new TypeError("User insertion failed");
    }
    return sendResponse(
      c,
      CREATED,
      `${insertedUsers.length} users created`,
      insertedUsers
    );
  } catch (error) {
    console.error("Seeder error:", error);
    return c.json({ error: "Failed to seed users" }, 500);
  }
});

// users seeding
export const seedRealUserBulkDataHandler = [
  async (c: Context) => {
    try {
      const vCreateUserArray = z.array(vCreateUser);

      const filePath = path.join(process.cwd(), "src", "data", "users.json");
      const jsonData = await fs.readFile(filePath, "utf-8");
      const parsedUsers: any[] = JSON.parse(jsonData);

      const validUsersRaw = vCreateUserArray.parse(parsedUsers);

      const validUsers = validUsersRaw.map((user) => ({
        ...user,
        dob: new Date(user.dob),
        doj: new Date(user.doj),
      }));

      if (validUsers.length > 0) {
        await db.insert(users).values(validUsers);
      }

      return c.json({
        success: true,
        inserted: validUsers.length,
      });
    } catch (error) {
      console.error("Bulk insert seeding error:", error);
      return c.json({ success: false, message: "Failed to seed users" }, 500);
    }
  },
];

export const seedUserProjectsHandler = [
  async (c: Context) => {
    try {
      const vCreateProjectArray = z.array(vCreateProject);
      const filePath = path.join(
        process.cwd(),
        "src",
        "data",
        "userProjects.json"
      );
      const jsonData = await fs.readFile(filePath, "utf-8");
      const parsed: any[] = JSON.parse(jsonData);

      const userProjects: NewUserProject[] = parsed.map((entry) => ({
        ...entry,
      }));

      if (userProjects.length > 0) {
        await db.insert(user_projects).values(userProjects);
      }

      return c.json({
        success: true,
        inserted: userProjects.length,
      });
    } catch (error) {
      console.error("User projects bulk insert seeding error:", error);
      return c.json(
        { success: false, message: "Failed to seed user projects" },
        500
      );
    }
  },
];

