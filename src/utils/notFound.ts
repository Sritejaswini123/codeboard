import type { NotFoundHandler } from "hono";

import { NOT_FOUND } from "../constants/httpStatusCodes.js";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "../constants/httpStatusPhrases.js";

const notFound: NotFoundHandler = (c) => {
  return c.json({
    status: NOT_FOUND,
    message: `${NOT_FOUND_MESSAGE} - ${c.req.path}`,
  }, NOT_FOUND);
};

export default notFound;
