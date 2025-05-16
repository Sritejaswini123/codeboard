// user service
import type { NewUser } from "../database/schemas/users.js";

import db from "../database/db.js";
import { users } from "../database/schemas/users.js";
import { deleteRecordById, getAllRecords, getRecordById } from "./base-db-services.js";

// save user
export const  createUser=async(userData: NewUser) =>{
  const user = await db.insert(users).values(userData).returning();
  return user[0];
}

// get user by id
export function getUserById(userId: number) {
  return getRecordById(users, userId);
}
// get all users
export async function getAllUsers(page: number, page_size: number) {
  return await getAllRecords(page,page_size,users);
}

// delete user by id
export async function deleteUserById(userId: number) {
  return await deleteRecordById(users, userId);
}

// export const updateUser=async(userData: UsersTable,userId: number)=>{
//   return await updateRecord<User>(userData,userId);
// }
