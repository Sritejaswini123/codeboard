import { and, eq, inArray } from "drizzle-orm";
import db from "../database/db";
import { projects } from "../database/schemas/projects";
import { user_projects } from "../database/schemas/userProjects";
import { users } from "../database/schemas/users";
import { USER_NOT_FOUND } from "../constants/appMessages";
import { getAllRecords } from "./baseDbServices";
//getAll projects
export async function getAllProjects(page, page_size, projects, filter) {
    return await getAllRecords(page, page_size, projects, filter);
}
// //delete project
// export async function deletedProjectById(projectId: number) {
//   const result = await db
//     .select()
//     .from(projects)
//     .where(eq(projects.id, projectId));
//   return result[0];
// }
//is project exists
export const isProjectExist = async (project_title) => {
    const existingProject = await db
        .select()
        .from(projects)
        .where(eq(projects.title, project_title));
    return existingProject.length > 0;
};
//add users in project
export const assignUsersToProject = async (userIds, projectId) => {
    // Check users are already assigned to the project
    const existingUsersInProject = await db
        .select({
        project_id: user_projects.project_id,
        user_id: user_projects.user_id
    })
        .from(user_projects)
        .where(and(eq(user_projects.project_id, projectId), inArray(user_projects.user_id, userIds)));
    console.log(existingUsersInProject);
    const existingUserIds = existingUsersInProject.map(({ user_id }) => user_id);
    console.log('existingUserIds: ', existingUserIds);
    // Filter users who are already assigned
    const newUserIds = userIds.filter((id) => !existingUserIds.includes(id));
    //data for new users insertion
    const newUserAssignments = newUserIds.map((userIds) => ({
        user_id: userIds,
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
export async function getUserProjects(userId, includeProjects) {
    const user = await db
        .select({
        id: users.id,
        name: users.first_name,
        email: users.email
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
        total_records: (userProjects.length),
        user: user[0],
        userProjects: userProjects.length > 0 ? userProjects : [],
    };
}
//delete users in project
export const deleteUsersinProject = async (userIds, projectId) => {
    // Check users are already assigned to the project
    const existingUsersInProject = await db
        .select({ user_id: user_projects.user_id })
        .from(user_projects)
        .where(and(eq(user_projects.project_id, projectId), inArray(user_projects.user_id, userIds)));
    const existingUserIds = existingUsersInProject.map(({ user_id }) => user_id);
    //data for existing users deletion
    const deleteUserAssignments = existingUserIds.map((userIds) => ({
        user_id: userIds,
        project_id: projectId,
    }));
    // Delete existing user assignments
    if (deleteUserAssignments.length > 0) {
        await db.insert(user_projects).values(deleteUserAssignments);
    }
    return {
        deleteUserAssignments,
    };
};
