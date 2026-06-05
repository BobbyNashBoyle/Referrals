import { Resend } from "resend";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v) {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const referrerEmail = clean(body.referrerEmail);
  const friendName = clean(body.friendName);
  const friendEmail = clean(body.friendEmail);
  const friendPhone = clean(body.friendPhone);

  if (!EMAIL_RE.test(referrerEmail)) return Response.json({ error: "Invalid referrer email." }, { status: 400 });
  if (friendName.length < 2) return Response.json({ error: "Invalid friend name." }, { status: 400 });
  if (!EMAIL_RE.test(friendEmail)) return Response.json({ error: "Invalid friend email." }, { status: 400 });
  if (friendPhone && friendPhone.replace(/[^\d]/g, "").length < 7)
    return Response.json({ error: "Invalid friend phone." }, { status: 400 });

  const phoneDisplay = friendPhone || "Not provided";

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.REFERRAL_NOTIFY_EMAIL;
  const from = process.env.REFERRAL_FROM_EMAIL || "Nash Referrals <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.error("Missing RESEND_API_KEY or REFERRAL_NOTIFY_EMAIL env vars.");
    return Response.json({ error: "Email is not configured yet. Please try again later." }, { status: 500 });
  }

  const submittedAt = new Date().toLocaleString("en-US", { timeZone: "America/New_York", timeZoneName: "short" });

  const text = [
    "New Nash referral submitted",
    "",
    `Referred by (gift card recipient): ${referrerEmail}`,
    "",
    "Their referral:",
    `  Name:  ${friendName}`,
    `  Email: ${friendEmail}`,
    `  Phone: ${phoneDisplay}`,
    "",
    `Submitted: ${submittedAt}`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#01051e;max-width:560px">
      <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#5a7498;margin:0 0 4px">Nash Referral Program</p>
      <h2 style="margin:0 0 20px;font-size:22px">New referral submitted</h2>
      <table style="border-collapse:collapse;width:100%;font-size:15px">
        <tr><td style="padding:8px 0;color:#5a7498;width:160px">Gift card recipient</td><td style="padding:8px 0"><a href="mailto:${referrerEmail}">${referrerEmail}</a></td></tr>
        <tr><td colspan="2" style="padding:18px 0 6px;font-weight:600">Their referral</td></tr>
        <tr><td style="padding:8px 0;color:#5a7498">Name</td><td style="padding:8px 0">${friendName}</td></tr>
        <tr><td style="padding:8px 0;color:#5a7498">Email</td><td style="padding:8px 0"><a href="mailto:${friendEmail}">${friendEmail}</a></td></tr>
        <tr><td style="padding:8px 0;color:#5a7498">Phone</td><td style="padding:8px 0">${friendPhone ? `<a href="tel:${friendPhone}">${friendPhone}</a>` : "Not provided"}</td></tr>
        <tr><td style="padding:8px 0;color:#5a7498">Submitted</td><td style="padding:8px 0">${submittedAt}</td></tr>
      </table>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: to.split(",").map((s) => s.trim()),
      replyTo: referrerEmail,
      subject: `New Nash referral: ${friendName} (via ${referrerEmail})`,
      text,
      html,
    });
    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: "Could not send the referral. Please try again." }, { status: 502 });
    }
  } catch (e) {
    console.error("Send failed:", e);
    return Response.json({ error: "Could not send the referral. Please try again." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
