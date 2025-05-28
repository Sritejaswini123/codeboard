import { z, ZodError } from "zod";

import type { NewProject, Project } from "../database/schemas/projects";

import { PROJECT_CREATED, PROJECT_EXIST, PROJECT_NOT_FOUND, PROJECTS_FETCHED, USER_FETCHED, VALIDATION_ERRORS } from "../constants/appMessages";
import { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
import { projects } from "../database/schemas/projects";
import NotFoundException from "../exceptions/notFoundException";
import factory from "../factory";
import { createRecord } from "../service/baseDbServices";
import { createProject, getAllProjects, getUserProjects, isProjectExist } from "../service/projectServices";
import { sendResponse } from "../utils/sendResponse";
import { vCreateProject } from "../validations/projectValidations";
import ConflictException from "../exceptions/conflictException";

// createproject
export const createProjectHandlers = factory.createHandlers(async (c) => {
  try {
    const reqBody = await c.req.json();
    const validProjectReq = vCreateProject.parse(reqBody);
    const projectData: NewProject = {
      ...validProjectReq,
    };
    const existingProject = await isProjectExist(validProjectReq.title);

    if (existingProject) {
      throw new ConflictException(PROJECT_EXIST);
    }

    const Projcet = await createRecord<Project>(projects, projectData);

    return sendResponse(c, CREATED, PROJECT_CREATED, Projcet);
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


// get all projects handler
export const getAllProjectsHandlers = factory.createHandlers(async (c) => {
  try {
    const page = Number(c.req.query("page"));
    const page_size = Number(c.req.query("page_size"));
    const user_id = Number(c.req.query("user_id"));
    const project_id = Number(c.req.query("project_id"));
    const projectData = await getAllProjects(page, page_size, user_id, project_id);
    return sendResponse(c, OK, PROJECTS_FETCHED, projectData);
  }
  catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, PROJECT_NOT_FOUND);
  }
});

//retrive user Projects data 
export const userProjectsHandler = factory.createHandlers(async (c) => {
  try {
    const userId = Number(c.req.param("id"));

    // if (!userId || isNaN(userId)) return c.json({message:USER_ID_REQUIRED})

    // const isUserExist = await getRecordById(users, userId);

    // if (!isUserExist) return c.json({status: NOT_FOUND,success: false,message:`${USER_NOT_FOUND} with id ${userId}`})
     
    const includeProjects = c.req.query("projects") === "true";

    const result = await getUserProjects(userId, includeProjects);

    return sendResponse(c, OK, USER_FETCHED, result);
  } catch (error) {
    console.log(error);
    throw error;
  }
});



