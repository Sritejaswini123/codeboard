import { eq } from "drizzle-orm";
import db from "../database/db";
import { projects } from "../database/schemas/projects";
import { user_projects } from "../database/schemas/userProjects";
import { getAllRecords, getRecordById } from "./baseDbServices";
import { users } from "../database/schemas/users";
// get projects by id
export function getProjectById(projectId) {
    return getRecordById(projects, projectId);
}
// get all projects
export async function getAllProjects(page, page_size, projects, filter) {
    return await getAllRecords(page, page_size, projects, filter);
}
// // get all projects
// export const getAllProjects = async (
//   page: number,
//   page_size: number,
//   user_id?:number,
//   project_id?:number
// ) => {
//   const offset = (page - 1) * page_size;
//   const conditions = [];
//   if (user_id) {
//     conditions.push(eq(users.id, user_id));
//   }
// if (project_id){
//   conditions.push(eq(projects.id,project_id));
// }
// if (project_id){
//   conditions.push(eq(user_projects.project_id,project_id));
// }
// if (user_id){
//   conditions.push(eq(user_projects.user_id,user_id));
// }
//   const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
//   const Data = await db
//     .selectDistinct({
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
//   const [{ total }] = await db
//     .select({ total: count() })
//     .from(projects);
//   const totalPages = Math.ceil(total / page_size);
//   return {
//     total_records: total,
//     page,
//     page_size,
//     totalPages,
//     next_page: page < totalPages ? page + 1 : null,
//     prev_page: page > 1 ? page - 1 : null,
//     data: Data,
//   };
// };
///create project
export const createProject = async (projectData) => {
    const project = await db.insert(projects).values(projectData).returning();
    return project[0];
};
export const isProjectExist = async (title) => {
    const existingProject = await db
        .select()
        .from(projects)
        .where(eq(projects.title, title));
    return existingProject.length > 0;
};
export const createNewProject = async (projectData) => {
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
// //update project 
// export const updatedProjects = async(ptojectData:Newupdated)=> {
//     const updatedProjects=await db.update(projects).set(profile)
// }
