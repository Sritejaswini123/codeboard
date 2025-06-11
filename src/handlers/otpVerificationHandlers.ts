import { verifyOtp } from '../service/authServices'
import { sendResponse } from '../utils/sendResponse'
import { OK, UNPROCESSABLE_ENTITY } from '../constants/httpStatusCodes'
import factory from '../factory'

export const verifyOtpHandler = factory.createHandlers(async (c) => {
  try {
    const { emailOrPhone, otp } = await c.req.json()

    if (!emailOrPhone || !otp) {
      return sendResponse(c, UNPROCESSABLE_ENTITY, 'Validation errors', {
        emailOrPhone: 'Email or phone is required',
        otp: 'OTP is required',
      })
    }

    const record = await verifyOtp(emailOrPhone, otp)

    if (!record) {
      return sendResponse(c, UNPROCESSABLE_ENTITY, 'Invalid or expired OTP')
    }

    return sendResponse(c, OK, 'OTP verified successfully')
  } catch (error) {
    throw error
  }
})
