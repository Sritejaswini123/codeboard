import { cors } from "hono/cors";
import { SERVICE_UP } from "./constants/appMessages.js";
import env from "./env.js";
import factory from "./factory.js";
<<<<<<< HEAD
import userRoutes from "./routes/userRoutes.js";
import commitRoutes from "./routes/commitRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
// import seedRoute from "./routes/seederRoutes.js";
=======
import commitRoutes from "./routes/commitRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import seedRoute from "./routes/seederRoutes.js";
import userProject from "./routes/userProjectRoutes.js";
import userRoutes from "./routes/userRoutes.js";
>>>>>>> 017e6737290c9832a0f859a94590d3b404d6e14d
import notFound from "./utils/notFound.js";
import onError from "./utils/onError.js";
import { piLogger } from "./utils/pinoLogger.js";
import { sendResponse } from "./utils/sendResponse.js";
<<<<<<< HEAD
import seed from "./routes/realSeedRoute.js";
import imageRoutes from "./routes/imageRoutes.js";
=======
import userProfileRoutes from "./routes/userProfileRoutes.js";
>>>>>>> 017e6737290c9832a0f859a94590d3b404d6e14d
const app = factory.createApp().basePath(env.API_VERSION);
app.use(piLogger());
app.use("*", cors());
app.get("/", (c) => {
    return sendResponse(c, 200, SERVICE_UP);
});
// user routes..........
console.log("inside app");
app.route("/", userRoutes);
app.route('/images', imageRoutes);
app.route("/", projectRoutes);
<<<<<<< HEAD
app.route("/", commitRoutes);
app.route("/seed", seed);
// app.route('/api', uploadRoute);
=======
app.route("/", seedRoute);
app.route("/", userProject);
app.route("/", commitRoutes);
app.route("/", userProfileRoutes);
>>>>>>> 017e6737290c9832a0f859a94590d3b404d6e14d
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
