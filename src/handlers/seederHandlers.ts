import { createRecordMany, deleteCommitById, deleteProjectById } from "../../seeder/seederDb";
import { generateFakeCommits, generateFakeProjects, generateFakeUserProjects, generateFakeUsers } from "../../seeder/seeders";
import { BAD_REQUEST, CREATED, OK } from "../constants/httpStatusCodes";
import { commits } from "../database/schemas/commits";
import { projects } from "../database/schemas/projects";
import { user_projects } from "../database/schemas/userProjects";
import { users } from "../database/schemas/users";
import factory from "../factory";
import { sendResponse } from "../utils/sendResponse";
// user seeder handlers.ts
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

// project seeder handler
export const seedProjectHandler = factory.createHandlers(async (c) => {
  try {
    const count = Number(c.req.query("count")) || 5;
    const fakeProjects = generateFakeProjects(count);
    const insertedProjects = await createRecordMany(projects, fakeProjects);
    if (!Array.isArray(insertedProjects)) {
      throw new TypeError("Projects insertion failed");
    }
    return sendResponse(c, CREATED, `${insertedProjects.length} projects created`, insertedProjects);
  }
  catch (error) {
    console.error("Seeder error:", error);
    return c.json({ error: "Failed to seed projects" }, 500);
  }
});

// user project seeder handler
export const seedUserProjectsHandler = factory.createHandlers(async (c) => {
  try {
    const fakeUserProjects = await generateFakeUserProjects();
    const inserted = await createRecordMany(user_projects, fakeUserProjects);

    if (!Array.isArray(inserted)) {
      throw new TypeError("UserProjects insertion failed");
    }
    return sendResponse(c, CREATED, `${inserted.length} user_project records created`, inserted);
  }
  catch (error) {
    console.error("UserProject Seeder Error:", error);
    return c.json({ error: "Failed to seed user_projects" }, 500);
  }
});

// commi tSeeder handler
export const seedCommitsHandler = factory.createHandlers(async (c) => {
  try {
    const count = Number(c.req.query("count")) || 20;
    const fakeCommits = await generateFakeCommits(count);
    const insertedCommits = await createRecordMany(commits, fakeCommits);
    if (!Array.isArray(insertedCommits)) {
      throw new TypeError("Commits insertion failed");
    }
    return sendResponse(c, CREATED, `${insertedCommits.length} commits created`, insertedCommits);
  }
  catch (error) {
    console.error("Seeder error:", error);
    return c.json({ error: "Failed to seed commits" }, 500);
  }
});

// Handler to delete project by ID
export const deleteProjectByIdHandler = factory.createHandlers(async (c) => {
  try {
    const projectId = Number(c.req.param("id"));
    if (!projectId) {
      return c.json({ error: "project ID is required" }, BAD_REQUEST);
    }

    await (deleteProjectById);
    return sendResponse(c, OK, `Commit with ID ${projectId} deleted successfully`);
  }
  catch (error) {
    console.error("Error deleting project:", error);
    return c.json({ error: "Failed to delete project by ID" }, 500);
  }
});

// Handler to delete commit by ID
export const deleteCommitByIdHandler = factory.createHandlers(async (c) => {
  try {
    const commitId = Number(c.req.param("id"));
    if (!commitId) {
      return c.json({ error: "Commit ID is required" }, BAD_REQUEST);
    }

    await deleteCommitById(commitId);
    return sendResponse(c, OK, `Commit with ID ${commitId} deleted successfully`);
  }
  catch (error) {
    console.error("Error deleting commit:", error);
    return c.json({ error: "Failed to delete commit by ID" }, 500);
  }
});
