import { eq } from "drizzle-orm";
import db from "../database/db";
import { repositories } from "../database/schemas/repositories";
import { projects } from "../database/schemas/projects";
export const checkRepoExist = async (id) => {
    return await db
        .select()
        .from(repositories)
        .where(eq(repositories.id, id));
};
export const checkProjectExistInRepo = async (projectId) => {
    return await db
        .select({
        id: repositories.project_id
    })
        .from(repositories)
        .where(eq(repositories.project_id, projectId));
};
export const getExistingRepositoryNames = async (repositoryNames) => {
    const existingRepositories = await db
        .select({ name: repositories.title })
        .from(repositories)
        .where(eq(repositories.title, repositoryNames));
    return existingRepositories;
};
export async function isProjectIdExist(projectId) {
    const existingProject = await db
        .select()
        .from(projects)
        .where(eq(projects.id, projectId));
    return existingProject.length > 0;
}
