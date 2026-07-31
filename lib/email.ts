import nodemailer from "nodemailer";

export type MailPayload = {
  subject: string;
  text: string;
  replyTo?: string;
};

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
}

export async function sendMail(payload: MailPayload): Promise<void> {
  const to = process.env.MAIL_TO || "info@thetrueword.com";
  const from =
    process.env.MAIL_FROM ||
    process.env.SMTP_USER ||
    "noreply@thetrueword.com";

  if (!isSmtpConfigured()) {
    throw new Error("SMTP is not configured");
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject: payload.subject,
    text: payload.text,
    replyTo: payload.replyTo,
  });
}

export function mailtoFallbackUrl(subject: string, body: string): string {
  const to = process.env.NEXT_PUBLIC_MAIL_TO || "info@thetrueword.com";
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
