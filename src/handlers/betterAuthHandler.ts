import { Context } from "hono";
import factory from "../factory";
import { auth } from "../libs/auth";
import { sendResponse } from "../utils/sendResponse";
import { CREATED, OK } from "../constants/httpStatusCodes";
import { EMAIL_PASSWORD, USER_CREATED, USER_NOT_FOUND } from "../constants/appMessages";
import conflictException from "../exceptions/conflictException";
import { NOT_FOUND } from "../constants/httpStatusPhrases";

//register the user with email and password
export const signUpHandler = factory.createHandlers(async (c: Context) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      throw new conflictException(EMAIL_PASSWORD);
    }
    const response = await auth.api.signUpEmail({
      body: { email, password, name },
      asResponse: true,
    });
    return sendResponse(c, CREATED, USER_CREATED, { email, name });
  } catch (error) {
    throw error;
  }
});
//login the user with email and password
export const signInHandler = factory.createHandlers(async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      throw new conflictException(EMAIL_PASSWORD);
    }
    const response = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true,
    });
    return sendResponse(c, OK, "User signed in successfully", {
    });
  } catch (error) {
    throw error;
  }
});