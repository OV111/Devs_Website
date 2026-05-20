import { Resend } from "resend";
import process from "node:process";

export async function sendPasswordResetEmail(toEmail, resetUrl) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "DevsWebs <onboarding@resend.dev>",
    to: toEmail,
    subject: "Reset your DevsWebs password",
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
