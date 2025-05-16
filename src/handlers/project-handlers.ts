import { PROJECT_FETCHED, PROJECT_ID_REQUIRED, PROJECT_NOT_FOUND, USER_ID_REQUIRED, PROJECTS_FETCHED } from "../constants/app-messages";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http-status-codes";
import factory from "../factory";
import { sendResponse } from "../utils/send-response";
import { getAllProjects, getProjectById } from "../service/project-services";
//get by id
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
//getall 
export const getAllProjectsHandlers = factory.createHandlers(async (c) => {
  try {
    const page = Number(c.req.query("page"));
    const page_size=Number(c.req.query("page_size"));
    const projects = await getAllProjects(page,page_size);
    return sendResponse(c, OK, PROJECTS_FETCHED, projects);
  }
  catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, PROJECT_NOT_FOUND);
  }
});
//create project