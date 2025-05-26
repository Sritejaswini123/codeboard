import z from "zod";
import { PROJECT_CREATED, USER_FETCHED, USER_ID_REQUIRED, USER_NOT_FOUND } from "../constants/appMessages";
import { BAD_REQUEST, CONFLICT, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
import factory from "../factory";
import { assignUserToProject,  getUserWithProjects, isUserAlreadyAssigned } from "../service/userProjectsServices";
import { sendResponse } from "../utils/sendResponse";
import { vCreateProject } from "../validations/projectValidations";
import { vCreateUserProject } from "../validations/userProjectValidations";

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
//create user Project
export const createUserProjectHandler = factory.createHandlers(async (c) => {
  try {
    const reqBody = await c.req.json();
    const validData = vCreateUserProject.parse(reqBody);

    const { user_id, project_id } = validData;

    const alreadyExists = await isUserAlreadyAssigned(user_id, project_id);
    if (alreadyExists) {
      return sendResponse(c, CONFLICT, "User is already assigned to this project");
    }

    const userProject = await assignUserToProject(validData);

    return sendResponse(c, CREATED, "User assigned to project successfully", userProject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formatted = Object.fromEntries(error.errors.map(e => [e.path[0], e.message]));
      return sendResponse(c, UNPROCESSABLE_ENTITY, "Validation errors", formatted);
    }

    return sendResponse(c, INTERNAL_SERVER_ERROR, "Failed to assign user to project");
  }
});

