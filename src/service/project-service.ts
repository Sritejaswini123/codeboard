import { eq } from "drizzle-orm";

import db from "../database/db";
import { NewProject, projects } from "../database/schemas/projects";
import { getRecordById } from "./base-db-services";




//save user 
export const createProject=async (userData: NewProject)=>{
    const  user =await db.insert(projects).values(userData).returning();
    return user[0];
}

export const isProjectExist=async(title:string)=>{
   const existingProject=await db
      .select()
      .from(projects)
      .where(eq(projects.title,title))
  return existingProject;
}


//get project by id
  export const getProjectById =(projectId: number) => {
    return  getRecordById(projects, projectId);
  };