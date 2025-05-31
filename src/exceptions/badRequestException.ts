import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/httpStatusCodes.js";
import { BAD_REQUEST_MESSAGE, INTERNAL_SERVER_ERROR as INTERNAL_SERVER_ERROR_MESSAGE } from "../constants/httpStatusPhrases.js";
import BaseException from "./baseException.js";

export default class BadRequestException extends BaseException {
  constructor(message?: string, errData?: any) {
    super(BAD_REQUEST, message || BAD_REQUEST_MESSAGE, BAD_REQUEST_MESSAGE, true, errData);
  }
}
