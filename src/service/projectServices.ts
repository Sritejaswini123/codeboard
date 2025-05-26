import { eq } from "drizzle-orm";
import db from "../database/db";
import { NewProject, projects, ProjectsTable } from "../database/schemas/projects";
import { user_projects } from "../database/schemas/userProjects";
import { deleteRecordById, getAllRecords, getRecordById, updateRecordById } from "./baseDbServices";
import { ValidatedCreateProject, } from "../validations/projectValidations"

// get projects by id
export function getProjectById(projectId: number) {
    return getRecordById(projects, projectId);
}
// get all projects
export async function getAllProjects(page: number, page_size: number, projects: ProjectsTable, filter: any) {
    return await getAllRecords(page, page_size, projects, filter);
}

export const createProject = async (projectData: NewProject) => {
    const project = await db.insert(projects).values(projectData).returning();
    return project[0];
};
export const isProjectExist = async (project_id: number) => {
    const existingProject = await db
        .select()
        .from(projects)
        .where(eq(projects.id, project_id));

    return existingProject.length > 0;
};

export const createNewProject = async (validProjectReq: ValidatedCreateProject) => {
    const { project_id, ...projectData } = validProjectReq;
    if (validProjectReq.project_id !== undefined) {
        const exists = await isProjectExist(validProjectReq.project_id);
    } else {
        throw new Error("Project ID is undefined.");
    }


    //  if not Create the project
    const project = await createProject(projectData);

    // assign  users to the new project
    const userProjectData = validProjectReq.userIds.map((userId: number) => ({

        user_id: userId,
        project_id: project.id,
    }));

    await db.insert(user_projects).values(userProjectData);

    return project;
};

//update prooject by id
export async function updateProjectById(projectId: number, projectData: NewProject) {
    return await updateRecordById(projects, projectData, projectId);
}
// delete  by id
export async function deleteProjectById(projectId: number) {
    return await deleteRecordById(projects, projectId);
}