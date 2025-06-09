import { BAD_REQUEST } from "../constants/httpStatusCodes.js";
import { BAD_REQUEST as BAD_REQUEST_MESSAGE } from "../constants/httpStatusPhrases.js";
import BaseException from "./baseException.js";
export default class BadRequestException extends BaseException {
    constructor(message, errData) {
        super(BAD_REQUEST, message || BAD_REQUEST_MESSAGE, BAD_REQUEST_MESSAGE, true, errData);
    }
}
