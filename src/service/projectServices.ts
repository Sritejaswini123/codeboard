// import { eq } from "drizzle-orm";

// import type { NewProject, ProjectsTable } from "../database/schemas/projects";

// import db from "../database/db";
// import { projects } from "../database/schemas/projects";
// import { getAllRecords, getRecordById } from "./baseDbServices";
// // get projects by id
// export function getProjectById(projectId: number) {
//   return getRecordById(projects, projectId);
// }
// // get all projects
// export async function getAllProjects(page: number, page_size: number, projects: ProjectsTable, filter: any) {
//   return await getAllRecords(page, page_size, projects, filter);
// }
// // create project
// export async function createProject(projectData: NewProject) {
//   const project = await db.insert(projects).values(projectData).returning();
//   return project[0];
// }
// export async function isProjectExist(title: string) {
//   const existingProject = await db
//     .select()
//     .from(projects)
//     .where(eq(projects.title, title));
//   return existingProject;
// }





import { and, asc, count, eq } from "drizzle-orm";

import db from "../database/db";
import { NewProject, projects } from "../database/schemas/projects";
import { user_projects } from "../database/schemas/userProjects";
import { users } from "../database/schemas/users";
import{ValidatedCreateProject} from "../validations/projectValidations"


// all projects
export async function getAllProjects(page: number, page_size: number, user_id: number, project_id: number) {
  const offset = (page - 1) * page_size;

  const conditions = [];

  if (user_id) {
    conditions.push(eq(users.id, user_id));
  }
  if (project_id) {
    conditions.push(eq(projects.id, project_id));
  }
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const projectData = await db
    .select({
      project_id: projects.id,
      project_name: projects.title,
      user_id: users.id,
      user_name: users.first_name,
      user_email: users.email,
    })
    .from(projects)
    .innerJoin(user_projects, eq(projects.id, user_projects.project_id))
    .innerJoin(users, eq(users.id, user_projects.user_id))
    .where(whereClause)
    .orderBy(asc(projects.id))
    .limit(page_size)
    .offset(offset);

  const [{ total }] = await db
    .select({ total: count() })
    .from(projects);

  const totalPages = Math.ceil(total / page_size);

  return {
    total_records: total,
    page,
    page_size,
    totalPages,
    next_page: page < totalPages ? page + 1 : null,
    prev_page: page > 1 ? page - 1 : null,
    data: projectData,
  };
}

// // check project exist or not
// export async function isProjectExist(title: string) {
//   const existingProject = await db
//     .select()
//     .from(projects)
//     .where(eq(projects.title, title));
//   return existingProject;
// }

// // check if project is existing with id
// export async function deletedProjectById(projectId: number) {
//   const result = await db
//     .select()
//     .from(projects)
//     .where(eq(projects.id, projectId));
//   return result[0];
// }




       

// export const createProject = async (projectData: NewProject) => {
//     const project = await db.insert(projects).values(projectData).returning();
//     return project[0];
// };
// export const isProjectExist = async (project_id: number) => {
//     const existingProject = await db
//         .select()
//         .from(projects)
//         .where(eq(projects.id, project_id));

//     return existingProject.length > 0;
// };

// export const createNewProject = async (validProjectReq: ValidatedCreateProject) => {
//     const { project_id, ...projectData } = validProjectReq;
//     if (validProjectReq.project_id !== undefined) {
//         const exists = await isProjectExist(validProjectReq.project_id);
//     } else {
//         throw new Error("Project ID is undefined.");
//     }


//     //  if not Create the project
//     const project = await createProject(projectData);

//     // assign  users to the new project
//     const userProjectData = validProjectReq.userIDs.map((userId: number) => ({

//         user_id: userId,
//         project_id: project.id,
//     }));

//     await db.insert(user_projects).values(userProjectData);

//     return project;
// };
