import { createRecordMany } from "../../seeder/seederDb";
import { generateFakeUsers } from "../../seeder/userSeeder";
import { CREATED } from "../constants/http-status-codes";
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
  } catch (error) {
    console.error('Seeder error:', error);
    return c.json({ error:'Failed to seed users' }, 500);
  }
});
