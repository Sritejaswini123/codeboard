import { asc, eq, getTableName, sql } from "drizzle-orm";
import db from "../database/db";
import { type NewUser, type User, type UsersTable } from "../database/schemas/users";
import { NewProject, Project, ProjectsTable } from "../database/schemas/projects";

type DBTable = UsersTable | ProjectsTable
type NewDBRecord  = NewUser | NewProject
type DBRecordRow = User | Project

export const createRecord = async<T extends DBRecordRow>(table : DBTable , record : NewDBRecord )=>{
    const result = await db
    .insert(table)
    .values(record)
    .returning() 
    return result[0]  
}


export const getRecordById = async <DBRecordRow>(table: DBTable,id: number) => {
    const result = await db
    .select()
    .from(table)
    .where(eq(table.id,id));
    return result[0];
};

//get all users 
export const getAllRecords = async <DBRecordRow>(curent_page: number,page_size:number,table: DBTable) => {
  // const page_size = 10;
  const result = await db
    .select()
    .from(table)
    .orderBy(asc(table.id))
    .limit(page_size)
    .offset((curent_page - 1) * page_size);

  const [{ total_records }] = await db
    .select({ total_records: sql<number>`count(*)` })
    .from(table);

  const totalPages = Math.ceil(total_records / page_size);

  return {
    total_records:Number(total_records),
    curent_page, 
    page_size,
    totalPages,
    next_page: curent_page >= totalPages || totalPages === 0 ? null : curent_page + 1,
    prev_page: curent_page <= 1 ? null : curent_page - 1,
    data: result
  };
};

//delete 
export const deleteRecordById = async <DBRecordRow>(table: DBTable, id: number) => {
  const columnInfo = sql.raw(`${getTableName(table)}.id`)

    const result = await db
    .delete(table)
    .where(eq(columnInfo, id))
    .returning();
    return result[0];
  };


export const updateRecordById=async <DBRecordRow>(table:DBTable,record :  NewDBRecord,id:number) => {
  const columnInfo = sql.raw(`${getTableName(table)}.id`)
  const updatedRecord=await db
  .update(table)
  .set({
    ...record,
    updated_at:new Date()
  })
  .where(eq(columnInfo,id))
  .returning();
  return updatedRecord;
}
