import { getCloudflareEnv } from "@/lib/d1";
import type { DocumentRequest } from "@/lib/request-store";

const FROM_EMAIL = "trust@and-element.com";
const FROM_NAME = "&Element Trust Center";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function notifyAdminsOfDocumentRequest(
  request: DocumentRequest
): Promise<void> {
  const recipients = adminEmails();
  if (recipients.length === 0) {
    console.warn("ADMIN_EMAILS is empty; skipping request notification email.");
    return;
  }

  const env = await getCloudflareEnv();
  if (!env.EMAIL) {
    console.warn("EMAIL binding missing; skipping request notification email.");
    return;
  }

  const adminUrl = `${process.env.NEXTAUTH_URL ?? "https://trust.and-element.com"}/admin`;
  const message = request.message?.trim() || "—";

  const text = [
    "A new document request was submitted on the trust center.",
    "",
    `Document: ${request.document}`,
    `Requester: ${request.email}`,
    `Company: ${request.company}`,
    `Message: ${message}`,
    `Received: ${request.createdAt}`,
    "",
    `Review: ${adminUrl}`,
  ].join("\n");

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, sans-serif; line-height: 1.5; color: #0f172a;">
      <h1 style="font-size: 18px; margin: 0 0 12px;">New document request</h1>
      <p style="margin: 0 0 16px;">A visitor asked for access to a trust-center document.</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 560px;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; width: 120px;">Document</td>
          <td style="padding: 6px 0; font-weight: 600;">${escapeHtml(request.document)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;">Requester</td>
          <td style="padding: 6px 0;"><a href="mailto:${escapeHtml(request.email)}">${escapeHtml(request.email)}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;">Company</td>
          <td style="padding: 6px 0;">${escapeHtml(request.company)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; vertical-align: top;">Message</td>
          <td style="padding: 6px 0;">${escapeHtml(message)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;">Received</td>
          <td style="padding: 6px 0;">${escapeHtml(request.createdAt)}</td>
        </tr>
      </table>
      <p style="margin: 20px 0 0;">
        <a href="${escapeHtml(adminUrl)}" style="display: inline-block; background: #0f172a; color: #fff; text-decoration: none; padding: 10px 14px; border-radius: 8px;">
          Open admin
        </a>
      </p>
    </div>
  `;

  try {
    await env.EMAIL.send({
      from: { email: FROM_EMAIL, name: FROM_NAME },
      to: recipients,
      replyTo: request.email,
      subject: `Document request: ${request.document}`,
      text,
      html,
    });
  } catch (error) {
    // Don't fail the public request if mail delivery fails.
    console.error("Failed to send admin notification email:", error);
  }
}
