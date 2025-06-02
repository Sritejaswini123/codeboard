import { eq } from "drizzle-orm";

import db from "../database/db";
import { repositories } from "../database/schemas/repositories";

export async function checkRepoExist(id: number) {
  return await db.select()
    .from(repositories)
    .where(eq(repositories.id, id));
}
