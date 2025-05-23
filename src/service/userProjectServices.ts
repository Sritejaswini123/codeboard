import { eq } from "drizzle-orm";
import db from "../database/db";
import { user_projects } from "../database/schemas/userProjects";
import { USER_NOT_FOUND } from "../constants/appMessages";
import { projects } from "../database/schemas/projects";
import { users } from "../database/schemas/users";



export const userProjectExist=async(userProjectId:number)=>{
    const result=await db
    .select({id:user_projects.id})
    .from(user_projects)
    .where(eq(user_projects.id, userProjectId));
    return result[0];
}


//user profile data
export const getUserProfile=async(userId:number)=>{

  const user=await db
  .select()
  .from(users)
  .where(eq(users.id,userId));

  if(user.length===0){
    return (USER_NOT_FOUND)
  }
   
  const userProjects=await db
  .select({
    id:projects.id,
    name:projects.title,
    description:projects.description,
    is_active:projects.is_active
  })
  .from(user_projects)
  .innerJoin(projects,eq(user_projects.project_id,projects.id))
  .where(eq(user_projects.user_id,userId));

  return{
    user:user[0],
    userProjects:userProjects.length > 0 ? userProjects:[] 
  }

}
