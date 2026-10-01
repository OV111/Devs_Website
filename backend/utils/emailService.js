import { Resend } from "resend";
import process from "node:process";

export async function sendPasswordResetEmail(toEmail, resetUrl) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Vahoha <onboarding@resend.dev>",
    to: toEmail,
    subject: "Reset your Vahoha password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#7c3aed">Reset your password</h2>
        <p>Click the button below. This link expires in <strong>1 hour</strong>.</p>
        <a href="${resetUrl}"
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
          Reset Password
        </a>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">
          If you didn't request this, ignore this email.
        </p>
      </div>
    `,
  });
}

// User input goes into HTML, so escape it — otherwise a message containing
// <a href=...> or <img> would render as real markup in the inbox.
const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

// Contact-form messages go to the team inbox. Reply-To is the sender, so
// hitting "Reply" in the inbox answers them directly.
export async function sendContactNotification({ name, email, topic, message }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Vahoha Contact <onboarding@resend.dev>",
    to: process.env.CONTACT_INBOX || "hello.vahoha@gmail.com",
    replyTo: email,
    subject: `[Contact] ${topic} — ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px">
        <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
        <p><strong>Topic:</strong> ${escapeHtml(topic)}</p>
        <p style="white-space:pre-wrap;border-left:3px solid #7c3aed;padding-left:12px">${escapeHtml(message)}</p>
      </div>
    `,
  });
}
