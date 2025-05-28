import { serve } from "@hono/node-server";
import app from "./app";
import env from "./env";
const port = env.PORT;
const apiVersion = env.API_VERSION;
// const hostname = env.HOST_NAME;
serve({
    fetch: app.fetch,
    port,
});
console.log(`🚀 Server running at http://localhost:${port}/${apiVersion}/`);
// serve({
//   fetch: app.fetch,
//   port,
//   hostname,
// });
// console.log(` Server running at http://localhost:${port}/${env.API_VERSION}/`);
// handling errors globally
app.onError((err, c) => {
    if (err.isOperational) {
        // TODO: Log the error
        console.log(err);
    }
    console.error(err);
    c.status(err.status || 555);
    return c.json({
        status: err.status || 555,
        success: false,
        message: err.message || "Internal server error",
        errData: err.errData || undefined,
    });
});
