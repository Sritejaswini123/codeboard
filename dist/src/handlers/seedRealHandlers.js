import fs from "fs/promises";
import path from "path";
import db from "../database/db";
import { users } from "../database/schemas/users";
import { inArray } from "drizzle-orm";
import { vCreateUser } from "../validations/userValidations";
import { vCreateProject } from "../validations/projectValidations";
import { projects } from "../database/schemas/projects";
import { user_projects } from "../database/schemas/userProjects";
import { vCreateCommit } from "../validations/commitValidations";
import { z } from "zod";
import { commits } from "../database/schemas/commits";
import { repositories } from "../database/schemas/repositories";
import { vCreateRepository } from "../validations/repositoryValidations";
import { INTERNAL_SERVER_ERROR } from "../constants/httpStatusCodes";
// export const seedRealUserHandler = [ async (c: Context) => {
//    try {
//     const vCreateUserArray = z.array(vCreateUser);
//     const filePath = path.join(process.cwd(), "src", "data", "users.json");
//     const jsonData = await fs.readFile(filePath, "utf-8");
//     const parsedUsers: any[] = JSON.parse(jsonData);
//     const validUsersRaw = vCreateUserArray.parse(parsedUsers);
//     const validUsers = validUsersRaw.map(user => ({
//     ...user,
//     dob: new Date(user.dob),
//     doj: new Date(user.doj),
//     }));
//     if (validUsers.length > 0) {
//       await db.insert(users).values(validUsers);
//     }
//     return c.json({
//       success: true,
//       inserted: validUsers.length,
//     });
//   } catch (error) {
//     console.error(" insert seeding error:", error);
//     return c.json({ success: false, message: "Failed to seed users" }, INTERNAL_SERVER_ERROR);
//   }
// }];
export const seedRealUserHandler = [async (c) => {
        try {
            const vCreateUserArray = z.array(vCreateUser);
            const filePath = path.join(process.cwd(), "src", "data", "users.json");
            const jsonData = await fs.readFile(filePath, "utf-8");
            const parsedUsers = JSON.parse(jsonData);
            const validUsersRaw = vCreateUserArray.parse(parsedUsers);
            const validUsers = validUsersRaw.map(user => ({
                ...user,
                dob: new Date(user.dob),
                doj: new Date(user.doj),
            }));
            // Step 1: Get all emails of valid users
            const emails = validUsers.map(user => user.email);
            // Step 2: Fetch existing emails from DB
            const existingUsers = await db
                .select({ email: users.email })
                .from(users)
                .where(inArray(users.email, emails));
            const existingEmails = new Set(existingUsers.map(u => u.email));
            // Step 3: Filter out users with already existing emails
            const newUsers = validUsers.filter(user => !existingEmails.has(user.email));
            // Step 4: Insert only new users
            if (newUsers.length > 0) {
                await db.insert(users).values(newUsers);
            }
            return c.json({
                success: true,
                inserted: newUsers.length,
            });
        }
        catch (error) {
            console.error("Insert seeding error:", error);
            return c.json({ success: false, message: "Failed to seed users" }, INTERNAL_SERVER_ERROR);
        }
    }];
export const seedRealProjectHandler = [async (c) => {
        try {
            const vCreateProjectArray = z.array(vCreateProject);
            const filePath = path.join(process.cwd(), "src", "data", "projects.json");
            const jsonData = await fs.readFile(filePath, "utf-8");
            const parsedProjects = JSON.parse(jsonData);
            const validProjects = vCreateProjectArray.parse(parsedProjects);
            if (validProjects.length > 0) {
                await db.insert(projects).values(validProjects);
            }
            return c.json({
                success: true,
                inserted: validProjects.length,
            });
        }
        catch (error) {
            console.error("insert seeding error:", error);
            return c.json({ success: false, message: "Failed to seed projects" }, 500);
        }
    },
];
export const seedUserProjectsHandler = [async (c) => {
        try {
            const filePath = path.join(process.cwd(), "src", "data", "user_Projects.json");
            const jsonData = await fs.readFile(filePath, "utf-8");
            const parsed = JSON.parse(jsonData);
            const userProjects = parsed.map(entry => ({
                ...entry,
            }));
            if (userProjects.length > 0) {
                await db.insert(user_projects).values(userProjects);
            }
            return c.json({
                success: true,
                inserted: userProjects.length,
            });
        }
        catch (error) {
            console.error("User projects bulk insert seeding error:", error);
            return c.json({ success: false, message: "Failed to seed user projects" }, 500);
        }
    }];
