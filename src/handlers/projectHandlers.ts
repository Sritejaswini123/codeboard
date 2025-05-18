import { ZodError } from "zod";
import { PROJECT_CREATED, PROJECT_EXIST, PROJECT_FETCHED, PROJECT_ID_REQUIRED, PROJECT_NOT_FOUND } from "../constants/appMessages";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
import { NewProject, Project, projects } from "../database/schemas/projects";
import NotFoundException from "../exceptions/notFoundException";
import factory from "../factory";
import { createRecord, getRecordById } from "../service/baseDbServices";
import { getAllProjects, isProjectExist } from "../service/projectService";
import { sendResponse } from "../utils/send-response";
import { vCreateProject } from "../validations/projectValidations";

export const createProjectHandlers = factory.createHandlers(async (c) => {
  try {
    const reqBody = await c.req.json();  
    const validProjectReq = vCreateProject.parse(reqBody);
    console.log("---->",validProjectReq);
    
    const projectData: NewProject = {
      ...validProjectReq 
    }  

    const existingProject=await isProjectExist(validProjectReq.title);

   if(!existingProject){
    throw new NotFoundException(PROJECT_EXIST)
    }

    const project = await createRecord<Project>(projects, projectData);

    return sendResponse(c, CREATED, PROJECT_CREATED,project);
  } catch (error) {

    if (error instanceof ZodError) {
      const errorMessage = error.errors?.[0]?.message || 'Validation error';
      return c.json({ message: errorMessage }, NOT_FOUND);
    }
    
    console.log("hello--->",error);
    
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

      if (!user) {
        throw new NotFoundException(PROJECT_NOT_FOUND);
      }
    return sendResponse(c, OK, PROJECT_FETCHED, user);
  } catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, PROJECT_NOT_FOUND);
  }
});


// //get all projects
// export const getAllProjectsHandlers = factory.createHandlers(async (c) => {
//   try {
//     const page=Number(c.req.query('page'));
//     const page_size=Number(c.req.query('page_size'));
   

//     const users = await getAllProjects(page, page_size);

  
//     return sendResponse(c, OK, PROJECT_FETCHED, users);
//   } catch (error) {
//     return sendResponse(c, INTERNAL_SERVER_ERROR, PROJECT_NOT_FOUND);
//   }
// });   