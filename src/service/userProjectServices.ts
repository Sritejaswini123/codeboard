import { eq } from "drizzle-orm";

import db from "../database/db";
import { user_projects } from "../database/schemas/userProjects";

export async function userProjectExist(userProjectId: number) {
  const result = await db
    .select({ id: user_projects.id })
    .from(user_projects)
    .where(eq(user_projects.id, userProjectId));
  return result[0];
}