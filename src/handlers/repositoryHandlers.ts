import { eq } from "drizzle-orm";
import { z } from "zod";
import { INVALID_ID, PROJECT_NOT_FOUND, REPOS_FETCHED, REPOS_NOT_FOUND, REPOSITORY_ADDED, REPOSITORY_UPDATED, VALIDATION_ERRORS } from "../constants/appMessages";
import { CREATED, INTERNAL_SERVER_ERROR, OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
import { NewRepository, repositories, Repository } from "../database/schemas/repositories";
import BadRequestException from "../exceptions/badRequestException";
import NotFoundException from "../exceptions/notFoundException";
import factory from "../factory";
import { createRecord, getAllRecords, updateRecordById } from "../service/baseDbServices";
import { checkRepoExist, getExistingRepositoryNames, isProjectIdExist } from "../service/repositoryServices";
import { sendResponse } from "../utils/sendResponse";
import { vCreateRepositories } from "../validations/repositoryValidations";

//add repo
export const createRepositoriesHandlers=factory.createHandlers(async(c)=>{
    try {
        const reqBody=await c.req.json();
        const validateRepo=vCreateRepositories.parse(reqBody);
        
      const repoData:NewRepository={
        ...validateRepo
      }
     const projectId= repoData.project_id;
    const checkProjectIdExist = await isProjectIdExist(projectId);
   
      if(!checkProjectIdExist){
        throw new NotFoundException(PROJECT_NOT_FOUND);
      }
    const repoTitle=validateRepo.title;
    const repoExist=getExistingRepositoryNames(repoTitle);

    if(!repoExist){
      throw new NotFoundException(REPOS_NOT_FOUND);
    }

    const createdRepo=await createRecord<Repository>(repositories,repoData)
    return sendResponse(c, CREATED, REPOSITORY_ADDED, createdRepo);

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

//retrive repos
export const getAllReposHandlers = factory.createHandlers(async (c) => {
  try {
    const page = Number(c.req.query("page"));
    const page_size = Number(c.req.query("page_size"));
    const repository_id = c.req.query("repository_id");
    const filter = repository_id ? eq(repositories.id, Number.parseInt(repository_id)) : undefined;
    const repoData = await getAllRecords(page, page_size, repositories, filter);
    return sendResponse(c, OK, REPOS_FETCHED, repoData);
  }
  catch (error) {
    // console.error("Error in getAllRepositoriesHandlers:", error);
    return sendResponse(c, INTERNAL_SERVER_ERROR, REPOS_NOT_FOUND);
  }
});

//update Repohandlers by Id
export const updateRepoByIdHandlers=factory.createHandlers(async(c)=>{
  try {
    const repoId=Number(c.req.param('id'));

    if(!repoId){
      throw new BadRequestException(INVALID_ID);
    }

    const reqBody = await c.req.json();
    const validateRepo = vCreateRepositories.parse(reqBody);

    const isRepositoryExist = await checkRepoExist(repoId);
    if(!isRepositoryExist){
      throw new NotFoundException(REPOS_NOT_FOUND);
    }
      const repoData:NewRepository = {
      ...validateRepo,
    }
    const updatedRepo = updateRecordById<Repository>(repositories,repoData,repoId);
    return sendResponse(c, OK, REPOSITORY_UPDATED, updatedRepo);
  } catch (error) {
       if (error instanceof z.ZodError) {
              const formattedErrors = Object.fromEntries(
                error.errors.map(({ path, message }) => [path[0], message]),
              );
              return sendResponse(c, UNPROCESSABLE_ENTITY,VALIDATION_ERRORS,formattedErrors);
            }
    throw error;
  }
});