// export const seedCommitHandler = [async (c: Context) => {
//   try {
//     const vCreateCommitArray = z.array(vCreateCommit);
//     const filePath = path.join(process.cwd(), 'src', 'data', 'commits connection.json');
//     const commitJsonData = await fs.readFile(filePath, 'utf-8');
//     const parsedCommit: any[] = JSON.parse(commitJsonData);
//     const validatedCommits = vCreateCommitArray.parse(parsedCommit);
//     // Convert date and time before inserting
//     const transformedCommits: NewCommit[] = validatedCommits.map(commit => ({
//       ...commit,
//       date: new Date(commit.date),
//       time:commit.time,
//     }));
//     if (transformedCommits.length > 0) {
//       await db.insert(commits).values(transformedCommits);
//     }
//     return c.json({
//       success: true,
//       inserted: transformedCommits.length,
//     });
//   } catch (error) {
//     console.error('User commits insert seeding error:', error);
//     return c.json({
//       success: false,
//       message: 'Failed to seed user commits',
//       error: error instanceof Error ? error.message : String(error),
//     }, 500);
//   }
// }];
export const seedCommitHandler = [
    async (c) => {
        try {
            const filePath = path.join(process.cwd(), "src", "data", "commits connection.json");
            const commitJsonData = await fs.readFile(filePath, "utf-8");
            const parsedCommits = JSON.parse(commitJsonData);
            // 1. Validate JSON structure using Zod
            const validatedCommits = z.array(vCreateCommit).parse(parsedCommits);
            // 2. Fetch all current valid IDs
            const [userList, projectList, repositoryList] = await Promise.all([
                db.select({ id: users.id }).from(users),
                db.select({ id: projects.id }).from(projects),
                db.select({ id: repositories.id }).from(repositories),
            ]);
            const userIds = new Set(userList.map((u) => u.id));
            const projectIds = new Set(projectList.map((p) => p.id));
            const repositoryIds = new Set(repositoryList.map((r) => r.id));
            // 3. Filter and transform data before insertion
            const transformedCommits = validatedCommits
                .filter((commit) => userIds.has(commit.user_id) &&
                projectIds.has(commit.project_id) &&
                repositoryIds.has(commit.repository_id))
                .map((commit) => ({
                ...commit,
                date: new Date(commit.date),
                time: commit.time,
            }));
            // 4. Insert only valid commits
            if (transformedCommits.length > 0) {
                await db.insert(commits).values(transformedCommits);
            }
            // 5. Return result
            return c.json({
                success: true,
                inserted: transformedCommits.length,
                skipped: validatedCommits.length - transformedCommits.length,
            });
        }
        catch (error) {
            console.error("Commit seeding error:", error);
            return c.json({
                success: false,
                message: "Failed to seed commits",
                error: error instanceof Error ? error.message : String(error),
            }, 500);
        }
    },
];
///Repositories
export const seedRealRepoHandler = [async (c) => {
        try {
            const vCreateRepoArray = z.array(vCreateRepository);
            const filePath = path.join(process.cwd(), "src", "data", "repositories.json");
            const jsonData = await fs.readFile(filePath, "utf-8");
            const parsedRepo = JSON.parse(jsonData);
            const validrepo = vCreateRepoArray.parse(parsedRepo);
            if (validrepo.length > 0) {
                await db.insert(repositories).values(validrepo);
            }
            return c.json({
                success: true,
                inserted: validrepo.length,
            });
        }
        catch (error) {
            console.error(" insert seeding error:", error);
            return c.json({ success: false, message: "Failed to seed repositorites" }, 500);
        }
    }];
