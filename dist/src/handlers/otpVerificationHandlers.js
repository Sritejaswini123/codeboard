"use strict";
// import { VALIDATION_ERRORS } from "../constants/appMessages";
// import { OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
// import factory from "../factory";
// import { sendResponse } from "../utils/sendResponse";
// export const verifyOtpHandler = factory.createHandlers(async (c) => {
//   try {
//     const { userId, otp } = await c.req.json();
//     if (!userId || !otp) {
//       return sendResponse(c, UNPROCESSABLE_ENTITY, VALIDATION_ERRORS, {
//         userId: "User ID is required",
//         otp: "OTP is required",
//       });
//     }
//     const record = otpStore.get(userId);
//     if (!record) {
//       return sendResponse(c, UNPROCESSABLE_ENTITY, "OTP not found or expired");
//     }
//     if (record.expiresAt < Date.now()) {
//       otpStore.delete(userId);
//       return sendResponse(c, UNPROCESSABLE_ENTITY, "OTP expired");
//     }
//     if (record.otp !== otp) {
//       return sendResponse(c, UNPROCESSABLE_ENTITY, "Invalid OTP");
//     }
//     otpStore.delete(userId);
//     return sendResponse(c, OK, "OTP verified successfully");
//   } catch (error) {
//     throw error;
//   }
// });
