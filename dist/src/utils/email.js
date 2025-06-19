export async function sendEmail({ to, subject, text, }) {
    // Integrate your mail provider here
    console.log(`📧 Sending email to ${to}: ${subject}\n${text}`);
}
