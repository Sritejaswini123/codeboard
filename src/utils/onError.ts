import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode, StatusCode } from "hono/utils/http-status";

import { INTERNAL_SERVER_ERROR, OK } from "../constants/httpStatusCodes.js";

const onError: ErrorHandler = (err, c) => {
  const currentStatus = "status" in err
    ? err.status
    : c.newResponse(null).status;
  const statusCode = currentStatus !== OK
    ? (currentStatus as StatusCode)
    : INTERNAL_SERVER_ERROR;

  // eslint-disable-next-line node/no-process-env
  const env = c.env?.NODE_ENV || process.env?.NODE_ENV;
  // TODO::Check type of statusCode
  return c.json(
    {
      status: statusCode,
      message: err.message,
      stack: env === "production"
        ? undefined
        : err.stack,
    },
    statusCode as ContentfulStatusCode,
  );
};

export default onError;
