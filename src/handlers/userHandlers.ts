// import { eq } from "drizzle-orm";
// // userHandlers
// import { ZodError } from "zod";

// import type { NewUser, User } from "../database/schemas/users.js";

// import { USER_CREATED, USER_DELETEED, USER_FETCHED, USER_ID_REQUIRED, USER_NOT_FOUND, USERS_FETCHED } from "../constants/appMessages.js";
// import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes.js";
// import { users } from "../database/schemas/users.js";
// import factory from "../factory.js";
// import { createRecord } from "../service/baseDbServices.js";
// import { deleteUserById, getAllUsers, getUserById } from "../service/userServices.js";
// import { sendResponse } from "../utils/sendResponse.js";
// import { vCreateUser } from "../validations/userValidations.js";

// export const createUserHandlers = factory.createHandlers(async (c) => {
//   try {
//     const reqBody = await c.req.json();
//     const validUserReq = vCreateUser.parse(reqBody);
//     const userData: NewUser = {
//       ...validUserReq,
//       dob: new Date(validUserReq.dob),
//       doj: new Date(validUserReq.doj),
//     };
//     const user = await createRecord<User>(users, userData);
//     return sendResponse(c, CREATED, USER_CREATED, user);
//   }
//   catch (error) {
//     if (error instanceof ZodError) {
//       const errorMessage = error.errors?.[0]?.message || "Validation error";
//       return c.json({ message: errorMessage }, NOT_FOUND);
//     }
//     return c.json({ error }, UNPROCESSABLE_ENTITY);
//   }
// },
// );
// // get user by id
// export const getUserByIdHandlers = factory.createHandlers(async (c) => {
//   try {
//     const userId = Number(c.req.param("user_id"));
//     if (!userId) {
//       return sendResponse(c, BAD_REQUEST, USER_ID_REQUIRED);
//     }
//     const user = await getUserById(userId);
//     if (!user) {
//       return sendResponse(c, NOT_FOUND, `${USER_NOT_FOUND}with user_id ${userId}`);
//     }
//     return sendResponse(c, OK, USER_FETCHED, user);
//   }
//   catch (error) {
//     return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
//   }
// });
// // getall
// export const getAllUsersHandlers = factory.createHandlers(async (c) => {
//   try {
//     const page = Number(c.req.query("page")) || 1;
//     const page_size = Number(c.req.query("page_size")) || 10;
//     const userId = c.req.query("user_id");
//     const filter = userId ? eq(users.id, Number.parseInt(userId)) : undefined;
//     console.log("filters fetched: ", filter);
//     const userData = await getAllUsers(page, page_size, users, filter);
//     console.log("Users fetched: ", userData);
//     return sendResponse(c, OK, USERS_FETCHED, userData);
//   }
//   catch (error) {
//     console.error("Error in getAllUsersHandlers:", error);
//     return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
//   }
// });

// // delete user by id
// export const deleteUserByIdHandlers = factory.createHandlers(async (c) => {
//   try {
//     const userId = Number(c.req.param("user_id"));
//     const deletedUser = await deleteUserById(userId);
//     return sendResponse(c, OK, USER_DELETEED, deletedUser);
//   }
//   catch (error) {
//     return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
//   }
// });
// // export const updateUserByIdHandlers = factory.createHandlers(async (c) => {
// //   try {
// //     const userId = Number(c.req.param('user_id'));
// //     const reqBody = await c.req.json();

// //     const validatedUserData = vUpdateUser.parse(reqBody);
// //     console.log("hello")

// //     const userData : any= {
// //       ...validatedUserData
// //     }

// //     const updatedUser = await updateRecord<User>(userData,userId)
// //     console.log("updated data ",updatedUser);

// //     return sendResponse(c, OK, USER_CREATED, updatedUser);
// //   } catch (error) {
// //     if (error instanceof ZodError) {
// //       const errorMessage = error.errors?.[0]?.message || 'Validation error';
// //       return c.json({ message: errorMessage }, NOT_FOUND);
// //     }
// //     return c.json({ UNPROCESSABLE_ENTITY });
// //   }

