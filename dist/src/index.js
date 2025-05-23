import { serve } from "@hono/node-server";
import app from "./app";
import env from "./env";
const port = env.PORT;
const apiVersion = env.API_VERSION;
serve({
    fetch: app.fetch,
    port,
});
console.log(` Server running at http://localhost:${port}/${apiVersion}/`);
