import { cors } from "hono/cors";

import { SERVICE_UP } from "./constants/appMessages.js";
import env from "./env.js";
import factory from "./factory.js";
import commitRoutes from "./routes/commitRoutes.js";
// import imageRoutes from "./routes/imageRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import seed from "./routes/realSeedRoute.js";
import repositoryRoutes from "./routes/repositoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// import seedRoute from "./routes/seederRoutes.js";
import notFound from "./utils/notFound.js";
import onError from "./utils/onError.js";
import { piLogger } from "./utils/pinoLogger.js";
import { sendResponse } from "./utils/sendResponse.js";
import s3Routes from "./routes/s3PrivateFileRoutes.js";
import s3PublicRoutes from "./routes/s3PublicFileRoutes.js";
import authRoutes from "./routes/signuproutes.js";
const app = factory.createApp().basePath(env.API_VERSION);

app.use(piLogger());
app.use("*", cors());
app.get("/test/:name", (c) => {
  const name = c.req.param("name");
  return c.text(`CORS is working!-->Hello ${name}!`);
});
app.get("/", (c) => {
  return sendResponse(c, 200, SERVICE_UP);
});
// user routes..........
app.route("/", repositoryRoutes);
console.log("inside app");
app.route("/", userRoutes);
// app.route("/images", imageRoutes);
app.route("/", projectRoutes);
app.route("/", commitRoutes);
app.route("/seed", seed);
app.route("/", s3Routes);
// app.route('/api', uploadRoute);
app.route("/", s3PublicRoutes)
app.route("/", authRoutes);
app.get("/error", (c) => {
  c.status(422);
  c.var.logger.debug("Test error only visible in development");
  throw new Error("Test error");
});
app.notFound(notFound);
app.onError(onError);

export default app;
