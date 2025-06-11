import factory from "../factory.js";
import { authHandler } from "../handlers/authHandlers.js";
const authRoute = factory.createApp();
authRoute.post("/auth", ...authHandler);
export default authRoute;
