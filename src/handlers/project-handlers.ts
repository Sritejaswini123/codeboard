import { ZodError } from "zod";
import { PROJECT_CREATED, PROJECT_EXIST, PROJECT_FETCHED, PROJECT_ID_REQUIRED, PROJECT_NOT_FOUND, PROJECTS_FETCHED, USER_CREATED } from "../constants/app-messages";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "../constants/http-status-codes";
import db from "../database/db";
import { NewProject, Project, projects } from "../database/schemas/projects";
import NotFoundException from "../exceptions/not-found-exception";
import factory from "../factory";
import { getAllProjects, getProjectById, isProjectExist } from "../service/project-services";
import { sendResponse } from "../utils/send-response";
import { vCreateProject } from "../validations/project-validations";
import { createRecord } from "../service/base-db-services";
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
//createproject

export const createProjectHandlers = factory.createHandlers(async (c) => {
  try {
    const reqBody = await c.req.json();  
    const validProjectReq = vCreateProject.parse(reqBody);
    const projectData: NewProject = {
      ...validProjectReq 
    }  
    const existingUser=await isProjectExist(validProjectReq.title);

   if(!existingUser){
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