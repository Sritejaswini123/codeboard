import { CONFLICT } from "../constants/httpStatusCodes.js";
import { CONFLICT as CONFLICT_MESSAGE } from "../constants/httpStatusPhrases.js";
import BaseException from "./baseException.js";
export default class ConflictException extends BaseException {
    constructor(message, errData) {
        super(CONFLICT, message || CONFLICT_MESSAGE, CONFLICT_MESSAGE, true, errData);
    }
}
