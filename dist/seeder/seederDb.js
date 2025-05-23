import { eq } from "drizzle-orm";
import db from "../src/database/db";
import { commits } from "../src/database/schemas/commits";
import { projects } from "../src/database/schemas/projects";
export async function createRecordMany(table, records) {
    return await db.insert(table).values(records).returning();
}
// create the project
export async function createProjectRecord(project) {
    return await db.insert(projects).values(project).returning();
}
// delete the project by project id
export async function deleteProjectById(projectId) {
    return await db.delete(projects).where(eq(projects.id, projectId));
}
// create the commit
export async function createCommitRecord(commit) {
    return await db.insert(commits).values(commit).returning();
}
// delete commit by commit id
export async function deleteCommitById(commitId) {
    return await db.delete(commits).where(eq(commits.id, commitId));
}
