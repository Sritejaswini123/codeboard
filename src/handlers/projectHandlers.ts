import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import type { NewProject, Project } from "../database/schemas/projects";

import { PROJECT_CREATED, PROJECT_EXIST, PROJECT_ID_REQUIRED, PROJECT_NOT_FOUND, PROJECTS_FETCHED, USER_FETCHED, USER_ID_REQUIRED, USER_NOT_FOUND, USERS_PROJECT_DELETED, VALIDATION_ERRORS } from "../constants/appMessages";
import { CREATED, INTERNAL_SERVER_ERROR, OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
import { projects } from "../database/schemas/projects";
import ConflictException from "../exceptions/conflictException";
import factory from "../factory";
import { createRecord } from "../service/baseDbServices";
import { assignUsersToProject, getAllProjects, getUserProjects, isProjectExist } from "../service/projectServices";
import { sendResponse } from "../utils/sendResponse";
import { vCreateProject } from "../validations/projectValidations";
import { vCreateUserProject } from "../validations/userProjectValidatons";
import db from "../database/db";
import { user_projects } from "../database/schemas/userProjects";
import NotFoundException from "../exceptions/notFoundException";
import BadRequestException from "../exceptions/badRequestException";

// AddProject
export const createProjectHandlers = factory.createHandlers(async (c) => {
  try {
    const reqBody = await c.req.json();
    const validProjectReq = vCreateProject.parse(reqBody);
    // if(!validProjectReq){
    //   throw new UnprocessableEntityException(VALIDATION_ERRORS)
    // }
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
    const project_id = c.req.query("project_id");
    const filter = project_id ? eq(projects.id, Number.parseInt(project_id)) : undefined;
    console.log("filters fetched: ", filter);
    // const user_id = Number(c.req.query("user_id"));

    const projectData = await getAllProjects(page, page_size,projects,filter);
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


// add users in project
export const assignUsersHandler = factory.createHandlers(async (c) => {
  try {
    const reqBody = await c.req.json();
    const validData = vCreateUserProject.parse(reqBody);
    const { userIds, project_id } = validData;

    const result = await assignUsersToProject(userIds, project_id);
    console.log("assigned users",result);
    return sendResponse(c, CREATED, "Users processed", result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = Object.fromEntries(
        error.errors.map(({ path, message }) => [path[0], message])
      );
      return sendResponse(c, UNPROCESSABLE_ENTITY, "validation errors", formattedErrors)
    }
     throw error;
  }
});

//delete users in project
 export const deleteAssignUsersHandler = factory.createHandlers(
  async (c) => {
    const { projectId, userIds }: { projectId: number; userIds: number[] } = await c.req.json();

    if (userIds.length === 0) {
      throw new BadRequestException(USER_ID_REQUIRED);
      // return c.json({ message: 'No user IDs provided' }, 400);
    }
    if (!projectId){
      throw new BadRequestException(PROJECT_ID_REQUIRED)
    }

    try {
      // Delete users from the specified project
      const result = await db
        .delete(user_projects)
        .where(
          and(
            eq(user_projects.project_id, projectId),
            inArray(user_projects.user_id, userIds)
          )
        )
        .returning();
          return sendResponse(c, OK, USERS_PROJECT_DELETED, result);
    } catch (error) {
     throw error;
    }
  });


// //delete user project
// export const deleteUsersInProject =factory.createHandlers(async(c)=>{
//   try{
//   const userProjectsId = Number(c.req.param("userProjects.id"));
//   if(!userProjectsId){
//     return sendResponse (c, BAD_REQUEST, USER_PROJECTS_ID_REQUIRED)
//   }
//  const deletedUserProjects = await deleteRecordById(user_projects,userProjectsId);
//     if (!deletedUserProjects) {
//       throw new NotFoundException(USER_PROJECTS_NOT_FOUND);
//     }
//     return sendResponse(c, OK, USER_PROJECTS_DELETED, deletedUserProjects);
//   }
//   catch (error) {
//    throw error;
//   }
// })