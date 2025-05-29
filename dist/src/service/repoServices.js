import { eq } from "drizzle-orm";
import db from "../database/db";
import { repositories } from "../database/schemas/repo";
export const checkRepoExist = async (id) => {
    return await db
        .select()
        .from(repositories)
        .where(eq(repositories.id, id));
};
