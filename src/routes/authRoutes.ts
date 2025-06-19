import factory from "../factory.js";
import { signUpHandler, verifyUserHandler } from "../handlers/betterAuthHandlers.js";

const authRoutes = factory.createApp();

authRoutes.post("/register", ...signUpHandler);
authRoutes.get("/verify-user", ...verifyUserHandler);

export default authRoutes;
