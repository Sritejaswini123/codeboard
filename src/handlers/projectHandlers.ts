import z, { ZodError } from "zod";
import { PROJECT_CREATED, PROJECT_DELETEED, PROJECT_ID_REQUIRED, PROJECT_NOT_FOUND, PROJECTS_FETCHED, USER_FETCHED, USER_ID_REQUIRED, USER_NOT_FOUND } from "../constants/appMessages";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
import { eq } from "drizzle-orm";
import { NewProject, Project, projects } from "../database/schemas/projects";
import factory from "../factory";
import { assignUsersToProject, getAllProjects, getProjectById, getUserWithProjects } from "../service/projectServices";
import { sendResponse } from "../utils/sendResponse";
import { vCreateProject, vUpdateProject } from "../validations/projectValidations";
import { createRecord, updateRecordById } from "../service/baseDbServices";
import { vCreateUserProject } from "../validations/userProjectValidations";
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
    const page = Number(c.req.query("page"))||1;
    const page_size = Number(c.req.query("page_size"))||5;
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
    const projectData: NewProject = {
      ...validProjectReq
    };

    const project = await createRecord<Project>(projects, projectData);
    return sendResponse(c, CREATED, PROJECT_CREATED, project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = Object.fromEntries(
        error.errors.map(({ path, message }) => [path[0], message])
      );
      return sendResponse(c, UNPROCESSABLE_ENTITY, "validation errors", formattedErrors)

    }
    return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
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
//get user by ID with projects
export const getUserByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const userIdParam = c.req.param("user_id");

    if (!userIdParam) {
      return sendResponse(c, BAD_REQUEST, USER_ID_REQUIRED);
    }

    const userId = parseInt(userIdParam);

    if (isNaN(userId)) {
      return sendResponse(c, BAD_REQUEST, "Invalid user ID");
    }

    //const page = Number(c.req.query("page"));
    //const page_size = Number(c.req.query("page_size"));
    const includeProjects = c.req.query("projects") === "true";

    const user = await getUserWithProjects(userId, includeProjects);

    if (!user) {
      return sendResponse(c, NOT_FOUND, `${USER_NOT_FOUND} with user_id ${userId}`);
    }

    return sendResponse(c, OK, USER_FETCHED, user);
  } catch (error) {
    console.error("Error in getUserByIdHandlers:", error);
    return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
  }
});
//assign users to projects


export const assignUsersHandler = factory.createHandlers(async (c) => {
  try {
    const reqBody = await c.req.json();
    const validData = vCreateUserProject.parse(reqBody);

    const { user_id, project_id } = validData;

    const result = await assignUsersToProject(user_id, project_id);

    return sendResponse(c, CREATED, "Users processed", result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = Object.fromEntries(
        error.errors.map(({ path, message }) => [path[0], message])
      );
      return sendResponse(c, UNPROCESSABLE_ENTITY, "validation errors", formattedErrors)

    }
    return sendResponse(c, INTERNAL_SERVER_ERROR, PROJECT_NOT_FOUND);
  }
});