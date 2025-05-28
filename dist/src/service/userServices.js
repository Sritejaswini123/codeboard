import { eq } from "drizzle-orm";
import db from "../database/db";
import { users } from "../database/schemas/users";
import { deleteRecordById, getAllRecords, getRecordById, updateRecordById } from "./baseDbServices";
// save user
export async function createUser(userData) {
    const user = await db.insert(users).values(userData).returning();
    return user[0];
}
// get user by id
export function getUserById(userId) {
    return getRecordById(users, userId);
}
// checks users existing or not
export async function isUserExist(email) {
    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
    return existingUser;
}
// get all users
export async function getAllUsers(page, page_size, users, filter) {
    return await getAllRecords(page, page_size, users, filter);
}
// delete user by id
export async function deleteUserById(userId) {
    return await deleteRecordById(users, userId);
}
// update user by id
export async function updateUserById(userData, userId) {
    return await updateRecordById(users, userData, userId);
}
