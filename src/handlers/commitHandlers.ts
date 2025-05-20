
import { ZodError } from "zod";
import { COMMIT_CREATED, COMMIT_EXIST } from "../constants/appMessages";
import { CREATED, NOT_FOUND, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
import { Commit, commits, NewCommit } from "../database/schemas/commits";
import NotFoundException from "../exceptions/notFoundException";
import factory from "../factory";
import { createRecord } from "../service/baseDbServices";
import { checkCommitExist } from "../service/commitService";
import { sendResponse } from "../utils/sendResponse";
import { vCreateCommit } from "../validations/commitValidations";



export const createCommitHandlers=factory.createHandlers(async(c)=>{
    try {
        const reqBody=await c.req.json();
        const validatedCommitData=vCreateCommit.parse(reqBody);
        const commitData:NewCommit={
            ...validatedCommitData
        }
        const commitExist=checkCommitExist(validatedCommitData.user_project_id);

        if(!commitExist){
            throw new NotFoundException(COMMIT_EXIST)
        }
        const commit=await createRecord<Commit>(commits,commitData)

        return sendResponse(c,CREATED,COMMIT_CREATED,commit)

    }catch (error) {
        if (error instanceof ZodError) {
              const errorMessage = error.errors?.[0]?.message || 'Validation error';
              return c.json({ message: errorMessage }, NOT_FOUND);
            }
        return c.json({ error: error }, UNPROCESSABLE_ENTITY);
        
    }
})