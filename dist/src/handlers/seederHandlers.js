import { createRecordMany } from "../../seeder/seederDb";
import { generateFakeUsers } from "../../seeder/userSeeder";
import { CREATED, INTERNAL_SERVER_ERROR } from "../constants/http-status-codes";
import { user_projects } from "../database/schemas/userProjects";
import { users } from "../database/schemas/users";
import factory from "../factory";
import { sendResponse } from "../utils/send-response";
export const seedUsersHandler = factory.createHandlers(async (c) => {
    try {
        const count = Number(c.req.query('count')) || 100;
        const fakeUsers = generateFakeUsers(count);
        const insertedUsers = await createRecordMany(users, fakeUsers);
        if (!Array.isArray(insertedUsers)) {
            throw new Error('User insertion failed');
        }
        return sendResponse(c, CREATED, `${insertedUsers.length} users created`, insertedUsers);
    }
    catch (error) {
        console.error('Seeder error:', error);
        return c.json({ error: 'Failed to seed users' }, 500);
    }
});
export const insertUserProjectsHandler = factory.createHandlers(async (c) => {
    try {
        const { userIds, projectId } = await c.req.json();
        if (!Array.isArray(userIds) || userIds.length === 0) {
            return c.json({ error: "userIds must be a non-empty array." }, 400);
        }
        if (!projectId || typeof projectId !== "number") {
            return c.json({ error: "projectId is required and must be a number." }, 400);
        }
        const records = userIds.map((userId) => ({
            user_id: userId,
            project_id: projectId,
            created_at: new Date(),
            updated_at: new Date(),
        }));
        const inserted = await createRecordMany(user_projects, records);
        return c.json({
            message: `Assigned ${Array.isArray(inserted) ? inserted.length : 0} users to project ID ${projectId}`,
            inserted: inserted ?? [],
        }, CREATED);
    }
    catch (err) {
        console.error("Insert user_projects failed:", err);
        return c.json({ error: "Failed to assign users to project" }, INTERNAL_SERVER_ERROR);
    }
});
// {
//   "userIds": [1, 2, 3, 4],
//   "projectId": 5
// }
