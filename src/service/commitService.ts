import db from "../database/db"
import { commits } from "../database/schemas/commits"
import { eq } from "drizzle-orm";




export const checkCommitExist=async(id:number)=>{
    const result=await db
    .select()
    .from(commits)
    .where(eq(commits.id,id))
    return result[0];
}