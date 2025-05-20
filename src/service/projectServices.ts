import { eq } from "drizzle-orm";

import type { NewProject } from "../database/schemas/projects";

import db from "../database/db";
import { projects } from "../database/schemas/projects";

// save user
export async function createProject(userData: NewProject) {
  const user = await db.insert(projects).values(userData).returning();
  return user[0];
}

export async function isProjectExist(title: string) {
  const existingProject = await db
    .select()
    .from(projects)
    .where(eq(projects.title, title));
  return existingProject;
}
