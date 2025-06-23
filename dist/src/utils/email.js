// export async function sendEmail({
//   to,
//   subject,
//   text,
// }: {
//   to: string;
//   subject: string;
//   text: string;
// }) {
//   // This is just a placeholder — real email logic goes here.
//   console.log(`Sending email to: ${to}`);
//   console.log(`Subject: ${subject}`);
//   console.log(`Message: ${text}`);
// }
// import nodemailer from "nodemailer";
// export async function sendEmail({
//   to,
//   subject,
//   text,
// }: {
//   to: string;
//   subject: string;
//   text: string;
// }) {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
//   await transporter.sendMail({
//     from: `"Better Auth App" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     text,
//   });
//   console.log(` Email sent to ${to}`);
// }
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
export async function sendEmail({ to, subject, text, }) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    }
    catch (error) {
        console.error('Email error:', error);
        throw error;
    }
}
