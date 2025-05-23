import db from "../database/db.js";
import { users } from "../database/schemas/users.js";
import { deleteRecordById, getAllRecords, getRecordById } from "./baseDbServices.js";
// save user
export const createUser = async (userData) => {
    const user = await db.insert(users).values(userData).returning();
    return user[0];
};
// get user by id
export function getUserById(userId) {
    return getRecordById(users, userId);
}
// get all users
export async function getAllUsers(page, page_size, users, filter) {
    return await getAllRecords(page, page_size, users, filter);
}
// delete user by id
export async function deleteUserById(userId) {
    return await deleteRecordById(users, userId);
}
// //update user
// export const updateUser=async(userData: UsersTable,userId: number,userRecord:NewUser)=>{
//   return await updateRecordById<User>(userData,userId,userRecord);
// }
