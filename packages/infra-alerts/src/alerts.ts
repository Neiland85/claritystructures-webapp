import nodemailer from 'nodemailer';

type AlertPayload = {
  subject: string;
  message: string;
};

export async function sendCriticalAlert({ subject, message }: AlertPayload) {
  if (!process.env.ALERT_EMAIL) return;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: 'Clarity Structures <no-reply@claritystructures.com>',
    to: process.env.ALERT_EMAIL,
    subject,
    text: message,
  });
}
