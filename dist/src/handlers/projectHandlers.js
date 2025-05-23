"use strict";
// import { eq } from "drizzle-orm";
// import { ZodError } from "zod";
// import type { NewProject, Project } from "../database/schemas/projects";
// import { PROJECT_CREATED, PROJECT_EXIST, PROJECT_ID_REQUIRED, PROJECT_NOT_FOUND, PROJECTS_FETCHED } from "../constants/appMessages";
// import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
// import { projects } from "../database/schemas/projects";
// import NotFoundException from "../exceptions/notFoundException";
// import factory from "../factory";
// import { createRecord } from "../service/baseDbServices";
// import { getAllProjects, getProjectById, isProjectExist } from "../service/projectServices";
// import { sendResponse } from "../utils/sendResponse";
// import { vCreateProject } from "../validations/projectValidations";
// // get by id
// export const getProjectByIdHandlers = factory.createHandlers(async (c) => {
//   try {
//     const projectId = Number(c.req.param("project_id"));
//     if (!projectId) {
//       return sendResponse(c, BAD_REQUEST, PROJECT_ID_REQUIRED);
//     }
//     const project = await getProjectById(projectId);
//     if (!project) {
//       return sendResponse(c, NOT_FOUND, `${PROJECT_NOT_FOUND}with project_id ${projectId}`);
//     }
//     return sendResponse(c, OK, PROJECTS_FETCHED, project);
//   }
//   catch (error) {
//     return sendResponse(c, INTERNAL_SERVER_ERROR, PROJECT_NOT_FOUND);
//   }
// });
// // get all projects handler
// export const getAllProjectsHandlers = factory.createHandlers(async (c) => {
//   try {
//     const page = Number(c.req.query("page"));
//     const page_size = Number(c.req.query("page_size"));
//     const projectId = c.req.query("project_id");
//     const filter = projectId ? eq(projects.id, Number.parseInt(projectId)) : undefined;
//     const projectData = await getAllProjects(page, page_size, projects, filter);
//     console.log("Projects fetched: ", projectData);
//     return sendResponse(c, OK, PROJECTS_FETCHED, projectData);
//   }
//   catch (error) {
//     return sendResponse(c, INTERNAL_SERVER_ERROR, PROJECT_NOT_FOUND);
//   }
// });
// // createproject
// export const createProjectHandlers = factory.createHandlers(async (c) => {
//   try {
//     const reqBody = await c.req.json();
//     const validProjectReq = vCreateProject.parse(reqBody);
//     const projectData: NewProject = {
//       ...validProjectReq,
//     };
//     const existingProject = await isProjectExist(validProjectReq.title);
//     if (!existingProject) {
//       throw new NotFoundException(PROJECT_EXIST);
//     }
//     const Projcet = await createRecord<Project>(projects, projectData);
//     return sendResponse(c, CREATED, PROJECT_CREATED, Projcet);
//   }
//   catch (error) {
//     if (error instanceof ZodError) {
//       const errorMessage = error.errors?.[0]?.message || "Validation error";
//       return c.json({ message: errorMessage }, NOT_FOUND);
//     }
//     return c.json({ error }, UNPROCESSABLE_ENTITY);
//   }
// },
// );
