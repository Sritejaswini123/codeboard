import { ZodError } from "zod";
import { USER_CREATED, USER_DELETEED, USER_EXIST, USER_FETCHED, USER_ID_REQUIRED, USER_NOT_FOUND, USER_UPDATED, USERS_FETCHED } from "../constants/app-messages";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "../constants/http-status-codes";
import { users, type NewUser, type User } from "../database/schemas/users";
import NotFoundException from "../exceptions/not-found-exception";
import factory from "../factory";
import { createUser, getRecordById, updateRecordById } from "../service/base-db-services";
import { deleteUserById, getAllUsers, isUserExist } from "../service/user-service";
import { sendResponse } from "../utils/send-response";
import { vCreateUser } from "../validations/user-validations";




export const createUserHandlers = factory.createHandlers(async (c) => {
  try {
    const reqBody = await c.req.json();  
    console.log("one---->",reqBody);
    
    const validUserReq = vCreateUser.parse(reqBody);
    console.log("two---->",reqBody);
    const userData: NewUser = {
      ...validUserReq,
      dob: new Date(validUserReq.dob),
      doj: new Date(validUserReq.doj),
    }
     console.log("three---->",userData);    
    const existingUser=await isUserExist(validUserReq.email);

   if(!existingUser){
    throw new NotFoundException(USER_EXIST)
    }
   
    // if user exist 
    // if (existingUser.length > 0) {
    //   return c.json({USER_EXIST}, CONFLICT);
    // }

    const user = await createUser<User>(users, userData);

    return sendResponse(c, CREATED, USER_CREATED, user);
  } catch (error) {

    if (error instanceof ZodError) {
      const errorMessage = error.errors?.[0]?.message || 'Validation error';
      return c.json({ message: errorMessage }, NOT_FOUND);
    }
    
    return c.json({ error: error }, UNPROCESSABLE_ENTITY);

  }
}
);



export const getUserByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const userId = Number(c.req.param('user_id'));

    if (!userId) {
      return sendResponse(c, BAD_REQUEST, USER_ID_REQUIRED);
    }
    const user= await getRecordById(users,userId);
    
     //if user exist 
    // if (!user) {
    //   return sendResponse(c, NOT_FOUND,USER_NOT_FOUND+`with user_id ${userId}`);
    // }
      if (!user) {
        throw new NotFoundException(USER_NOT_FOUND);
      }
    return sendResponse(c, OK, USER_FETCHED, user);
  } catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
  }
});



//get all users
export const getAllUsersHandlers = factory.createHandlers(async (c) => {
  try {
    const page=Number(c.req.query('page_no'));
     const page_size=Number(c.req.query('page_size'));
    const user = await getAllUsers(page,page_size);
    return sendResponse(c, OK, USERS_FETCHED, user);
  } catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
  }
});

//delete user by id
export const deleteUserByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const userId = Number(c.req.param('user_id'));
      if (!userId) {
      return sendResponse(c, BAD_REQUEST, USER_ID_REQUIRED);
    }
    const deletedUser = await deleteUserById(userId);
    if (!deletedUser) {
        throw new NotFoundException(USER_NOT_FOUND);
      }
    return sendResponse(c, OK, USER_DELETEED, deletedUser);
  } catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
  }

});


export const updateUserByIdHandlers=factory.createHandlers(async(c)=>{
  try { 
    const userId=Number(c.req.param('user_id'));
    if (!userId) {
      return sendResponse(c, BAD_REQUEST, USER_ID_REQUIRED);
    }

    const reqBody= await c.req.json();
    
    
    const validatedUser=vCreateUser.parse(reqBody);

    
    const userData:NewUser={
      ...validatedUser,
      dob: new Date(validatedUser.dob),
      doj: new Date(validatedUser.doj),
    }
    
    const result=await updateRecordById(users,userData,userId);
    return sendResponse(c,OK,USER_UPDATED,result);
  } catch (error) {
     if (error instanceof ZodError) {
      const errorMessage = error.errors?.[0]?.message || 'Validation error';
      return c.json({ message: errorMessage }, NOT_FOUND);
    }
    
    return c.json({ error: error }, UNPROCESSABLE_ENTITY);
  }
})


