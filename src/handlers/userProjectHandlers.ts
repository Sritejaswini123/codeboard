import { USER_FETCHED, USER_ID_REQUIRED, USER_NOT_FOUND } from "../constants/appMessages";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/httpStatusCodes";
import factory from "../factory";
import { getUserWithProjects } from "../service/userProjectsServices";
import { sendResponse } from "../utils/sendResponse";

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

    //const page = Number(c.req.query("page"));
    //const page_size = Number(c.req.query("page_size"));
    const includeProjects = c.req.query("projects") === "true";

    const user = await getUserWithProjects(userId,  includeProjects);

    if (!user) {
      return sendResponse(c, NOT_FOUND, `${USER_NOT_FOUND} with user_id ${userId}`);
    }

    return sendResponse(c, OK, USER_FETCHED, user);
  } catch (error) {
    console.error("Error in getUserByIdHandlers:", error);
    return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
  }
});