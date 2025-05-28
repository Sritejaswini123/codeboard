import type { UsersTable } from "../src/database/schemas/users";

import db from "../src/database/db";

type DBTable = UsersTable;
export async function createRecordMany<T>(table: any, records: T[]) {
  return await db.insert(table).values(records).returning();
}
