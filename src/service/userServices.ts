import { eq } from "drizzle-orm";
import db from "../database/db";
import { User, users, type NewUser } from "../database/schemas/users";
import { deleteRecordById, getAllRecords, getRecordById, updateRecordById } from "./baseDbServices";




//save user 
export const createUser=async (userData: NewUser)=>{
    const  user =await db.insert(users).values(userData).returning();
    return user[0];
  }


//get user by id
  export const getUserById =(userId: number) => {
    return  getRecordById(users, userId);
  };


  //checks users existing or not
export const isUserExist=async(email:string)=>{
   const existingUser=await db
      .select()
      .from(users)
      .where(eq(users.email,email))
      .limit(1);
  return existingUser;
}



//get all users 
export const getAllUsers = async (page_no: number, page_size: number, userId: number) => {
  return await getAllRecords(page_no,page_size,userId,users);
}

//delete user by id
export const deleteUserById = async (userId: number) => {
  return await deleteRecordById(users, userId);
};
  


//update user by id
export const updateUserById=async(userData:NewUser,userId:number)=>{
  return await updateRecordById(users,userData,userId);
}
  


