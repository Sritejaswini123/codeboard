import db from "../database/db";
import { eq } from "drizzle-orm";
import { NewProject, projects } from "../database/schemas/projects";
import { getAllRecords, getRecordById } from "./base-db-services";

// get projects by id
export function getProjectById(projectId: number) {
  return getRecordById(projects, projectId);
}
// get all projects
export async function getAllProjects(page: number,page_size: number,) {
  return await getAllRecords(page,page_size,projects);
}
//create project
 
export const createProject=async (projectData: NewProject)=>{
    const  project =await db.insert(projects).values(projectData).returning();
    return project[0];
}

export const isProjectExist=async(title:string)=>{
   const existingProject=await db
      .select()
      .from(projects)
      .where(eq(projects.title,title))
  return existingProject;
}