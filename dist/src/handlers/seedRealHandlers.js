import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { FAILED_SEED_PROJECTS, FAILED_SEED_REPOSITORIES, FAILED_SEED_USERS } from "../constants/appMessages";
import { INTERNAL_SERVER_ERROR } from "../constants/httpStatusCodes";
import db from "../database/db";
import { commits } from "../database/schemas/commits";
import { projects } from "../database/schemas/projects";
import { repositories } from "../database/schemas/repositories";
import { user_projects } from "../database/schemas/userProjects";
import { users } from "../database/schemas/users";
import { vCreateCommit } from "../validations/commitValidations";
import { vCreateProject } from "../validations/projectValidations";
import { vCreateRepositories } from "../validations/repositoryValidations";
import { vCreateUser } from "../validations/userValidations";
import { getExistingEmails, getExistingProjectNames, getExistingRepositoryNames } from "../service/seederServices";
export const seedRealUserHandler = [
    async (c) => {
        try {
            const vCreateUserArray = z.array(vCreateUser);
            const filePath = path.join(process.cwd(), "src", "data", "users.json");
            console.log('filePath: ', filePath);
            const jsonData = await fs.readFile(filePath, "utf-8");
            const parsedUsers = JSON.parse(jsonData);
            // Validate users
            const validUsersRaw = vCreateUserArray.parse(parsedUsers);
            const validUsers = validUsersRaw.map(user => ({
                ...user,
                // dob: new Date(user.dob),
                // doj: new Date(user.doj),
            }));
            const emails = validUsers.map(user => user.email);
            const existingEmails = await getExistingEmails(emails);
            const newUsers = validUsers.filter(user => !existingEmails.has(user.email));
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
            return c.json({ success: false, message: FAILED_SEED_USERS }, INTERNAL_SERVER_ERROR);
        }
    },
];
// seedRealProjectHandler
export const seedRealProjectHandler = [
    async (c) => {
        try {
            const vCreateProjectArray = z.array(vCreateProject);
            const filePath = path.join(process.cwd(), "src", "data", "projects.json");
            console.log(filePath);
            const jsonData = await fs.readFile(filePath, "utf-8");
            const parsedProjects = JSON.parse(jsonData);
            const validProject = vCreateProjectArray.parse(parsedProjects);
            const validProjects = validProject.map(project => ({
                ...project,
            }));
            const projectNames = validProjects.map(project => project.title);
            const existingProjectNames = await getExistingProjectNames(projectNames);
            const newProjects = validProjects.filter(project => !existingProjectNames.has(project.title));
            if (newProjects.length > 0) {
                await db.insert(projects).values(newProjects);
            }
            return c.json({
                success: true,
                inserted: newProjects.length,
            });
        }
        catch (error) {
            console.error("Insert seeding error:", error);
            return c.json({ success: false, message: FAILED_SEED_PROJECTS }, INTERNAL_SERVER_ERROR);
        }
    }
];
export const seedUserProjectsHandler = [async (c) => {
        try {
            const filePath = path.join(process.cwd(), "src", "data", "userProjects.json");
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
            console.error("User projects  insert seeding error:", error);
            return c.json({ success: false, message: "Failed to seed user projects" }, 500);
        }
    }];
export const seedCommitHandler = [async (c) => {
        try {
            const filePath = path.join(process.cwd(), "src", "data", "commitsConnection.json");
            const commitJsonData = await fs.readFile(filePath, "utf-8");
            const parsedCommits = JSON.parse(commitJsonData);
            const validatedCommits = z.array(vCreateCommit).parse(parsedCommits);
            const [userList, projectList, repositoryList] = await Promise.all([
                db.select({ id: users.id }).from(users),
                db.select({ id: projects.id }).from(projects),
                db.select({ id: repositories.id }).from(repositories),
            ]);
            const userIds = new Set(userList.map(u => u.id));
            const projectIds = new Set(projectList.map(p => p.id));
            const repositoryIds = new Set(repositoryList.map(r => r.id));
            //  Filter and transform data before insertion
            const transformedCommits = validatedCommits
                .filter(commit => userIds.has(commit.user_id)
                && projectIds.has(commit.project_id)
                && repositoryIds.has(commit.repository_id))
                .map(commit => ({
                ...commit,
                date: new Date(commit.date),
                // time: commit.time,
            }));
            if (transformedCommits.length > 0) {
                await db.insert(commits).values(transformedCommits);
            }
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
            }, INTERNAL_SERVER_ERROR);
        }
    }];
export const seedRealRepoHandler = [async (c) => {
        try {
            const vCreateRepoArray = z.array(vCreateRepositories);
            const filePath = path.join(process.cwd(), "src", "data", "repositories.json");
            const jsonData = await fs.readFile(filePath, "utf-8");
            const parsedRepo = JSON.parse(jsonData);
            const validRepos = vCreateRepoArray.parse(parsedRepo);
            const repositoryNames = validRepos.map(repo => repo.title);
            const existingRepositoryNames = await getExistingRepositoryNames(repositoryNames);
            const newRepos = validRepos.filter(repo => !existingRepositoryNames.has(repo.title));
            if (newRepos.length > 0) {
                await db.insert(repositories).values(newRepos);
            }
            return c.json({
                success: true,
                inserted: newRepos.length,
            });
        }
        catch (error) {
            console.error("Insert seeding error:", error);
            return c.json({ success: false, message: FAILED_SEED_REPOSITORIES }, 500);
        }
    }];
