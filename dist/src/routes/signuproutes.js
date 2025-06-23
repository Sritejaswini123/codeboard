import factory from "../factory.js";
import { signUpHandler, signInHandler, signOutWithSessionHandler, signOutHandler } from "../handlers/betterAuthHandler.js";
const authRoutes = factory.createApp();
authRoutes.post("/register", ...signUpHandler);
authRoutes.post("/login", ...signInHandler);
authRoutes.post('/signout', ...signOutHandler);
authRoutes.post('/signout-session', ...signOutWithSessionHandler);
export default authRoutes;
