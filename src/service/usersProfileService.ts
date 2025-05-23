import { eq } from "drizzle-orm";
import db from "../database/db";
import { users } from "../database/schemas/users";
import { user_projects } from "../database/schemas/userProjects";
import { projects } from "../database/schemas/projects";

//  type UserProfile = {
//   user: {
//     id: number;
//     first_name: string;
//     last_name?: string;
//     email: string;
//     phone: string;
//     is_active: boolean;
//     dob: string;
//     doj: string;
//     designation: string;
//   };
//   projects: {
//     id: number;
//     title: string;
//     description: string;
//     is_active: boolean;
//   }[];
//  };

export async function getUserProfile(userId: number) {
 
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

 
  const userProjects = await db
    .select({
      id: projects.id,
      title: projects.title,
      description: projects.description,
      is_active: projects.is_active,
    })
    .from(user_projects)
    .innerJoin(projects, eq(user_projects.project_id, projects.id))
    .where(eq(user_projects.user_id, userId));

  return {
    user: user[0],
    projects: userProjects.length > 0 ? userProjects : [],
  };
}
