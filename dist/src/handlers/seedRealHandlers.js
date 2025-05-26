import fs from "fs/promises";
import path from "path";
import db from "../database/db";
import { users } from "../database/schemas/users";
import { vCreateUser } from "../validations/userValidations";
import { vCreateProject } from "../validations/projectValidations";
import { projects } from "../database/schemas/projects";
import { user_projects } from "../database/schemas/userProjects";
import { vCreateCommit } from "../validations/commitValidations";
import { z } from "zod";
import { commits } from "../database/schemas/commits";
import { repositories } from "../database/schemas/repositories";
import { vCreateRepository } from "../validations/repositoryValidations";
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
            if (validUsers.length > 0) {
                await db.insert(users).values(validUsers);
            }
            return c.json({
                success: true,
                inserted: validUsers.length,
            });
        }
        catch (error) {
            console.error(" insert seeding error:", error);
            return c.json({ success: false, message: "Failed to seed users" }, 500);
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
            console.error("Bulk insert seeding error:", error);
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
export const seedCommitHandler = [async (c) => {
        try {
            const vCreateCommitArray = z.array(vCreateCommit);
            const filePath = path.join(process.cwd(), 'src', 'data', 'commits connection.json');
            const commitJsonData = await fs.readFile(filePath, 'utf-8');
            const parsedCommit = JSON.parse(commitJsonData);
            const validatedCommits = vCreateCommitArray.parse(parsedCommit);
            // Convert date and time before inserting
            const transformedCommits = validatedCommits.map(commit => ({
                ...commit,
                date: new Date(commit.date),
                time: commit.time,
            }));
            if (transformedCommits.length > 0) {
                await db.insert(commits).values(transformedCommits);
            }
            return c.json({
                success: true,
                inserted: transformedCommits.length,
            });
        }
        catch (error) {
            console.error('User commits insert seeding error:', error);
            return c.json({
                success: false,
                message: 'Failed to seed user commits',
                error: error instanceof Error ? error.message : String(error),
            }, 500);
        }
    }];
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
