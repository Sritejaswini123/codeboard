import { pinoLogger } from "hono-pino";

import env from "../env.js";

export function piLogger() {
  return pinoLogger({
    pino:
      env.NODE_ENV === "development"
        ? {
            level: env.LOG_LEVEL,
            transport: {
              target: "pino-pretty",
              // options: {
              //   translateTime: "HH:MM:ss Z",
              //   ignore: "pid,hostname,req",
              // },
            },
          }
        : { level: env.LOG_LEVEL },
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}
