import { cors } from "hono/cors";
import { SERVICE_UP } from "./constants/appMessages.js";
import env from "./env.js";
import factory from "./factory.js";
import commitRoutes from "./routes/commitRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import commitRoutes from "./routes/commitRoutes.js";
import seedRoute from "./routes/seederRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notFound from "./utils/notFound.js";
import onError from "./utils/onError.js";
import { piLogger } from "./utils/pinoLogger.js";
import { sendResponse } from "./utils/sendResponse.js";
import userProject from "./routes/userProjectRoutes.js";
const app = factory.createApp().basePath(env.API_VERSION);
app.use(piLogger());
app.use("*", cors());
app.get("/", (c) => {
    return sendResponse(c, 200, SERVICE_UP);
});
// user routes..........
console.log("inside app");
app.route("/", userRoutes);
app.route("/", projectRoutes);
app.route("/", commitRoutes);
app.route("/", seedRoute);
app.route("/", userProject);
app.route("/", commitRoutes);
projectRoutes;
app.get("/error", (c) => {
    c.status(422);
    c.var.logger.debug("Test error only visible in development");
    throw new Error("Test error");
});
app.notFound(notFound);
// app.notFound((c) => {
//   const invalidUrl = c.req.url;
//   return c.json(
//     {
//       status: 404,
//       success: false,
//       message: `The URL you entered is invalid: ${invalidUrl}`,
//     },
//     404
//   );
// });
app.onError(onError);
export default app;
