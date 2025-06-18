// exceptions/seedUsersException.ts

import { INTERNAL_SERVER_ERROR } from "../constants/httpStatusCodes.js";
import { FAILED_SEED } from "../constants/appMessages.js";
import BaseException from "./baseException.js";

export default class SeedException extends BaseException {
  constructor(errData?: any) {
    super(INTERNAL_SERVER_ERROR,FAILED_SEED,FAILED_SEED, true,errData);
  }
}
