import { and, count, eq ,asc} from "drizzle-orm";
import db from "../database/db";
import { NewProject, projects, ProjectsTable } from "../database/schemas/projects";
import { user_projects } from "../database/schemas/userProjects";
import { deleteRecordById, getAllRecords, getRecordById, updateRecordById } from "./baseDbServices";
import { users } from "../database/schemas/users";

// get projects by id
export function getProjectById(projectId: number) {
    return getRecordById(projects, projectId);
}
// get all projects
export async function getAllProjects(page: number, page_size: number, projects: ProjectsTable, filter: any) {
    return await getAllRecords(page, page_size, projects, filter);
}

// get all projects
// // get all projects with optional filters and pagination
// export const getAllProjects = async (
//   page: number,
//   page_size: number,
//   user_id?: number,
//   project_id?: number
// ) => {
//   const offset = (page - 1) * page_size;

//   // Build dynamic filters
//   const conditions = [];

//   if (user_id) {
//     conditions.push(eq(user_projects.user_id, user_id));
//   }

//   if (project_id) {
//     conditions.push(eq(user_projects.project_id, project_id));
//   }

//   const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

//   // Fetch paginated project data with user assignments
//   const data = await db
//     .select({
//       project_id: projects.id,
//       project_name: projects.title,
//       user_id: users.id,
//       user_name: users.first_name,
//       user_email: users.email,
//     })
//     .from(user_projects)
//     .innerJoin(projects, eq(projects.id, user_projects.project_id))
//     .innerJoin(users, eq(users.id, user_projects.user_id))
//     .where(whereClause)
//     .orderBy(asc(projects.id))
//     .limit(page_size)
//     .offset(offset);

//   // Count total matching records for pagination
//   const [{ total }] = await db
//     .select({ total: count() })
//     .from(user_projects)
//     .innerJoin(projects, eq(projects.id, user_projects.project_id))
//     .innerJoin(users, eq(users.id, user_projects.user_id))
//     .where(whereClause);

//   const totalPages = Math.ceil(total / page_size);

//   return {
//     total_records: total,
//     page,
//     page_size,
//     totalPages,
//     next_page: page < totalPages ? page + 1 : null,
//     prev_page: page > 1 ? page - 1 : null,
//     data,
//   };
// };

///create project


export const createProject = async (projectData: NewProject) => {
    const project = await db.insert(projects).values(projectData).returning();
    return project[0];
};
export const isProjectExist = async (title: string) => {
    const existingProject = await db
        .select()
        .from(projects)
        .where(eq(projects.title, title));

    return existingProject.length > 0;
};

export const createNewProject = async (projectData: NewProject) => {
    //check project title is already exists or not
    const exists = await isProjectExist(projectData.title);
    if (exists) {
        throw new Error("Project with this title already exists.");
    }

    //  if not Create the project
    const project = await createProject(projectData);

    // fetch all user IDs from the users table
    const userList = await db.select({ id: users.id }).from(users);
    const userIds = userList.map(user => user.id);

    // assign all users to the new project
    const userProjectData = userIds.map(userId => ({
        user_id: userId,
        project_id: project.id,
    }));

    await db.insert(user_projects).values(userProjectData);

    return project;
}; 
//update prooject by id
export async function updateProjectById(projectId: number,projectData:NewProject) {
  return await updateRecordById(projects,projectData, projectId);
}
// delete user by id
export async function deleteProjectById(projectId: number) {
  return await deleteRecordById(projects, projectId);
}