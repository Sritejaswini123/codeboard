export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  // Integrate your mail provider here
  console.log(`📧 Sending email to ${to}: ${subject}\n${text}`);
}

