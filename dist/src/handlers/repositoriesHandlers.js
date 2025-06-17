import { z } from "zod";
import { REPOSITORY_CREATED, REPOSITORY_EXIST, VALIDATION_ERRORS } from "../constants/appMessages";
import { CREATED, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
import { repositories } from "../database/schemas/repositories";
import NotFoundException from "../exceptions/notFoundException";
import factory from "../factory";
import { createRecord } from "../service/baseDbServices";
import { checkRepoExist } from "../service/repositoryService";
import { sendResponse } from "../utils/sendResponse";
// import { vCreateRepositories } from "../validations/repositoriesValidations";
import { vCreateRepository } from "../validations/repositoryValidations";
export const createRepositoriesHandlers = factory.createHandlers(async (c) => {
    try {
        const reqBody = await c.req.json();
        const validateRepo = vCreateRepository.parse(reqBody);
        const repoData = {
            ...validateRepo,
        };
        const id = Number(repoData.id);
        const isRepositoryExist = await checkRepoExist(id);
        if (!isRepositoryExist)
            throw new NotFoundException(REPOSITORY_EXIST);
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
