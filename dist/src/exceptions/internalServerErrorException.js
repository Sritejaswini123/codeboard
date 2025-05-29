import { INTERNAL_SERVER_ERROR } from "../constants/httpStatusCodes.js";
import { INTERNAL_SERVER_ERROR as INTERNAL_SERVER_ERROR_MESSAGE } from "../constants/httpStatusPhrases.js";
<<<<<<< HEAD
import BaseException from "./base-exception.js";
=======
import BaseException from "./baseException.js";
>>>>>>> 017e6737290c9832a0f859a94590d3b404d6e14d
export default class InternalServerErrorException extends BaseException {
    constructor(message, errData) {
        super(INTERNAL_SERVER_ERROR, message || INTERNAL_SERVER_ERROR_MESSAGE, INTERNAL_SERVER_ERROR_MESSAGE, true, errData);
    }
}
