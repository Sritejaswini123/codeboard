import { and, asc, eq, sql } from "drizzle-orm";
import db from "../database/db";
import { commits } from "../database/schemas/commits";
import { projects } from "../database/schemas/projects";
import { repositories } from "../database/schemas/repositories";
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