import { eq } from "drizzle-orm";
import { z } from "zod";
import { INVALID_ID, PROJECT_NOT_FOUND, REPO_NOT_FOUND, REPOSITORY_CREATED, REPOSITORY_DELETED, REPOSITORY_FETCHED, REPOSITORY_NOT_EXIST, REPOSITORY_UPDATED, VALIDATION_ERRORS } from "../constants/appMessages";
import { CREATED, OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
import db from "../database/db";
import { projects } from "../database/schemas/projects";
import { repositories } from "../database/schemas/repo";
import BadRequestException from "../exceptions/badRequestException";
import NotFoundException from "../exceptions/notFoundException";
import factory from "../factory";
import { createRecord, deleteRecordById, getRecordById, updateRecordById } from "../service/baseDbServices";
import { isProjectExist } from "../service/projectServices";
import { checkProjectExistInRepo, checkRepoExist, getExistingRepositoryNames } from "../service/repoService";
import { sendResponse } from "../utils/sendResponse";
import { vCreateRepositories } from "../validations/repositoriesValidations";
export const createRepositoriesHandlers = factory.createHandlers(async (c) => {
    try {
        const reqBody = await c.req.json();
        const validateRepo = vCreateRepositories.parse(reqBody);
        const repoData = {
            ...validateRepo
        };
        const projectId = repoData.project_id;
        const checkProjectIdExist = await isProjectExist(projectId);
        if (!checkProjectIdExist) {
            throw new NotFoundException(PROJECT_NOT_FOUND);
        }
        // const isProjectIdExistInRepo=await checkProjectExistInRepo(validateRepo.project_id);
        // if(isProjectIdExistInRepo){
        //   throw new conflictException(REPOSITORY_EXIST);
        // }
        // Check if the provided project_id exists
        const projectExists = await db
            .select()
            .from(projects)
            .where(eq(projects.id, validateRepo.project_id));
        if (!projectExists) {
            throw new NotFoundException(PROJECT_NOT_FOUND);
        }
        const repoTitle = validateRepo.title;
        const repoExist = getExistingRepositoryNames(repoTitle);
        if (!repoExist) {
            throw new NotFoundException(REPO_NOT_FOUND);
        }
        const createdRepo = await createRecord(repositories, repoData);
        return sendResponse(c, CREATED, REPOSITORY_CREATED, createdRepo);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            const formattedErrors = Object.fromEntries(error.errors.map(({ path, message }) => [path[0], message]));
            return sendResponse(c, UNPROCESSABLE_ENTITY, VALIDATION_ERRORS, formattedErrors);
        }
        throw error;
    }
});
//update handlers by Id
export const updateRepoByIdHandlers = factory.createHandlers(async (c) => {
    try {
        const repoId = Number(c.req.param('id'));
        if (!repoId) {
            throw new BadRequestException(INVALID_ID);
        }
        const reqBody = await c.req.json();
        const validateRepo = vCreateRepositories.parse(reqBody);
        const isRepositoryExist = await checkRepoExist(repoId);
        if (!isRepositoryExist) {
            throw new NotFoundException(REPO_NOT_FOUND);
        }
        const repoData = {
            ...validateRepo,
        };
        const updatedRepo = updateRecordById(repositories, repoData, repoId);
        return sendResponse(c, OK, REPOSITORY_UPDATED, updatedRepo);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            const formattedErrors = Object.fromEntries(error.errors.map(({ path, message }) => [path[0], message]));
            return sendResponse(c, UNPROCESSABLE_ENTITY, VALIDATION_ERRORS, formattedErrors);
        }
        throw error;
    }
});
//get by id
export const getReopByIdHandler = factory.createHandlers(async (c) => {
    try {
        const repoId = +c.req.param('id');
        if (!repoId) {
            throw new BadRequestException(INVALID_ID);
        }
        const isRepoExist = await checkProjectExistInRepo(repoId);
        if (!isRepoExist) {
            throw new NotFoundException(REPOSITORY_NOT_EXIST);
        }
        const repoData = await getRecordById(repositories, repoId);
        return sendResponse(c, OK, REPOSITORY_FETCHED, repoData);
    }
    catch (error) {
        throw error;
    }
});
//TODO: WRITE  api for delete repo
export const deleteRepoByIdHandlers = factory.createHandlers(async (c) => {
    try {
        const repoId = +c.req.param('id');
        if (!repoId) {
            throw new BadRequestException(INVALID_ID);
        }
        const isRepoExist = await checkProjectExistInRepo(repoId);
        if (!isRepoExist) {
            throw new NotFoundException(REPOSITORY_NOT_EXIST);
        }
        const deletedRepo = await deleteRecordById(repositories, repoId);
        return sendResponse(c, OK, REPOSITORY_DELETED, deletedRepo);
    }
    catch (error) {
        throw error;
    }
});
