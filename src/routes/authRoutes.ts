import factory from "../factory.js";
import { authHandler } from "../handlers/authHandlers.js";
import { verifyOtpHandler } from "../handlers/otpVerificationHandlers.js";


const authRoute = factory.createApp();

authRoute.post("/auth", ...authHandler);
authRoute.post("/verify",...verifyOtpHandler)

export default authRoute;