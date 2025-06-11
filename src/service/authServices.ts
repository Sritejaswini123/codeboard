
import Brevo from '@getbrevo/brevo';
import { eq, and,or } from 'drizzle-orm'
import db from '../database/db'
import { users } from '../database/schemas/users'
import { otps } from '../database/schemas/otps'


export const findUserByEmailOrPhone = async (emailOrPhone: string)=> {
    console.log('emailOrPhone: ', emailOrPhone);
    // const condition = emailOrPhone ? eq(users.phone, emailOrPhone) : eq(users.email, emailOrPhone) ;
    // console.log('condition: ', condition);

    const user = await db
      .select()
      .from(users)
      .where(or(eq(users.phone, emailOrPhone),eq(users.email, emailOrPhone)))
      .limit(1)

      console.log("user service",user);
      
    return user[0]
  }


const apiKey = process.env.BREVO_API_KEY!
const emailApiInstance = new Brevo.TransactionalEmailsApi()
emailApiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey)

const smsApiInstance = new Brevo.TransactionalSMSApi()
smsApiInstance.setApiKey(Brevo.TransactionalSMSApiApiKeys.apiKey, apiKey)

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const saveOtp = async (target: string, otp: string) => {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
  await db.insert(otps).values({ target, otp, expiresAt })
}

export const sendOtpEmail = async (email: string, otp: string) => {
  const sendSmtpEmail: Brevo.SendSmtpEmail = {
    to: [{ email }],
    sender: {
      name: 'Ravali',
      email: process.env.SENDER_EMAIL!, // Must be a verified sender in Brevo
    },
    subject: 'Your OTP Code',
    htmlContent: `<p>Your OTP is: <strong>${otp}</strong></p>`,
  }

  return await emailApiInstance.sendTransacEmail(sendSmtpEmail)
}

export const sendOtpSms = async (phone: string, otp: string) => {
  const smsRequest: Brevo.SendTransacSms = {
    sender: 'Ravali',
    recipient: phone,
    content: `Your OTP code is: ${otp}`,
    // type: 'transactional',
  }

  return await smsApiInstance.sendTransacSms(smsRequest)
}

export const verifyOtp = async (target: string, otp: string) => {
  const [record] = await db.select().from(otps).where(
    and(
      eq(otps.target, target),
      eq(otps.otp, otp),
      eq(otps.used, false),
    //   otps.expiresAt.gt(new Date())
    )
  )
  if (!record) return null
  await db.update(otps).set({ used: true }).where(eq(otps.id, record.id))
  return record
}