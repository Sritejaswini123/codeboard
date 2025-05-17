import { and, eq } from "drizzle-orm";

import db from "../database/db";
import { NewCommit, commits } from "../database/schemas/commits";
import { deleteRecordById, getAllRecords, getRecordById, updateRecordById } from "./baseDbServices";




//save commit
export const createcommit=async (commitData: NewCommit)=>{
    const  commit =await db.insert(commits).values(commitData).returning();
    return commit[0];
}


//get all
  export const getAllCommits = async (
  page: number,
  page_size: number,
  project_id?: number,
  user_id?: number
) => {


  const conditions = [];

  if (project_id) {
    conditions.push(eq(commits.project_id, project_id));
  }

  if (user_id) {
    conditions.push(eq(commits.user_id, user_id));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return await getAllRecords(page, page_size, commits, whereClause);
};


//get commit by id
export const getCommitById =(commitId: number) => {
  return  getRecordById(commits, commitId);
};