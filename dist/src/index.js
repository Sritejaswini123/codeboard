import { serve } from "@hono/node-server";
import app from "./app";
import env from "./env";
const port = env.PORT;
const apiVersion = env.API_VERSION;
serve({
    fetch: app.fetch,
    port,
});
<<<<<<< HEAD
console.log(` Server running at http://localhost:${port}/${apiVersion}/`);
=======
console.log(`🚀 Server running at http://localhost:${port}/${apiVersion}/`);
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
>>>>>>> 017e6737290c9832a0f859a94590d3b404d6e14d
