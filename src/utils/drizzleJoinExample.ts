import { eq } from "drizzle-orm";

import db from "../database/db";
import { projects } from "../database/schemas/projects";
import { user_projects } from "../database/schemas/userProjects";
import { users } from "../database/schemas/users";

export async function getUsersProjects() {
  const result = await db
    .select({
      userId: users.id,
      firstName: users.first_name,
      lastName: users.last_name,
      projectId: projects.id,
      projectTitle: projects.title,
    })
    .from(users)
    .innerJoin(user_projects, eq(users.id, user_projects.user_id))
    .innerJoin(projects, eq(projects.id, user_projects.project_id));

  return result;
}
