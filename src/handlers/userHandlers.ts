// userHandlers
import { ZodError } from "zod";
import type { NewUser, User } from "../database/schemas/users.js";
import { USER_CREATED, USER_DELETEED, USER_FETCHED, USER_ID_REQUIRED, USER_NOT_FOUND, USERS_FETCHED } from "../constants/appMessages.js";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes.js";
import { users } from "../database/schemas/users.js";
import factory from "../factory.js";
import { deleteUserById, getAllUsers, getUserById } from "../service/userService.js";
import { sendResponse } from "../utils/sendResponse.js";
import { vCreateUser } from "../validations/userValidations.js";
import { createRecord } from "../service/baseDbServices.js";
import { eq } from "drizzle-orm";

type updateRecords = NewUser;

export const createUserHandlers = factory.createHandlers(async (c) => {
  try {
    const reqBody = await c.req.json();
    const validUserReq = vCreateUser.parse(reqBody);
    const userData: NewUser = {
      ...validUserReq,
      dob: new Date(validUserReq.dob),
      doj: new Date(validUserReq.doj),
    };
    const user = await createRecord<User>(users, userData);
    return sendResponse(c, CREATED, USER_CREATED, user);
  }
  catch (error) {
    if (error instanceof ZodError) {
      const errorMessage = error.errors?.[0]?.message || "Validation error";
      return c.json({ message: errorMessage }, NOT_FOUND);
    }
    return c.json({ error }, UNPROCESSABLE_ENTITY);
  }
},
);
// get user by id
export const getUserByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const userId = Number(c.req.param("user_id"));
    if (!userId) {
      return sendResponse(c, BAD_REQUEST, USER_ID_REQUIRED);
    }
    const user = await getUserById(userId);
    if (!user) {
      return sendResponse(c, NOT_FOUND, `${USER_NOT_FOUND}with user_id ${userId}`);
    }
    return sendResponse(c, OK, USER_FETCHED, user);
  }
  catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
  }
});
//getall
export const getAllUsersHandlers = factory.createHandlers(async (c) => {
  try {
    const page = Number(c.req.query("page")) || 1;
    const page_size = Number(c.req.query("page_size")) || 10;
    const userId = c.req.query("user_id");
    const filter = userId ? eq(users.id, parseInt(userId)) : undefined;
    console.log("filters fetched: ", filter);
    const userData = await getAllUsers(page, page_size, users, filter);
    console.log("Users fetched: ", userData);
    return sendResponse(c, OK, USERS_FETCHED, userData);
  } catch (error) {
    console.error("Error in getAllUsersHandlers:", error);
    return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
  }
});

// delete user by id
export const deleteUserByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const userId = Number(c.req.param("user_id"));
    const deletedUser = await deleteUserById(userId);
    return sendResponse(c, OK, USER_DELETEED, deletedUser);
  }
  catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
  }
});
// export const updateUserByIdHandlers = factory.createHandlers(async (c) => {
//   try {
//     const userId = Number(c.req.param('user_id'));
//     const reqBody = await c.req.json();

//     const validatedUserData = vUpdateUser.parse(reqBody);
//     console.log("hello")

//     const userData : any= {
//       ...validatedUserData
//     }

//     const updatedUser = await updateRecord<User>(userData,userId)
//     console.log("updated data ",updatedUser);

//     return sendResponse(c, OK, USER_CREATED, updatedUser);
//   } catch (error) {
//     if (error instanceof ZodError) {
//       const errorMessage = error.errors?.[0]?.message || 'Validation error';
//       return c.json({ message: errorMessage }, NOT_FOUND);
//     }
//     return c.json({ UNPROCESSABLE_ENTITY });
//   }

// })