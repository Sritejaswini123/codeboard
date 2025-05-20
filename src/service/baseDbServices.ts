import { asc, eq, getTableName, sql } from "drizzle-orm";

import type { NewProject, Project, ProjectsTable } from "../database/schemas/projects";
import type { NewUser, User, UsersTable } from "../database/schemas/users";

import db from "../database/db";

type DBTable = UsersTable | ProjectsTable;
type NewDBRecord = NewUser | NewProject;
type DBRecordRow = User | Project;

export async function createRecord<T extends DBRecordRow>(table: DBTable, record: NewDBRecord) {
  const result = await db
    .insert(table)
    .values(record)
    .returning();
  return result[0];
}

export async function getRecordById<DBRecordRow>(table: DBTable, id: number) {
  const result = await db
    .select()
    .from(table)
    .where(eq(table.id, id));
  return result[0];
}

export async function getAllRecords<DBRecordRow>(curent_page: number, page_size: number, table: DBTable, filterId?: number) {
  let baseQuery = db.select().from(table).$dynamic();
  let countQuery = db.select({ total_records: sql<number>`count(*)` }).from(table).$dynamic();

  if (filterId !== undefined) {
    const whereCondition = eq(table.id, filterId);
    baseQuery = baseQuery.where(whereCondition);
    countQuery = countQuery.where(whereCondition);
  }

  const result = await baseQuery
    .orderBy(asc(table.id))
    .limit(page_size)
    .offset((curent_page - 1) * page_size);

  const [{ total_records }] = await countQuery;

  const totalPages = Math.ceil(total_records / page_size);

  return {
    total_records: Number(total_records),
    curent_page,
    page_size,
    totalPages,
    next_page: curent_page >= totalPages || totalPages === 0 ? null : curent_page + 1,
    prev_page: curent_page <= 1 ? null : curent_page - 1,
    data: result,
  };
}

// delete
export async function deleteRecordById<DBRecordRow>(table: DBTable, id: number) {
  const columnInfo = sql.raw(`${getTableName(table)}.id`);

  const result = await db
    .delete(table)
    .where(eq(columnInfo, id))
    .returning();
  return result[0];
}

export async function updateRecordById<DBRecordRow>(table: DBTable, record: NewDBRecord, id: number) {
  const columnInfo = sql.raw(`${getTableName(table)}.id`);
  const updatedRecord = await db
    .update(table)
    .set({
      ...record,
      updated_at: new Date(),
    })
    .where(eq(columnInfo, id))
    .returning();
  return updatedRecord;
}
