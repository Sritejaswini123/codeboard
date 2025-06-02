import { z } from "zod";
import { INVALID_ID, INVALID_PROJECT_ID, PROJECT_CREATED, PROJECT_FETCHED, PROJECT_ID_REQUIRED, PROJECT_NOT_FOUND, PROJECT_UPDATED, PROJECTS_FETCHED, USER_FETCHED, USER_ID_REQUIRED, USER_NOT_FOUND, USERS_FETCHED, USERS_PROJECTS_FETCHED, VALIDATION_ERRORS } from "../constants/appMessages";
import { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
import type { NewProject, Project } from "../database/schemas/projects";
import { projects } from "../database/schemas/projects";
import { users } from "../database/schemas/users";
import NotFoundException from "../exceptions/notFoundException";
import factory from "../factory";
import { createRecord, getRecordById, updateRecordById } from "../service/baseDbServices";
import { getAllProjects, getProjectWithUsers, getUserProjects, isProjectExist, projectExist } from "../service/projectServices";
import { sendResponse } from "../utils/sendResponse";
import { vCreateProject } from "../validations/projectValidations";
import BadRequestException from "../exceptions/badRequestException";
import { Context } from "hono";
import conflictException from "../exceptions/conflictException";

// create new project
export const createProjectHandlers = factory.createHandlers(async (c:Context) => {
  try {
    const reqBody = await c.req.json();

    const validatedProject = vCreateProject.parse(reqBody);

    const projectData: NewProject = {
      ...validatedProject,
    };

    const projectTitle = projectData.title;

    const checkProjectTitleExist = await projectExist(projectTitle);

    if (checkProjectTitleExist){
      throw new conflictException(PROJECT_NOT_FOUND);
    }

    const project = await createRecord<Project>(projects, projectData);

    return sendResponse(c, CREATED, PROJECT_CREATED, project);
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = Object
        .fromEntries(
          error.errors.map(({ path, message }) => [path[0], message]),
        );
      return sendResponse(c, UNPROCESSABLE_ENTITY, VALIDATION_ERRORS, formattedErrors);
    }
    throw error;
  }
});

// get all projects handler
export const getAllProjectsHandlers = factory.createHandlers(async (c:Context) => {
  try {
    const page = Number(c.req.query("page")) || 1;

    const page_size = Number(c.req.query("page_size")) ;

    const user_id = Number(c.req.query("user_id"));

    const project_id = Number(c.req.query("project_id"));

    const projectData = await getAllProjects(page, page_size, user_id, project_id);

    return sendResponse(c, OK, PROJECTS_FETCHED, projectData);
  }
  catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, PROJECT_NOT_FOUND);
  }
});

// user+Profile
export const userProjectsProfileHandler = factory.createHandlers(async (c:Context) => {
  try {
    const userId = Number(c.req.param("id"));

    if (!userId){
      throw new BadRequestException(INVALID_ID);
    }
     
    const isUserExist = await getRecordById<Project>(users, userId);

    if (!isUserExist){
      throw new NotFoundException(`${USER_NOT_FOUND} with id ${userId}`);
    }

    const includeProjects = c.req.query("projects") === "true";

    const result = await getUserProjects(userId, includeProjects);

    return sendResponse(c, OK, USER_FETCHED, result);
  }
  catch (error) {
    console.log(error);

    throw error;
  }
});

//update
export const updateproject = factory.createHandlers(async (c:Context) => {
  try {
    const projectId = Number(c.req.param("id"));

    if (!projectId){
      throw new BadRequestException(INVALID_ID)
    }

    const reqBody = await c.req.json();

    const validateUpdatedProject = vCreateProject.parse(reqBody);

    const checkProjectExist = await isProjectExist(projectId);

    if (!checkProjectExist){
      throw new NotFoundException(`${PROJECT_NOT_FOUND} with id ${projectId}`);
    }
    const projectData: NewProject = {
      ...validateUpdatedProject,
    };
    const updateProject = await updateRecordById<Project>(projects, projectData, projectId);

    return sendResponse(c, OK, PROJECT_UPDATED, updateProject);
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = Object
        .fromEntries(
          error.errors.map(({ path, message }) => [path[0], message]),
        );
      return sendResponse(c, UNPROCESSABLE_ENTITY, VALIDATION_ERRORS, formattedErrors);
    }
    throw error;
  }
});

// get project by id
export const getProjectByIdHandler = factory.createHandlers(async (c:Context) => {
  try {
    const projectId = Number(c.req.param("id"));

    if (!projectId){
      throw new BadRequestException(INVALID_ID);
    }
    const checkProjectExist = await isProjectExist(projectId);

    if (!checkProjectExist){
      throw new NotFoundException(`${PROJECT_NOT_FOUND} with id ${projectId}`);
    }
    const result = await getRecordById<Project>(projects, projectId);
    return sendResponse(c, OK, PROJECT_FETCHED, result);
  }
  catch (error) {
    
    throw error;
  }
});



//get all users based on users
export const getAllUsersByProjectId=factory.createHandlers(async(c:Context)=>{
  try {
    const projectId=Number(c.req.query('id'));

    if(!projectId){
      throw new BadRequestException(INVALID_ID);
    }
    const checkProjectExist=await isProjectExist(projectId);

    if(!checkProjectExist){
      throw new NotFoundException(`${PROJECT_NOT_FOUND} with id ${projectId}`);
    }
    const result = await getProjectWithUsers(projectId);

    return sendResponse(c, OK, USERS_PROJECTS_FETCHED, result);
  } catch (error) {
    
    throw error;
  }
})

//TODO:write api for deleting for projects

