import { asc, eq, getTableName, sql } from "drizzle-orm";

import type { Commit, CommitsTable, NewCommit } from "../database/schemas/commits";
import type { NewProject, Project, ProjectsTable } from "../database/schemas/projects";
import type { NewUser, User, UsersTable } from "../database/schemas/users";

import db from "../database/db";

type DBTable = UsersTable | ProjectsTable | CommitsTable;
type NewDBRecord = NewUser | NewProject | NewCommit;
type DBRecordRow = User | Project | Commit;

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

// get all
export async function getAllRecords<DBRecordRow>(page: number, page_size: number, table: DBTable, filter: any) {
  const result = await db
    .select()
    .from(table)
    .where(filter)
    .orderBy(asc(table.id))
    .limit(page_size)
    .offset((page - 1) * page_size);

  const [{ total_records }] = await db
    .select({ total_records: sql<number>`count(*)` })
    .from(table)
    .where(filter);

  const totalPages = Math.ceil(total_records / page_size);

  return {
    total_records: Number(total_records),
    page,
    page_size,
    totalPages,
    next_page: page >= totalPages || totalPages === 0 ? null : page + 1,
    prev_page: page <= 1 ? null : page - 1,
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
