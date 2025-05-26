import z, { ZodError } from "zod";
import { PROJECT_CREATED, PROJECT_DELETEED, PROJECT_ID_REQUIRED, PROJECT_NOT_FOUND, PROJECTS_FETCHED } from "../constants/appMessages";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
import { eq } from "drizzle-orm";
import { NewProject, projects } from "../database/schemas/projects";
import factory from "../factory";
import { createNewProject, deleteProjectById, getAllProjects, getProjectById } from "../service/projectServices";
import { sendResponse } from "../utils/sendResponse";
import { vCreateProject, vUpdateProject } from "../validations/projectValidations";
import { updateRecordById } from "../service/baseDbServices";
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
    return sendResponse(c, OK, PROJECTS_FETCHED, project);
  }
  catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, PROJECT_NOT_FOUND);
  }
});

// get all projects handler
export const getAllProjectsHandlers = factory.createHandlers(async (c) => {
  try {
    const page = Number(c.req.query("page"));
    const page_size = Number(c.req.query("page_size"));
    const projectId = c.req.query("project_id");
    const filter = projectId ? eq(projects.id, parseInt(projectId)) : undefined;
    const projectData = await getAllProjects(page, page_size, projects, filter);
    console.log("Projects fetched: ", projectData);
    return sendResponse(c, OK, PROJECTS_FETCHED, projectData);
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

    const project = await createNewProject( validProjectReq);
    return sendResponse(c, CREATED, PROJECT_CREATED, project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = Object.fromEntries(
        error.errors.map(({ path, message }) => [path[0], message])
      );
      return sendResponse(c, UNPROCESSABLE_ENTITY, "Validation errors", formattedErrors);
    }
    throw error;
  }
});

// Update project by ID handler
export const updateProjectByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const projectId = Number(c.req.param("project_id"));

    if (isNaN(projectId)) {
      return sendResponse(c, BAD_REQUEST, PROJECT_ID_REQUIRED);
    }

    const reqBody = await c.req.json();

    const validatedProjectData = vUpdateProject.parse(reqBody);

    const updatedProject = await updateRecordById(projects, validatedProjectData, projectId);

    if (!updatedProject) {
      return sendResponse(c, NOT_FOUND, `${PROJECT_NOT_FOUND} with project_id ${projectId}`);
    }

    return sendResponse(c, OK, PROJECTS_FETCHED, updatedProject);
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = Object.fromEntries(
        error.errors.map(({ path, message }) => [path[0], message])
      );
      return sendResponse(c, UNPROCESSABLE_ENTITY, "Validation errors", formattedErrors);
    }

   throw error
  }
});
// delete project by id
export const deleteProjectByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const projectId = Number(c.req.param("project_id"));

    if (isNaN(projectId)) {
      return sendResponse(c, BAD_REQUEST, PROJECT_ID_REQUIRED);
    }

    const deletedProject = await deleteProjectById(projectId);

    if (!deletedProject) {
      return sendResponse(c, NOT_FOUND, `${PROJECT_NOT_FOUND} with project_id ${projectId}`);
    }

    return sendResponse(c, OK, PROJECT_DELETEED, deletedProject);
  } catch (error) {
    console.error('Error deleting project:', error);
    return sendResponse(c, INTERNAL_SERVER_ERROR, 'An unexpected error occurred.');
  }
});
