import { and, eq,asc, sql } from "drizzle-orm";

import db from "../database/db";
import { NewCommit, commits } from "../database/schemas/commits";
import { users } from "../database/schemas/users";
import { projects } from "../database/schemas/projects";
import { user_projects } from "../database/schemas/userProjects";


import {  getAllRecords, getRecordById } from "./baseDbServices";


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
  user_id?: number
) => {
  const offset = (page - 1) * page_size

 // Filters
   const conditions: any[] = [];

   if (project_id) conditions.push(eq(projects.id, project_id));
   if (user_id) conditions.push(eq(users.id, user_id));
   const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  //query
  const data=await db
  .select({
      id: commits.id,
      line_of_codes: commits.lines_of_code,
      commit_link: commits.commit_link,
      commit_message: commits.commit_name,
      created_at: commits.created_at,
      updated_at: commits.updated_at,
      user_id: users.id,
      user_name: users.first_name,
      project_id: projects.id,
      project_name: projects.title,
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
    .innerJoin(user_projects, eq(commits.user_project_id, user_projects.id))
    .innerJoin(users, eq(user_projects.user_id, users.id))
    .innerJoin(projects, eq(user_projects.project_id, projects.id))
    .where(whereClause ?? sql`TRUE`); // fallback to TRUE if no filter

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
  