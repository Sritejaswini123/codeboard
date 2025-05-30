import { and, asc, count, eq ,inArray, sql} from "drizzle-orm";

import db from "../database/db";
import { NewProject, ProjectsTable, projects } from "../database/schemas/projects";
import { user_projects } from "../database/schemas/userProjects";
import { users } from "../database/schemas/users";
import { USER_NOT_FOUND } from "../constants/appMessages";
import { getAllRecords } from "./baseDbServices";

//getAll projects
export async function getAllProjects(page: number, page_size: number, projects: ProjectsTable, filter: any) {
  return await getAllRecords(page, page_size, projects, filter);
}

// // get All projects
// export async function getAllProjects(page: number, page_size: number, user_id: number, project_id: number) {
//   const offset = (page - 1) * page_size;

//   const conditions = [];

//   if (user_id) {
//     conditions.push(eq(users.id, user_id));
//   }
//   if (project_id) {
//     conditions.push(eq(projects.id, project_id));
//   }
//   const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

//   const projectData = await db
//     .select({
//       project_id: projects.id,
//       project_name: projects.title,
//       user_id: users.id,
//       user_name: users.first_name,
//       user_email: users.email,
//     })
//     .from(projects)
//     .innerJoin(user_projects, eq(projects.id, user_projects.project_id))
//     .innerJoin(users, eq(users.id, user_projects.user_id))
//     .where(whereClause)
//     .orderBy(asc(projects.id))
//     .limit(page_size)
//     .offset(offset);
//   //count
//   const [{ total }] = await db
//     .select({
//       total: sql<number>`count(*)`,
//     })
//     .from(projects);
//   const totalPages = Math.ceil(total / page_size);


//   return {
//     total_records: total,
//     page,
//     page_size,
//     totalPages,
//     next_page: page < totalPages ? page + 1 : null,
//     prev_page: page > 1 ? page - 1 : null,
//     data: projectData,
//   };
// }

// //delete project
// export async function deletedProjectById(projectId: number) {
//   const result = await db
//     .select()
//     .from(projects)
//     .where(eq(projects.id, projectId));
//   return result[0];
// }
 
// //create project
// export const createProject = async (projectData: NewProject) => {
//     const project = await db.insert(projects).values(projectData).returning();
//     return project[0];
// };

//is project exists
export const isProjectExist = async (project_title: string) => {
    const existingProject = await db
        .select()
        .from(projects)
        .where(eq(projects.title, project_title));

    return existingProject.length > 0;
};

//add users in project
export const assignUsersToProject = async (userIds: number[], projectId: number) => {
  // Check users are already assigned to the project
  const existingUserAssignments = await db
      .select({ user_id: user_projects.user_id })
      .from(user_projects)
      .where(
          and(
              eq(user_projects.project_id, projectId),
              inArray(user_projects.user_id, userIds)
          )
      );

  const existingUserIds = existingUserAssignments.map(({ user_id }) => user_id);

  // Filter users who are already assigned
  const newUserIds = userIds.filter((id) => !existingUserIds.includes(id));

  //data for new users insertion
  const newUserAssignments = newUserIds.map((userId) => ({
      user_id: userId,
      project_id: projectId,
  }));

  // Insert new user assignments
  if (newUserAssignments.length > 0) {
      await db.insert(user_projects).values(newUserAssignments);
  }

  return {
      assigned: newUserIds,
      alreadyAssigned: existingUserIds,
  };
};


//user projects data 
export async function getUserProjects(userId: number, includeProjects: boolean) {
  const user = await db
    .select({
      id: users.id,
      name: users.first_name,
      email:users.email
    })
    .from(users)
    .where(eq(users.id, userId));

  if (user.length === 0) {
    return USER_NOT_FOUND;
  }

  if (!includeProjects) {
    return { user: user[0] };
  }

  const userProjects = await db
    .select({
      id: projects.id,
      name: projects.title,
      description: projects.description,
      is_active: projects.is_active,
    })
    .from(user_projects)
    .innerJoin(projects, eq(user_projects.project_id, projects.id))
    .where(eq(user_projects.user_id, userId));

  return {
    total_records:(userProjects.length),
    user: user[0],
    userProjects: userProjects.length > 0 ? userProjects : [],
  };
}

