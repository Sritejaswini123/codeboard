import { ZodError } from "zod";
import { PROJECT_CREATED, PROJECT_EXIST, PROJECT_FETCHED, PROJECT_ID_REQUIRED, PROJECT_NOT_FOUND, PROJECTS_FETCHED } from "../constants/appMessages";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
import { NewProject, Project, projects } from "../database/schemas/projects";
import NotFoundException from "../exceptions/notFoundException";
import factory from "../factory";
import { createRecord } from "../service/baseDbServices";
import { getAllProjects, getProjectById, isProjectExist } from "../service/projectServices";
import { sendResponse } from "../utils/sendResponse";
import { vCreateProject } from "../validations/projectValidations";
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
    const page_size = Number(c.req.query("page_size"));
    const userId = c.req.query("user_id");
    const projects = await getAllProjects(page, page_size, userId);
    return sendResponse(c, OK, PROJECTS_FETCHED, projects);
  }
  catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, PROJECT_NOT_FOUND);
  }
});
//createproject

export const createProjectHandlers = factory.createHandlers(async (c) => {
  try {
    const reqBody = await c.req.json();
    const validProjectReq = vCreateProject.parse(reqBody);
    const projectData: NewProject = {
      ...validProjectReq
    }
    const existingUser = await isProjectExist(validProjectReq.title);

    if (!existingUser) {
      throw new NotFoundException(PROJECT_EXIST)
    }

    const Projcet = await createRecord<Project>(projects, projectData);

    return sendResponse(c, CREATED, PROJECT_CREATED, Projcet);
  } catch (error) {

    if (error instanceof ZodError) {
      const errorMessage = error.errors?.[0]?.message || 'Validation error';
      return c.json({ message: errorMessage }, NOT_FOUND);
    }

    return c.json({ error: error }, UNPROCESSABLE_ENTITY);

  }
}
);