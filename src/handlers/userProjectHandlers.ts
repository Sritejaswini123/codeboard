import { ok } from "assert";
import { USER_FETCHED, USER_ID_REQUIRED, USER_NOT_FOUND, USERS_FETCHED } from "../constants/appMessages";
import { users } from "../database/schemas/users";
import factory from "../factory";
import { getRecordById } from "../service/baseDbServices";
import { getUserProfile } from "../service/userProjectServices";
import { sendResponse } from "../utils/sendResponse";
import { OK } from "../constants/httpStatusCodes";


export const userProfileHandler=factory.createHandlers(async(c)=>{
    try {
        const userId=Number(c.req.param('id'));

        if(!userId || isNaN(userId))throw new Error(USER_ID_REQUIRED);
        
        const isUserExist=await getRecordById(users,userId);

        if(!isUserExist)throw new Error(`${USER_NOT_FOUND} with id ${userId}`);
        
        const userProject=await getUserProfile(userId);

        return sendResponse(c,OK,USER_FETCHED,userProject)
        
    } catch (error) {
        console.log(error);
        throw(error);
    }
})