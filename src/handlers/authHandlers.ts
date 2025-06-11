import { USER_NOT_FOUND, VALIDATION_ERRORS } from "../constants/appMessages";
import { OK, UNPROCESSABLE_ENTITY } from "../constants/httpStatusCodes";
import NotFoundException from "../exceptions/notFoundException";
import factory from "../factory";
import { findUserByEmailOrPhone, saveOtp } from "../service/authServices";
import { sendResponse } from "../utils/sendResponse";
import { generateOTP, sendOtpEmail, sendOtpSms } from "../service/authServices";


export const authHandler = factory.createHandlers(async (c) => {
  try {
    const { emailOrPhone } = await c.req.json()

    if (!emailOrPhone) {
      return sendResponse(c, UNPROCESSABLE_ENTITY, VALIDATION_ERRORS, {
        emailOrPhone: 'Email or phone is required',
      })
    }

    // Find user by email or phone
    const user = await findUserByEmailOrPhone(emailOrPhone)

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND)
    }

    // Generate OTP
    const otp = generateOTP()

    // Save OTP in DB with expiration
    await saveOtp(emailOrPhone, otp)

    // Send OTP by email or SMS
    if (emailOrPhone) {
      await sendOtpEmail(user.email, otp)
    } else {
      await sendOtpSms(user.phone, otp)
    }

    // Respond success with user id or relevant info
    return sendResponse(c, OK, 'OTP sent successfully', { user: user.id })
  } catch (error) {
    throw error // You might want to handle known errors here explicitly
  }
})
