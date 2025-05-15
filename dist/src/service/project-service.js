import { eq } from "drizzle-orm";
import db from "../database/db";
import { projects } from "../database/schemas/projects";
//save user 
export const createProject = async (userData) => {
    const user = await db.insert(projects).values(userData).returning();
    return user[0];
};
export const isProjectExist = async (title) => {
    const existingProject = await db
        .select()
        .from(projects)
        .where(eq(projects.title, title));
    return existingProject;
};
