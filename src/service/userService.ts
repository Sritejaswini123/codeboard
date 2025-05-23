// user service
import type { NewUser, UsersTable } from "../database/schemas/users.js";

import db from "../database/db.js";
import { users } from "../database/schemas/users.js";
import { deleteRecordById, getAllRecords, getRecordById, updateRecordById } from "./baseDbServices.js";

// save user
export const createUser = async (userData: NewUser) => {
  const user = await db.insert(users).values(userData).returning();
  return user[0];
}

// get user by id
export function getUserById(userId: number) {
  return getRecordById(users, userId);
}
// get all users
export async function getAllUsers(page: number, page_size: number, users: UsersTable, filter: any) {
  return await getAllRecords(page, page_size, users, filter);
}

// delete user by id
export async function deleteUserById(userId: number) {
  return await deleteRecordById(users, userId);
}
//update userby id
export async function updateUserById(userId: number,userData:NewUser) {
  return await updateRecordById(users,userData, userId);
}