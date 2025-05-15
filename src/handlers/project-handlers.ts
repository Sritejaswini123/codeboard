
import { PROJECT_CREATED, PROJECT_EXIST, PROJECT_FETCHED, PROJECT_ID_REQUIRED, PROJECT_NOT_FOUND, USER_CREATED, USER_FETCHED, USER_ID_REQUIRED, USER_NOT_FOUND } from "../constants/app-messages";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "../constants/http-status-codes";
import { NewProject, Project, projects } from "../database/schemas/projects";
import NotFoundException from "../exceptions/not-found-exception";
import factory from "../factory";
import { createRecord, getRecordById } from "../service/base-db-services";
import { createProject, isProjectExist } from "../service/project-service";
import { sendResponse } from "../utils/send-response";
import { vCreateProject } from "../validations/project-validations";
import { ZodError } from "zod";

export const createProjectHandlers = factory.createHandlers(async (c) => {
  try {
    const reqBody = await c.req.json();  
    const validProjectReq = vCreateProject.parse(reqBody);
    const projectData: NewProject = {
      ...validProjectReq 
    }  
    const existingProject=await isProjectExist(validProjectReq.title);

   if(!existingProject){
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
});

export const getProjectByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const projectId = Number(c.req.param('project_id'));

    if (!projectId) {
      return sendResponse(c, BAD_REQUEST, PROJECT_ID_REQUIRED);
    }
    const user= await getRecordById(projects,projectId);
    
     //if user exist 
    // if (!user) {
    //   return sendResponse(c, NOT_FOUND,USER_NOT_FOUND+`with user_id ${userId}`);
    // }
      if (!user) {
        throw new NotFoundException(PROJECT_NOT_FOUND);
      }
    return sendResponse(c, OK, PROJECT_FETCHED, user);
  } catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, PROJECT_NOT_FOUND);
  }
});