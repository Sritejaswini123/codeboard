import factory from "../factory.js";
import { signUpHandler , signInHandler} from "../handlers/betterAuthHandler.js"

const authRoutes = factory.createApp();

authRoutes.post("/register", ...signUpHandler);
authRoutes.post("/login", ...signInHandler)

export default authRoutes;