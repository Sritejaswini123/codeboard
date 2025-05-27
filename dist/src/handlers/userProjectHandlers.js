import { USER_FETCHED, USER_ID_REQUIRED, USER_NOT_FOUND } from "../constants/appMessages";
import { BAD_REQUEST, OK } from "../constants/httpStatusCodes";
import { users } from "../database/schemas/users";
import factory from "../factory";
import { getRecordById } from "../service/baseDbServices";
import { getUserProfile } from "../service/userProjectServices";
import { sendResponse } from "../utils/sendResponse";
export const userProfileHandler = factory.createHandlers(async (c) => {
    try {
        const userId = Number(c.req.param('id'));
        if (!userId || isNaN(userId))
            return c.json(USER_ID_REQUIRED, BAD_REQUEST);
        const isUserExist = await getRecordById(users, userId);
        if (!isUserExist)
            throw new Error(`${USER_NOT_FOUND} with id ${userId}`);
        const userProject = await getUserProfile(userId);
        return sendResponse(c, OK, USER_FETCHED, userProject);
    }
    catch (error) {
        console.log(error);
        throw (error);
    }
});
