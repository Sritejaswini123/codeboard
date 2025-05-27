import { and, asc, eq, getTableName, like, or, sql } from "drizzle-orm";
import { users } from "../database/schemas/users";
import db from "../database/db";
export async function createRecord(table, record) {
    const result = await db
        .insert(table)
        .values(record)
        .returning();
    return result[0];
}
export async function getRecordById(table, id) {
    const result = await db
        .select()
        .from(table)
        .where(eq(table.id, id));
    return result[0];
}
export async function getAllRecords(page, page_size, table, filter) {
    const result = await db
        .select()
        .from(table)
        .where(filter)
        .orderBy(asc(table.id))
        .limit(page_size)
        .offset((page - 1) * page_size);
    const [{ total_records }] = await db
        .select({ total_records: sql `count(*)` })
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
export async function deleteRecordById(table, id) {
    const columnInfo = sql.raw(`${getTableName(table)}.id`);
    const result = await db
        .delete(table)
        .where(eq(columnInfo, id))
        .returning();
    return result[0];
}
export async function updateRecordById(table, record, id) {
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
export async function getPaginatedRecords(table, curent_page, page_size, username, id) {
    let filterCondition = undefined;
    if (table === users) {
        if (username && id !== undefined) {
            filterCondition = and(or(like(users.first_name, `%${username}%`), like(users.email, `%${username}%`)), eq(users.id, id));
        }
        else if (username) {
            filterCondition = or(like(users.first_name, `%${username}%`), like(users.email, `%${username}%`));
        }
        else if (id !== undefined) {
            filterCondition = eq(users.id, id);
        }
    }
    else {
        if (id !== undefined) {
            filterCondition = eq(table.id, id);
        }
    }
    const result = await db
        .select()
        .from(table)
        .where(filterCondition)
        .orderBy(asc(table.id))
        .limit(page_size)
        .offset((curent_page - 1) * page_size);
    const [{ total_records }] = await db
        .select({ total_records: sql `count(*)` })
        .from(table)
        .where(filterCondition);
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
