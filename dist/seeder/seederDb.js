import db from "../src/database/db";
export async function createRecordMany(table, records) {
    return await db.insert(table).values(records).returning();
}
