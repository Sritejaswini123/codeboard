import { and, eq, inArray } from "drizzle-orm";
import db from "../database/db";
import { NewProject, projects, ProjectsTable } from "../database/schemas/projects";
import { user_projects } from "../database/schemas/userProjects";
import { users } from "../database/schemas/users";
import { getAllRecords, getRecordById, updateRecordById } from "./baseDbServices";

// get projects by id
export function getProjectById(projectId: number) {
    return getRecordById(projects, projectId);
}
// get all projects
export async function getAllProjects(page: number, page_size: number, projects: ProjectsTable, filter: any) {
    return await getAllRecords(page, page_size, projects, filter);
}
//create Project
export const createProject = async (projectData: NewProject) => {
    const project = await db.insert(projects).values(projectData).returning();
    return project[0];
};
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
//     } 


//         //  if not Create the project
//         const project = await createProject(projectData);

//         // Check if users are already assigned to the project
//   const existingUserProjects = await db
//     .select()
//     .from(user_projects)
//     .where(eq(user_projects.project_id, project.id));

//   const existingUserIds = existingUserProjects.map((userProject) => userProject.user_id);
//   const newUserIds = validProjectReq.userIds.filter((userId) => !existingUserIds.includes(userId));

//   if (newUserIds.length > 0) {
//     const userProjectData = newUserIds.map((userId: number) => ({
//       user_id: userId,
//       project_id: project.id,
//     }));

//         await db.insert(user_projects).values(userProjectData);

//         return project;
// }
//     };

//update prooject by id
export async function updateProjectById(projectId: number, projectData: NewProject) {
    return await updateRecordById(projects, projectData, projectId);
}

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
    const total = projectsResult.length

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
//assign users
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