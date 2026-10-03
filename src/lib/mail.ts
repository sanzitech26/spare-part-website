import "server-only";
import nodemailer from "nodemailer";

// Sends mail through the client's SMTP server. Env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM (optional), MAIL_TO.
// If they are not set yet, nothing is sent and callers carry on (orders are still saved in the database).
export const mailConfigured = () => !!(process.env.SMTP_HOST && process.env.MAIL_TO);

export async function sendMail(opts: { subject: string; text: string; replyTo?: string }): Promise<boolean> {
  if (!mailConfigured()) return false;
  try {
    const port = Number(process.env.SMTP_PORT) || 587;
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.MAIL_TO,
      replyTo: opts.replyTo,
      subject: opts.subject,
      text: opts.text, // plain text: customer-supplied values cannot inject HTML
    });
    return true;
  } catch (e) {
    console.error("sendMail failed", e);
    return false;
  }
}
