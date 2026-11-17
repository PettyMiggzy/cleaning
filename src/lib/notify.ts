import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { SITE } from "./site";

export type MailAttachment = { filename: string; content: Buffer; contentType: string };

export type Mail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: MailAttachment[];
};

export function notifyAddress() {
  return process.env.NOTIFY_EMAIL || SITE.email;
}

export function emailConfigured() {
  return !!(process.env.RESEND_API_KEY || process.env.SMTP_HOST || process.env.GMAIL_APP_PASSWORD);
}

function fromAddress() {
  if (process.env.MAIL_FROM) return process.env.MAIL_FROM;
  if (process.env.GMAIL_APP_PASSWORD) return `"${SITE.name}" <${process.env.GMAIL_USER || SITE.email}>`;
  return `"${SITE.name}" <${process.env.SMTP_USER || SITE.email}>`;
}

let transport: Transporter | null = null;
function smtp() {
  if (transport) return transport;
  if (process.env.GMAIL_APP_PASSWORD) {
    transport = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER || SITE.email, pass: process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, "") },
    });
  } else {
    const port = Number(process.env.SMTP_PORT || 587);
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
  }
  return transport;
}

/**
 * Sends an email using (in order of preference) Resend, a Gmail app password, or generic SMTP.
 * Returns false (and logs) when email isn't configured or sending fails — callers never throw.
 */
export async function sendMail(mail: Mail): Promise<boolean> {
  if (!emailConfigured()) {
    console.warn(`[notify] email not configured — skipped "${mail.subject}"`);
    return false;
  }
  try {
    if (process.env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromAddress(),
          to: [mail.to],
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
          reply_to: mail.replyTo,
          attachments: mail.attachments?.map((a) => ({ filename: a.filename, content: a.content.toString("base64") })),
        }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
      return true;
    }
    await smtp().sendMail({
      from: fromAddress(),
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      replyTo: mail.replyTo,
      attachments: mail.attachments,
    });
    return true;
  } catch (err) {
    console.error("[notify] failed to send email", err);
    return false;
  }
}

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Branded, email-client-safe HTML wrapper. */
export function emailLayout(title: string, intro: string, rows: [string, string][], footer = "") {
  const tr = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:10px 14px;border-bottom:1px solid #eee;color:#6b6574;font:600 13px Arial,sans-serif;width:38%;vertical-align:top">${escapeHtml(
          k,
        )}</td><td style="padding:10px 14px;border-bottom:1px solid #eee;color:#16131a;font:15px Arial,sans-serif;white-space:pre-wrap">${escapeHtml(
          v,
        )}</td></tr>`,
    )
    .join("");
  return `<!doctype html><html><body style="margin:0;background:#f6f3fa;padding:24px 12px">
<table role="presentation" width="100%" style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e6e1ee">
<tr><td style="background:linear-gradient(135deg,#6a2fa6,#9a5cd3);padding:22px 24px;color:#fff;font:700 20px Georgia,serif">${escapeHtml(
    SITE.name,
  )}<div style="font:400 13px Arial,sans-serif;opacity:.9;margin-top:4px">${escapeHtml(SITE.slogan)}</div></td></tr>
<tr><td style="padding:22px 24px 8px;font:700 18px Arial,sans-serif;color:#16131a">${escapeHtml(title)}</td></tr>
<tr><td style="padding:0 24px 16px;font:15px/1.5 Arial,sans-serif;color:#4a4552">${intro}</td></tr>
<tr><td style="padding:0 10px 10px"><table role="presentation" width="100%" style="border-collapse:collapse">${tr}</table></td></tr>
${footer ? `<tr><td style="padding:16px 24px 24px;font:14px/1.5 Arial,sans-serif;color:#4a4552">${footer}</td></tr>` : ""}
<tr><td style="padding:16px 24px;background:#faf8fc;font:12px Arial,sans-serif;color:#8a8494">${escapeHtml(SITE.name)} · Call or text ${
    SITE.phones.primary.display
  } · Secondary ${SITE.phones.secondary.display}</td></tr>
</table></body></html>`;
}
