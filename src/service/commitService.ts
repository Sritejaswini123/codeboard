import { and, eq,asc, sql } from "drizzle-orm";

import db from "../database/db";
import { NewCommit, commits } from "../database/schemas/commits";
import { users } from "../database/schemas/users";
import { projects } from "../database/schemas/projects";
import { user_projects } from "../database/schemas/userProjects";



// //save commit
// export const createcommit=async (commitData: NewCommit)=>{
//     const  commit =await db.insert(commits).values(commitData).returning();
//     return commit[0];
// }

// //get commit by id
// export const getCommitById =(commitId: number) => {
//   return  getRecordById(commits, commitId);
// };


//get all
  export const getAllCommits = async (
  page: number,
  page_size: number,
  project_id?: number,
  user_id?: number,
) => {
  const offset = (page - 1) * page_size
  // Check if user exists
  if (user_id) {
    const user = await db.select().from(users).where(eq(users.id, user_id));
    if (user.length === 0) {
      throw new Error("User not found");
    }
  }
  // Check if project exists
  if (project_id) {
    const project = await db.select().from(projects).where(eq(projects.id, project_id));
    if (project.length === 0) {
      throw new Error("Project not found");
    }
  }

 // Filters
   const conditions: any[] = [];

   if (project_id) conditions.push(eq(projects.id, project_id));
   if (user_id) conditions.push(eq(users.id, user_id));
   const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  //query
  const data=await db
  .select({
      id: commits.id,
      user_id: users.id,
      user_first_name:users.first_name,
      project_id: projects.id,
      project_name:projects.title,
      created_at: commits.created_at,
      updated_at: commits.updated_at,
      line_of_codes: commits.lines_of_code,
      commit_link: commits.commit_link,
      commit_message: commits.commit_name,
      
    })
    .from(commits)
    .innerJoin(user_projects, eq(commits.user_project_id, user_projects.id))
    .innerJoin(users, eq(user_projects.user_id, users.id))
    .innerJoin(projects, eq(user_projects.project_id, projects.id))
     .where(whereClause)
    .orderBy(asc(commits.id))
    .limit(page_size)
    .offset(offset);
     // Count query
  const [{ total }] = await db
    .select({
      total: sql<number>`count(*)`
    })
    .from(commits)
  const totalPages = Math.ceil(total / page_size);

  return {
    total_records: total,
    page,
    page_size,
    totalPages,
    next_page: page < totalPages ? page + 1 : null,
    prev_page: page > 1 ? page - 1 : null,
    data,
  };
};
  