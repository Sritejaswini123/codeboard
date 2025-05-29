import { NOT_FOUND } from "../constants/httpStatusCodes.js";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "../constants/httpStatusPhrases.js";
<<<<<<< HEAD
import BaseException from "./base-exception.js";
=======
import BaseException from "./baseException.js";
>>>>>>> 017e6737290c9832a0f859a94590d3b404d6e14d
export default class NotFoundException extends BaseException {
    constructor(message, errData) {
        super(NOT_FOUND, message || NOT_FOUND_MESSAGE, NOT_FOUND_MESSAGE, true, errData);
    }
}
