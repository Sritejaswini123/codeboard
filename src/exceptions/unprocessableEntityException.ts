import { UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes.js";
import { UNPROCESSABLE_ENTITY as UNPROCESSABLE_ENTITY_MESSAGE } from "../constants/httpStatusPhrases.js";
<<<<<<< HEAD
import BaseException from "./base-exception.js";
=======
import BaseException from "./baseException.js";
>>>>>>> 017e6737290c9832a0f859a94590d3b404d6e14d

export default class UnprocessableEntityException extends BaseException {
  constructor(message?: string, errData?: any) {
    super(UNPROCESSABLE_ENTITY, message || UNPROCESSABLE_ENTITY_MESSAGE, UNPROCESSABLE_ENTITY_MESSAGE, true, errData);
  }
}
