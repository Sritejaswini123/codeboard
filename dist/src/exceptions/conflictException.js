import { USER_EXIST } from "../constants/appMessages.js";
import { CONFLICT } from "../constants/httpStatusCodes.js";
import BaseException from "./baseException.js";
export default class conflictException extends BaseException {
    constructor(message, errData) {
        super(CONFLICT, message || USER_EXIST, USER_EXIST, true, errData);
    }
}
