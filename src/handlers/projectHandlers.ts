import { ZodError } from "zod";
import { PROJECT_CREATED, PROJECT_EXIST } from "../constants/app-messages";
import { CREATED, NOT_FOUND, UNPROCESSABLE_ENTITY } from "../constants/http-status-codes";
import { NewProject, Project } from "../database/schemas/projects";
import NotFoundException from "../exceptions/not-found-exception";
import factory from "../factory";
import { createRecord } from "../service/baseDbServices";
// import { isProjectExist } from "../service/projectServices";
import { sendResponse } from "../utils/send-response";
import { vCreateProject } from "../validations/projectValidations";

// export const createProjectHandlers = factory.createHandlers(async (c) => {
//   try {
//       const reqBody = await c.req.json();  
//       const validProjectReq = vCreateProject.parse(reqBody);
//       console.log("---->",validProjectReq);
//       const projectData: NewProject = {
//         ...validProjectReq 
//       }  
//     const existingProject=await isProjectExist(validProjectReq.title);
//    if(!existingProject){
//     throw new NotFoundException(PROJECT_EXIST)
//     }
//     const project = await createRecord<Project>(project, projectData);
//     return sendResponse(c, CREATED, PROJECT_CREATED,project);
//   } catch (error) {
//     if (error instanceof ZodError) {
//       const errorMessage = error.errors?.[0]?.message || 'Validation error';
//       return c.json({ message: errorMessage }, NOT_FOUND);
//     }
//     return c.json({ error: error }, UNPROCESSABLE_ENTITY);

//   }
// }
// );





