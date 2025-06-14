import { eq } from "drizzle-orm";
import db from "../database/db";
import { repositories } from "../database/schemas/repo";
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
