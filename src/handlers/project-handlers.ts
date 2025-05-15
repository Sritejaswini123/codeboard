import { PROJECT_FETCHED, PROJECT_ID_REQUIRED, PROJECT_NOT_FOUND, USER_ID_REQUIRED } from "../constants/app-messages";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http-status-codes";
import factory from "../factory";
import { sendResponse } from "../utils/send-response";
import { getProjectById } from "../service/project-services";

export const getProjectByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const projectId = Number(c.req.param("project_id"));
    if (!projectId) {
      return sendResponse(c, BAD_REQUEST, PROJECT_ID_REQUIRED);
    }
    const project = await getProjectById(projectId);
    if (!project) {
      return sendResponse(c, NOT_FOUND, `${PROJECT_NOT_FOUND}with project_id ${projectId}`);
    }
    return sendResponse(c, OK, PROJECT_FETCHED, project);
  }
  catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, PROJECT_NOT_FOUND);
  }
});
