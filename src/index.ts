import { serve } from "@hono/node-server";

import app from "./app";
import env from "./env";

const port = env.PORT;
const apiVersion = env.API_VERSION;
const hostname = env.HOST_NAME;

serve({
  fetch: app.fetch,
  port,
  hostname,
});
console.log(` Server running at http://${hostname}:${port}/${apiVersion}/`);
