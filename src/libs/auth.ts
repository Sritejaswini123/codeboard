import { betterAuth } from "better-auth";
import { Pool } from "pg";
import fs from 'fs';
import { sendEmail } from "../utils/email";
export const auth = betterAuth({
  database: new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '6000'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false,
      ca: fs.readFileSync("./ca.pem").toString(),
    }
  }),
  emailAndPassword: {
    enabled: true,
  }
})
//     emailVerification: {
//       enabled: true ,
//   sendVerificationEmail: async (
//   {
//     user,
//     url,
//     token,
//   }: {
//     user: { email: string }; // you can expand this as per your user schema
//     url: string;
//     token: string;
//   },
//   request: Request // or just `any` if you're unsure about the request shape
// ) => {
//   await sendEmail({
//     to: user.email,
//     subject: "Verify your email address",
//     text: `Click the link to verify your email: ${url}`,
//   });
// }
//     },
//   },
// });