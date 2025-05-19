// base-db services
import { asc, eq, getTableName, sql } from "drizzle-orm";

import type { NewUser, User, UsersTable } from "../database/schemas/users.js";
import type { NewProject, Project, ProjectsTable } from "../database/schemas/projects.js";


import db from "../database/db.js";

type DBTable = UsersTable | ProjectsTable;
type NewDBRecord = NewUser | NewProject;
type DBRecordRow = User | Project;

export const createRecord = async<T extends DBRecordRow>(table: DBTable, record: NewDBRecord) => {
  const result = await db.insert(table).values(record).returning();
  return result[0];
}
// getRecordById
export async function getRecordById<DBRecordRow>(table: DBTable, id: number) {
  const result = await db.select().from(table).where(eq(table.id, id));
  return result[0];
}
// get all record
export async function getAllRecords<DBRecordRow>(page: number, page_size: number, table: DBTable, filter: any) {


  const result = await db
    .select()
    .from(table)
    .where(filter)
    .orderBy(asc(table.id))
    .limit(page_size)
    .offset((page - 1) * page_size);

  const [{ total_records }] = await db
    .select({ total_records: sql<string>`count(*)` }) // use string here explicitly
    .from(table)
    .where(filter)


  const totalRecordsNumber = Number(total_records);
  const totalPages = Math.ceil(totalRecordsNumber / page_size);

  return {
    total_records: totalRecordsNumber,
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
  const result = await db
    .delete(table)
    .where(eq(table.id, id))
    .returning();
  return result[0];
}

// update user
export async function updateRecordById<DBRecordRow>(table: DBTable, record: any, id: number) {
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
