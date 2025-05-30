import { z } from "zod";
import { REPOSITORY_ADDED, VALIDATION_ERRORS } from "../constants/appMessages";
import { CREATED, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
import { NewRepository, Repository, repositories } from "../database/schemas/repositories";
import factory from "../factory";
import { createRecord } from "../service/baseDbServices";
import { sendResponse } from "../utils/sendResponse";
import { vAddRepository } from "../validations/repositoryValidations";
import UnprocessableEntityException from "../exceptions/unprocessableEntityException";
import db from "../database/db";
import { projects } from "../database/schemas/projects";

//Add Repositories 
export const addRepositoryHandlers = factory.createHandlers(async (c) => {
    try {
      const reqBody = await c.req.json();
      const validatedRepository = vAddRepository.parse(reqBody) ;
      
      const repositoryData: NewRepository = {
          ...validatedRepository  
      };

      const repository = await createRecord<Repository>(repositories, repositoryData);
      return sendResponse(c, CREATED, REPOSITORY_ADDED, repository);
    }
    catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = Object.fromEntries(
          error.errors.map(({path,message})=>[path[0],message])
        );
        return sendResponse(c, UNPROCESSABLE_ENTITY,VALIDATION_ERRORS,formattedErrors);
      }
  
     throw error;
    }
  });

