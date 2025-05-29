import { eq } from "drizzle-orm";
import { z } from "zod";
import { PROJECT_NOT_FOUND, REPO_NOT_FOUND, REPOSITORY_CREATED, REPOSITORY_EXIST, REPOSITORY_UPDATED, VALIDATION_ERRORS } from "../constants/appMessages";
import { CREATED, OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
import db from "../database/db";
import { projects } from "../database/schemas/projects";
import { NewRepositories, repositories, Repositories } from "../database/schemas/repo";
import NotFoundException from "../exceptions/notFoundException";
import factory from "../factory";
import { createRecord, updateRecordById } from "../service/baseDbServices";
import { sendResponse } from "../utils/sendResponse";
import { checkRepoExist } from "../service/repoService";
import { vCreateRepositories } from "../validations/repositoriesValidations";
import { PgTableWithColumns, PgColumn } from "drizzle-orm/pg-core";

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


export const updateRepoByIdHandlers=factory.createHandlers(async(c)=>{
  try {
    const repoId=c.req.param('id');
    if(!repoId) throw new NotFoundException();
    const reqBody=await c.req.json();
    const validateRepo=vCreateRepositories.parse(reqBody);
    const isRepositoryExist=await checkRepoExist(+repoId);
    if(!isRepositoryExist)throw new NotFoundException(REPO_NOT_FOUND);
    const repoData:NewRepositories={
      ...validateRepo,
    }
    const updatedRepo=updateRecordById(repositories,repoData,+repoId);
    return sendResponse(c, OK, REPOSITORY_UPDATED,updatedRepo);
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





