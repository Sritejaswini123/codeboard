import { eq } from "drizzle-orm";
import db from "../database/db";
import { NewProject} from "../database/schemas/projects";




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