import db from "../src/database/db";
import { NewUser, UsersTable } from "../src/database/schemas/users";


type DBTable = UsersTable
export async function createRecordMany<T>(table: any, records: T[]) {
  return await db.insert(table).values(records).returning();
}



