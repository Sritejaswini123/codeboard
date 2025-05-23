import { NOT_FOUND } from "../constants/httpStatusCodes.js";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "../constants/httpStatusPhrases.js";
import BaseException from "./baseException.js";
export default class NotFoundException extends BaseException {
    constructor(message, errData) {
        super(NOT_FOUND, message || NOT_FOUND_MESSAGE, NOT_FOUND_MESSAGE, true, errData);
    }
}
