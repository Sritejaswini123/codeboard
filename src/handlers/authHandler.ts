// import { Context } from "hono";
// import { sendResponse } from "../utils/sendResponse";

// // Mock auth object to avoid import error
// const auth = {
//   signUp: {
//     email: async (data: any) => ({ data: { user: data }, error: null }),
//   },
//   verifyEmail: async (token: string) => ({ data: { token }, error: null }),
//   signIn: {
//     email: async (data: any) => ({ data: { user: data }, error: null }),
//   },
//   signOut: async () => {},
//   requestPasswordReset: async (data: any) => ({ data: { email: data.email }, error: null }),
//   resetPassword: async (token: string, data: any) => ({ data: { token, newPassword: data.newPassword }, error: null }),
// };

// export const signUpHandler = async (c: Context) => {
//   try {
//     const { email, password, name, image, callbackURL } = await c.req.json();
//     const { data, error } = await auth.signUp.email({ email, password, name, image, callbackURL });
//     if (error) return sendResponse(c, error.status || 400, error.message);
//     return sendResponse(c, 201, "User signed up successfully", data);
//   } catch (error: any) {
//     return sendResponse(c, 500, "Internal server error");
//   }
// };

// export const verifyEmailHandler = async (c: Context) => {
//   try {
//     const token = c.req.query("token");
//     const { data, error } = await auth.verifyEmail(token);
//     if (error) return sendResponse(c, error.status || 400, error.message);
//     return sendResponse(c, 200, "Email verified successfully", data);
//   } catch (error: any) {
//     return sendResponse(c, 500, "Internal server error");
//   }
// };

// export const signInHandler = async (c: Context) => {
//   try {
//     const { email, password, rememberMe, callbackURL } = await c.req.json();
//     const { data, error } = await auth.signIn.email({ email, password, rememberMe, callbackURL });
//     if (error) return sendResponse(c, error.status || 400, error.message);
//     return sendResponse(c, 200, "User signed in successfully", data);
//   } catch (error: any) {
//     return sendResponse(c, 401, error.message || "Unauthorized");
//   }
// };

// export const signOutHandler = async (c: Context) => {
//   try {
//     await auth.signOut();
//     return sendResponse(c, 200, "User signed out successfully");
//   } catch (error: any) {
//     return sendResponse(c, 500, "Internal server error");
//   }
// };

// export const requestPasswordResetHandler = async (c: Context) => {
//   try {
//     const { email, redirectTo } = await c.req.json();
//     const { data, error } = await auth.requestPasswordReset({ email, redirectTo });
//     if (error) return sendResponse(c, error.status || 400, error.message);
//     return sendResponse(c, 200, "Password reset email sent", data);
//   } catch (error: any) {
//     return sendResponse(c, 500, "Internal server error");
//   }
// };

// export const resetPasswordHandler = async (c: Context) => {
//   try {
//     const token = c.req.query("token");
//     const { newPassword } = await c.req.json();
//     const { data, error } = await auth.resetPassword(token, { newPassword });
//     if (error) return sendResponse(c, error.status || 400, error.message);
//     return sendResponse(c, 200, "Password updated successfully", data);
//   } catch (error: any) {
//     return sendResponse(c, 500, "Internal server error");
//   }
// };
