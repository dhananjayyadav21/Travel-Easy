import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;

let transporter;
if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,  // true for 465 (SSL), false for 587 (TLS)
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
} else {
  console.warn('SMTP not configured; verification emails will not be sent.');
}

const LOGO_URL = 'https://traveleasyhai.vercel.app/images/logo.png';
const APP_URL = 'https://traveleasyhai.vercel.app';
const YEAR = new Date().getFullYear();

function emailShell(bodyHtml) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f3f4f6;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;">

        <!-- LOGO ROW -->
        <tr>
          <td style="padding:0 0 20px 0;">
            <table cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="vertical-align:middle;padding-right:8px;">
                  <img src="${LOGO_URL}" width="28" height="28" alt="TravelEasyHai" style="display:block;border-radius:6px;"/>
                </td>
                <td style="vertical-align:middle;">
                  <span style="font-size:15px;font-weight:700;color:#111827;letter-spacing:-0.2px;">TravelEasy<span style="color:#7C3AED;">Hai</span></span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CARD -->
        <tr>
          <td style="background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:36px 40px;">
            ${bodyHtml}
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:20px 0 0 0;text-align:center;">
            <span style="font-size:12px;color:#9ca3af;">© ${YEAR} TravelEasyHai &nbsp;·&nbsp; <a href="${APP_URL}" style="color:#9ca3af;text-decoration:none;">traveleasyhai.vercel.app</a></span>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendVerificationEmail(to, verificationCode, name) {
  if (!transporter) return false;

  const verifyLink = `${APP_URL}/verifyemail?email=${encodeURIComponent(to)}`;

  const body = `
    <p style="margin:0 0 6px 0;font-size:16px;font-weight:600;color:#111827;">Verify your email address</p>
    <p style="margin:0 0 24px 0;font-size:14px;color:#6b7280;line-height:1.6;">
      Hi ${name}, enter the code below on the verification page to activate your TravelEasyHai account.
    </p>

    <!-- OTP box -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;">
      <tr><td align="center">
        <div style="display:inline-block;background:#faf5ff;border:1.5px solid #ddd6fe;border-radius:10px;padding:18px 36px;text-align:center;">
          <div style="font-size:11px;font-weight:600;color:#8b5cf6;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;">Verification Code</div>
          <div style="font-size:36px;font-weight:800;color:#111827;letter-spacing:10px;font-family:'Courier New',Courier,monospace;">${verificationCode}</div>
          <div style="font-size:12px;color:#9ca3af;margin-top:8px;">Expires in 30 minutes</div>
        </div>
      </td></tr>
    </table>

    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;">
      <tr><td align="center">
        <a href="${verifyLink}" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;">Verify Email Address</a>
      </td></tr>
    </table>

    <hr style="border:none;border-top:1px solid #f3f4f6;margin:0 0 20px 0;"/>

    <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
      If you didn't create an account with TravelEasyHai, you can safely ignore this email.
      This link expires in 30 minutes.
    </p>
  `;

  return transporter.sendMail({
    from: `"TravelEasyHai" <${FROM_EMAIL}>`,
    to,
    subject: `${verificationCode} — Verify your TravelEasyHai account`,
    html: emailShell(body),
  });
}

export async function sendLoginOtpEmail(to, otp, name) {
  if (!transporter) return false;

  const body = `
    <p style="margin:0 0 6px 0;font-size:16px;font-weight:600;color:#111827;">Your login code</p>
    <p style="margin:0 0 24px 0;font-size:14px;color:#6b7280;line-height:1.6;">
      Hi ${name}, use the one-time code below to sign in to your TravelEasyHai account.
    </p>

    <!-- OTP box -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;">
      <tr><td align="center">
        <div style="display:inline-block;background:#faf5ff;border:1.5px solid #ddd6fe;border-radius:10px;padding:18px 36px;text-align:center;">
          <div style="font-size:11px;font-weight:600;color:#8b5cf6;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;">One-Time Password</div>
          <div style="font-size:36px;font-weight:800;color:#111827;letter-spacing:10px;font-family:'Courier New',Courier,monospace;">${otp}</div>
          <div style="font-size:12px;color:#9ca3af;margin-top:8px;">Expires in 10 minutes</div>
        </div>
      </td></tr>
    </table>

    <hr style="border:none;border-top:1px solid #f3f4f6;margin:0 0 20px 0;"/>

    <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
      Never share this code with anyone. TravelEasyHai will never ask for your OTP over a call or chat.
      If you didn't request this, you can safely ignore this email.
    </p>
  `;

  return transporter.sendMail({
    from: `"TravelEasyHai" <${FROM_EMAIL}>`,
    to,
    subject: `${otp} is your TravelEasyHai login code`,
    html: emailShell(body),
  });
}

export default { sendVerificationEmail, sendLoginOtpEmail };
