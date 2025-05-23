import { count, eq } from "drizzle-orm";
import db from "../database/db";
import { projects } from "../database/schemas/projects";
import { user_projects } from "../database/schemas/userProjects";
import { users } from "../database/schemas/users";

//get usersById with projects
export const getUserWithProjects = async (
  userId: number,
 // page: number,
 // page_size: number,
  includeProjects: boolean = false
) => {
 // const offset = (page - 1) * page_size;

  // Fetch user data
  const userResult = await db
    .select({
      id: users.id,
      name: users.first_name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (userResult.length === 0) {
    return null;
  }

  const user = userResult[0];

  if (!includeProjects) {
    return { user };
  }
//get projec data by using joins
  const projectsResult = await db
    .select({
      id: projects.id,
      title: projects.title,
      description: projects.description,
      is_active: projects.is_active,
      created_at: projects.created_at,
      updated_at: projects.updated_at,
    })
    .from(user_projects)
    .innerJoin(projects, eq(user_projects.project_id, projects.id))
    .where(eq(user_projects.user_id, userId))
   // .limit(page_size)
    //.offset(offset);
 
  const [{ total }] = await db
    .select({ total: count() })
    .from(user_projects)
    .innerJoin(projects, eq(projects.id, user_projects.project_id))
    .innerJoin(users, eq(users.id, user_projects.user_id))
    .where(eq(user_projects.user_id, userId))

  //const totalPages = Math.ceil(total / page_size);

  return {
    total_records: total,
   // page,
   // page_size,
    //totalPages,
   // next_page: page < totalPages ? page + 1 : null,
    //prev_page: page > 1 ? page - 1 : null,
    user,
    projects: projectsResult
  };
};