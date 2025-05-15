import { ZodError } from "zod";
import { PROJECT_EXIST, USER_CREATED } from "../constants/app-messages";
import { CREATED, NOT_FOUND, UNPROCESSABLE_ENTITY } from "../constants/http-status-codes";
import { projects } from "../database/schemas/projects";
import NotFoundException from "../exceptions/not-found-exception";
import factory from "../factory";
import { createRecord } from "../service/base-db-services";
import { isProjectExist } from "../service/project-service";
import { sendResponse } from "../utils/send-response";
import { vCreateProject } from "../validations/project-validations";
export const createProjectHandlers = factory.createHandlers(async (c) => {
    try {
        const reqBody = await c.req.json();
        const validProjectReq = vCreateProject.parse(reqBody);
        const projectData = {
            ...validProjectReq
        };
        const existingUser = await isProjectExist(validProjectReq.title);
        if (!existingUser) {
            throw new NotFoundException(PROJECT_EXIST);
        }
        const Projcet = await createRecord(projects, projectData);
        return sendResponse(c, CREATED, USER_CREATED, Projcet);
    }
    catch (error) {
        if (error instanceof ZodError) {
            const errorMessage = error.errors?.[0]?.message || 'Validation error';
            return c.json({ message: errorMessage }, NOT_FOUND);
        }
        return c.json({ error: error }, UNPROCESSABLE_ENTITY);
    }
});
