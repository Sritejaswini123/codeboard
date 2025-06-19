import { and, asc, between, count, countDistinct, eq, sql } from "drizzle-orm";

import db from "../database/db";
import { commits } from "../database/schemas/commits";
import { projects } from "../database/schemas/projects";
import { repositories } from "../database/schemas/repo";
import { users } from "../database/schemas/users";


export async function getAllCommits(page: number, page_size: number, project_id?: number, user_id?: number, repository_id?: number) {
  const offset = (page - 1) * page_size;

  // Filters
  const conditions: any[] = [];
  if (project_id)
    conditions.push(eq(projects.id, project_id));
  if (user_id)
    conditions.push(eq(users.id, user_id));
  if (repository_id)
    conditions.push(eq(repositories.id, repository_id));
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  // query
  const data = await db
    .select({
      id: commits.id,
      user_id: users.id,
      user_first_name: users.first_name,
      project_id: projects.id,
      project_name: projects.title,
      repository_id: repositories.id,
      date: commits.date,
      time: commits.time,
      line_of_codes: commits.lines_of_code,
      commit_link: commits.commit_link,
      commit_message: commits.commit_message,
    })
    .from(commits)
    .innerJoin(users, eq(commits.user_id, users.id))
    .innerJoin(projects, eq(commits.project_id, projects.id))
    .innerJoin(repositories, eq(commits.repository_id, repositories.id))
    .where(whereClause)
    .orderBy(asc(commits.id))
    .limit(page_size)
    .offset(offset);
  // count total no of commits
  const [{ total }] = await db
    .select({
      total: sql<number>`count(*)`,
    })
    .from(commits);
  const totalPages = Math.ceil(total / page_size);

  return {
    total_records: Number(total),
    page,
    page_size,
    totalPages,
    next_page: page < totalPages ? page + 1 : null,
    prev_page: page > 1 ? page - 1 : null,
    data,
  };
}

export async function checkCommitExist(id: number) {
  const result = await db.select().from(commits).where(eq(commits.id, id));
  return result[0];
}

//status count
export const statusCount = async () => {
  const result = await db
    .select({
      total_commits: countDistinct(commits.id).as("total_commits"),
      total_users: countDistinct(users.id).as("total_users"),
      total_projects: countDistinct(projects.id).as("total_projects"),
      total_active_repos: countDistinct(repositories.id).as("total_active_repos"),
    })
    .from(commits)
    .leftJoin(users,eq(commits.user_id, users.id))
    .leftJoin(projects,eq(commits.project_id, projects.id))
    .leftJoin(repositories, eq(commits.repository_id,repositories.id))
    .where(eq(projects.is_active, true));

  return result[0];
};

// //average commits 
// export const  averageCommits = async(startDate: Date, endDate: Date)=>{
//   const [{total_commits}]=await db
//   .select({
//     total_commits: count(commits.id).as("total_commits"),
//   })
//   .from(commits)
//   .where(between(commits.created_at,startDate,endDate));

//   const days = Math.max(1, Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24)));
//   const weeks = Math.max(1, days / 7);
//   const months = Math.max(1, days / 30.44);

//   const perDay = Math.round(total_commits / days);
//   const perWeek = Math.round(total_commits / weeks);
//   const perMonth = Math.round(total_commits / months);

//   return{
//     perDay:perDay,
//     perWeek:perWeek,
//     perMonth:perMonth
//   }

// } 



// /average commits 
export const averageCommits = async(startDate: Date, endDate: Date)=>{

  // Ensure at least 7 days range for meaningful weekly average
  const minEndDate = new Date(startDate);
  minEndDate.setDate(minEndDate.getDate() + 6);
  if (endDate < minEndDate) {
    endDate = minEndDate;
  }

  const [{total_commits}]=await db
  .select({
    total_commits: count(commits.id).as("total_commits"),
  })
  .from(commits)
  .where(between(commits.created_at,startDate,endDate));

  const days = Math.max(1, Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24)));
  const weeks = Math.max(1, days / 7);
  const months = Math.max(1, days / 30.44);

  const perDay = Math.round(total_commits / days);
  const perWeek = Math.round(total_commits / weeks);
  const perMonth = Math.round(total_commits / months);

  return{
    perDay:perDay,
    perWeek:perWeek,
    perMonth:perMonth
  }

}
