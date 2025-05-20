import { eq } from "drizzle-orm";
import db from "../database/db";
import { projects } from "../database/schemas/projects";
// //save user 
// export const createProject=async (userData: NewProject)=>{
//     const  user =await db.insert(projects).values(userData).returning();
//     return user[0];
// }
// export const isProjectExist=async(title:string)=>{
//    const existingProject=await db
//       .select()
//       .from(projects)
//       .where(eq(projects.title,title))
//   return existingProject;
// }
//check if project is existing with id
export const deletedProjectById = async (projectId) => {
    const result = await db
        .select()
        .from(projects)
        .where(eq(projects.id, projectId));
    return result[0];
};
