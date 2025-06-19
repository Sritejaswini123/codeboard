import { betterAuth } from "better-auth";
//If it's not enabled, it'll not allow you to sign in or sign up with email and password
export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    }
});
