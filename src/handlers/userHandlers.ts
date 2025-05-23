// userHandlers
import { ZodError } from "zod";
import type { NewUser, User } from "../database/schemas/users.js";
import { USER_CREATED, USER_DELETEED, USER_FETCHED, USER_ID_REQUIRED, USER_NOT_FOUND, USERS_FETCHED } from "../constants/appMessages.js";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes.js";
import { users } from "../database/schemas/users.js";
import factory from "../factory.js";
import { deleteUserById, getAllUsers, getUserWithProjects } from "../service/userService.js";
import { sendResponse } from "../utils/sendResponse.js";
import { vCreateUser, vUpdateUser } from "../validations/userValidations.js";
import { createRecord, updateRecordById } from "../service/baseDbServices.js";
import { eq } from "drizzle-orm";


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
// //getusebyid with projects
// export const getUserHandler = factory.createHandlers(async (c) => {
//   const idParam = c.req.param("id");
//   const userId = Number(idParam);
// // const includeProjects = c.req.query("project") === "true";

//   if (isNaN(userId)) {
//     return sendResponse(c, 400, "Invalid user ID");
//   }

//   const result = await getUserWithProjects(userId);

//   if (!result) {
//     return sendResponse(c, 404, "User not found");
//   }

//   return sendResponse(c, 200, "User fetched successfully", result);
// });

export const getUserByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const userIdParam = c.req.param("user_id");

    if (!userIdParam) {
      return sendResponse(c, BAD_REQUEST, USER_ID_REQUIRED);
    }

    const userId = parseInt(userIdParam);

    if (isNaN(userId)) {
      return sendResponse(c, BAD_REQUEST, "Invalid user ID");
    }

    const page = Number(c.req.query("page"));
    const page_size = Number(c.req.query("page_size"));
    const includeProjects = c.req.query("projects") === "true";

    const user = await getUserWithProjects(userId, page, page_size, includeProjects);

    if (!user) {
      return sendResponse(c, NOT_FOUND, `${USER_NOT_FOUND} with user_id ${userId}`);
    }

    return sendResponse(c, OK, USER_FETCHED, user);
  } catch (error) {
    console.error("Error in getUserByIdHandlers:", error);
    return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
  }
});

//getall
export const getAllUsersHandlers = factory.createHandlers(async (c) => {
  try {
    const page = Number(c.req.query("page")) || 1;
    const page_size = Number(c.req.query("page_size"));
    const userId = c.req.query("user_id");
    const filter = userId ? eq(users.id, parseInt(userId)) : undefined;
    console.log("filters fetched: ", filter);
    const userData = await getAllUsers(page, page_size, users, filter);
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
    const deletedUser = await deleteUserById(userId);
    return sendResponse(c, OK, USER_DELETEED, deletedUser);
  }
  catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
  }
});
//update user
export const updateUserByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const userId = Number(c.req.param('user_id'));
    const reqBody = await c.req.json();

    const validatedUserData = vUpdateUser.parse(reqBody);
    console.log("hello")

    const userData : any= {
      ...validatedUserData,
      dob: new Date(validatedUserData.dob),
      doj: new Date(validatedUserData.doj),
    }

    const updatedUser = await updateRecordById(users,userData,userId)
    console.log("updated data ",updatedUser);

    return sendResponse(c, OK, USER_CREATED, updatedUser);
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage = error.errors?.[0]?.message || 'Validation error';
      return c.json({ message: errorMessage }, NOT_FOUND);
    }
    return c.json({ UNPROCESSABLE_ENTITY });
  }

})