// // })






import { eq } from "drizzle-orm";
import { z } from "zod";
import type { NewUser, User } from "../database/schemas/users";
import { USER_CREATED, USER_DELETEED, USER_EXIST, USER_FETCHED, USER_ID_REQUIRED, USER_NOT_FOUND, USER_UPDATED, USERS_FETCHED, VALIDATION_ERRORS } from "../constants/appMessages";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
import { users } from "../database/schemas/users";
import NotFoundException from "../exceptions/notFoundException";
import factory from "../factory";
import { createRecord, getAllRecords, getRecordById, updateRecordById } from "../service/baseDbServices";
import { deleteUserById, getAllUsers, isUserExist } from "../service/userServices";
import { sendResponse } from "../utils/sendResponse";
import { vCreateUser } from "../validations/userValidations";

// save record
export const createUserHandlers = factory.createHandlers(async (c) => {
  try {
    const reqBody = await c.req.json();
    const validUserReq = vCreateUser.parse(reqBody);
    const userData: NewUser = {
      ...validUserReq,
      dob: new Date(validUserReq.dob),
      doj: new Date(validUserReq.doj),
    };
    const existingUser = await isUserExist(validUserReq.email);
    if (!existingUser) {
      throw new NotFoundException(USER_EXIST);
    }
    const user = await createRecord<User>(users, userData);
    return sendResponse(c, CREATED, USER_CREATED, user);
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = Object.fromEntries(
        error.errors.map(({path,message})=>[path[0],message])
      );
      return sendResponse(c, UNPROCESSABLE_ENTITY,VALIDATION_ERRORS,formattedErrors);
    }

   throw error;
  }
});

// get by id
export const getUserByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const userId = Number(c.req.param("user_id"));

    if (!userId)return sendResponse(c, BAD_REQUEST, USER_ID_REQUIRED);

    const user = await getRecordById(users, userId);

    if (!user)throw new NotFoundException(USER_NOT_FOUND);

    return sendResponse(c, OK, USER_FETCHED, user);
  }
  catch (error) {

    throw error;
  }
});

//get all users
export const getAllUsersHandlers = factory.createHandlers(async (c) => {
  try {
    const page = Number(c.req.query("page")) || 1;
    const page_size = Number(c.req.query("page_size")) || 10;
    const userId = c.req.query("user_id");
    const filter = userId ? eq(users.id, Number.parseInt(userId)) : undefined;
    console.log("filters fetched: ", filter);
    const userData = await getAllRecords(page, page_size, users, filter);
    console.log("Users fetched: ", userData);
    return sendResponse(c, OK, USERS_FETCHED, userData);
  }
  catch (error) {
    console.error("Error in getAllUsersHandlers:", error);
    return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
  }
});

// delete user by id
export const deleteUserByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const userId = Number(c.req.param("user_id"));
    if (!userId) {
      return sendResponse(c, BAD_REQUEST, USER_ID_REQUIRED);
    }
    const deletedUser = await deleteUserById(userId);
    if (!deletedUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return sendResponse(c, OK, USER_DELETEED, deletedUser);
  }
  catch (error) {
    
   throw error;
  }
});

// update record
export const updateUserByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const userId = Number(c.req.param("user_id"));
    if (!userId) {
      return sendResponse(c, BAD_REQUEST, USER_ID_REQUIRED);
    }

    const reqBody = await c.req.json();

    const validatedUser = vCreateUser.parse(reqBody);

    const userData: NewUser = {
      ...validatedUser,
      dob: new Date(validatedUser.dob),
      doj: new Date(validatedUser.doj),
    };

    const result = await updateRecordById(users, userData, userId);
    return sendResponse(c, OK, USER_UPDATED, result);
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = Object.fromEntries(
        error.errors.map(({path,message})=>[path[0],message])
      );
      return sendResponse(c, UNPROCESSABLE_ENTITY,VALIDATION_ERRORS,formattedErrors);
    }

   throw error;
  }
});