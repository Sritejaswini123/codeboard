import { z } from "zod";
import {  PROJECT_NOT_FOUND, REPOSITORY_CREATED, REPOSITORY_EXIST, VALIDATION_ERRORS } from "../constants/appMessages";
import { CREATED, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
import NotFoundException from "../exceptions/notFoundException";
import factory from "../factory";
import { createRecord } from "../service/baseDbServices";

import { sendResponse } from "../utils/sendResponse";
import { vCreateRepositories } from "../validations/repoValidations";
import { checkRepoExist } from "../service/repoServices";
import { NewRepositories, repositories, Repositories } from "../database/schemas/repo";
import { projects } from "../database/schemas/projects";
import { eq } from "drizzle-orm";
import db from "../database/db";

export const createRepositoriesHandlers=factory.createHandlers(async(c)=>{
    try {
        const reqBody=await c.req.json();

        const validateRepo=vCreateRepositories.parse(reqBody);
        
        const repoData:NewRepositories={
          ...validateRepo
        }
      const id=Number(repoData.id);
      const isRepositoryExist=await checkRepoExist(id);
      if(!isRepositoryExist)throw new NotFoundException(REPOSITORY_EXIST);
      
    // Check if the provided project_id exists
    const projectExists = await db
      .select()
      .from(projects)
      .where(eq(projects.id, validateRepo.project_id))


    if (!projectExists) {
      throw new NotFoundException(PROJECT_NOT_FOUND);
    }

      const createdRepo=await createRecord<Repositories>(repositories,repoData)
      return sendResponse(c, CREATED, REPOSITORY_CREATED, createdRepo);

    } catch (error) {
         if (error instanceof z.ZodError) {
              const formattedErrors = Object.fromEntries(
                error.errors.map(({ path, message }) => [path[0], message]),
              );
              return sendResponse(
                c, UNPROCESSABLE_ENTITY,VALIDATION_ERRORS,formattedErrors,
              );
            }
      throw error;
    }
});








