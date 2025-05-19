import { asc, eq, getTableName, sql } from "drizzle-orm";
import db from "../database/db";
export const createRecord = async (table, record) => {
    const result = await db
        .insert(table)
        .values(record)
        .returning();
    return result[0];
};
export const getRecordById = async (table, id) => {
    const result = await db
        .select()
        .from(table)
        .where(eq(table.id, id));
    return result[0];
};
// get all users 
export const getAllRecords = async (curent_page, page_size, userId, table) => {
    // const page_size = 10;
    const result = await db
        .select()
        .from(table)
        .$dynamic()
        .where(userId !== undefined ? eq(table.id, userId) : undefined)
        .orderBy(asc(table.id))
        .limit(page_size)
        .offset((curent_page - 1) * page_size);
    const [{ total_records }] = await db
        .select({ total_records: sql `count(*)` })
        .from(table)
        .$dynamic()
        .where(userId !== undefined ? eq(table.id, userId) : undefined);
    const totalPages = Math.ceil(total_records / page_size);
    return {
        total_records: Number(total_records),
        curent_page,
        page_size,
        totalPages,
        next_page: curent_page >= totalPages || totalPages === 0 ? null : curent_page + 1,
        prev_page: curent_page <= 1 ? null : curent_page - 1,
        data: result
    };
};
// export const getAllRecords = async <DBRecordRow>(
//   curent_page: number,
//   page_size: number,
//   table: DBTable,
//   filterId?: number
// ) => {
//   let baseQuery = db.select().from(table).$dynamic();
//   let countQuery = db.select({ total_records: sql<number>`count(*)` }).from(table).$dynamic();
//   if (filterId !== undefined) {
//     const whereCondition = eq(table.id, filterId);
//     baseQuery = baseQuery.where(whereCondition);
//     countQuery = countQuery.where(whereCondition);
//   }
//   const result = await baseQuery
//     .orderBy(asc(table.id))
//     .limit(page_size)
//     .offset((curent_page - 1) * page_size);
//   const [{ total_records }] = await countQuery;
//   const totalPages = Math.ceil(total_records / page_size);
//   return {
//     total_records: Number(total_records),
//     curent_page,
//     page_size,
//     totalPages,
//     next_page: curent_page >= totalPages || totalPages === 0 ? null : curent_page + 1,
//     prev_page: curent_page <= 1 ? null : curent_page - 1,
//     data: result,
//   };
// };
//delete 
export const deleteRecordById = async (table, id) => {
    const columnInfo = sql.raw(`${getTableName(table)}.id`);
    const result = await db
        .delete(table)
        .where(eq(columnInfo, id))
        .returning();
    return result[0];
};
export const updateRecordById = async (table, record, id) => {
    const columnInfo = sql.raw(`${getTableName(table)}.id`);
    const updatedRecord = await db
        .update(table)
        .set({
        ...record,
        updated_at: new Date()
    })
        .where(eq(columnInfo, id))
        .returning();
    return updatedRecord;
};
