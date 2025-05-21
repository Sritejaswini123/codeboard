import { ZodError } from "zod";
import { PROJECT_CREATED, PROJECT_EXIST, PROJECT_NOT_FOUND, PROJECTS_FETCHED } from "../constants/appMessages";
import { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
import { projects } from "../database/schemas/projects";
import NotFoundException from "../exceptions/notFoundException";
import factory from "../factory";
import { createRecord } from "../service/baseDbServices";
import { getAllProjects, isProjectExist } from "../service/projectServices";
import { sendResponse } from "../utils/sendResponse";
import { vCreateProject } from "../validations/projectValidations";
// createproject
export const createProjectHandlers = factory.createHandlers(async (c) => {
    try {
        const reqBody = await c.req.json();
        const validProjectReq = vCreateProject.parse(reqBody);
        const projectData = {
            ...validProjectReq,
        };
        const existingProject = await isProjectExist(validProjectReq.title);
        if (!existingProject) {
            throw new NotFoundException(PROJECT_EXIST);
        }
        const Projcet = await createRecord(projects, projectData);
        return sendResponse(c, CREATED, PROJECT_CREATED, Projcet);
    }
    catch (error) {
        if (error instanceof ZodError) {
            const errorMessage = error.errors?.[0]?.message || "Validation error";
            return c.json({ message: errorMessage }, NOT_FOUND);
        }
        return c.json({ error }, UNPROCESSABLE_ENTITY);
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
