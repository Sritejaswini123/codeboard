import { USER_EXIST } from "../constants/appMessages.js";
import { BAD_REQUEST, CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND } from "../constants/httpStatusCodes.js";
import { BAD_REQUEST_MESSAGE, INTERNAL_SERVER_ERROR as INTERNAL_SERVER_ERROR_MESSAGE } from "../constants/httpStatusPhrases.js";
import BaseException from "./baseException.js";

export default class conflictException extends BaseException {
  constructor(message?: string, errData?: any) {
    super(CONFLICT, message || USER_EXIST, USER_EXIST, true, errData);
  }
}
