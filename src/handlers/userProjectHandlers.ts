import { number } from "zod";
import { USER_FETCHED, USER_ID_REQUIRED, USER_NOT_FOUND } from "../constants/appMessages";
import { BAD_REQUEST, NOT_FOUND, OK } from "../constants/httpStatusCodes";
import { users } from "../database/schemas/users";
import factory from "../factory";
import { getRecordById } from "../service/baseDbServices";
import { getUserProfile, getUserProjects } from "../service/userProjectServices";
import { sendResponse } from "../utils/sendResponse";

// user_info+project_info
export const userProfileHandler = factory.createHandlers(async (c) => {
  try {
    const userId = Number(c.req.param("id"));
    
    if (!userId || isNaN(userId))return c.json(USER_ID_REQUIRED, BAD_REQUEST);

    const isUserExist = await getRecordById(users, userId);
  
    
    if (!isUserExist)
      throw new Error(`${USER_NOT_FOUND} with id ${userId}`);

    const userProject = await getUserProfile(userId);
    
    return sendResponse(c, OK, USER_FETCHED, userProject);
  }
  catch (error) {
    console.log(error);
    throw (error);
  }
});


export const userProjectsProfileHandler = factory.createHandlers(async (c) => {
  try {
    const userId = Number(c.req.param("id"));

    if (!userId || isNaN(userId)) return c.json({message:USER_ID_REQUIRED})

    const isUserExist = await getRecordById(users, userId);

    if (!isUserExist) return c.json({status: NOT_FOUND,success: false,message:`${USER_NOT_FOUND} with id ${userId}`})
     
    const includeProjects = c.req.query("projects") === "true";

    const result = await getUserProjects(userId, includeProjects);

    return sendResponse(c, OK, USER_FETCHED, result);
  } catch (error) {
    console.log(error);
    throw error;
  }
});
