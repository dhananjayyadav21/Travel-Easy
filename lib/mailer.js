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

export async function sendVerificationEmail(to, verificationCode, name) {
  if (!transporter) {
    return false;
  }

  const appName = 'TravelEasy';

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Verify your email</title>
  <style>
    /* Simple, email-safe styles */
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 24px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 6px 18px rgba(20,20,30,0.08);
    }
    .header {
      background: linear-gradient(90deg,#10b981,#059669);
      color: #fff;
      padding: 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 20px;
      letter-spacing: -0.2px;
    }
    .body {
      padding: 24px;
      color: #0f172a;
      line-height: 1.5;
    }
    .greeting {
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 600;
    }
    .intro {
      margin-bottom: 18px;
      color: #475569;
    }
    .code-box {
      display: block;
      background: #f8fafc;
      border: 1px dashed #e6eef2;
      padding: 18px;
      text-align: center;
      border-radius: 8px;
      font-size: 22px;
      letter-spacing: 4px;
      font-weight: 700;
      color: #0f172a;
      margin: 16px 0;
    }
    .cta {
      display: block;
      width: fit-content;
      margin: 8px 0 18px;
      text-decoration: none;
      background: #0f172a;
      color: #fff;
      padding: 12px 22px;
      border-radius: 8px;
      font-weight: 600;
    }
    .small {
      font-size: 13px;
      color: #64748b;
    }
    .footer {
      background: #fbfbfd;
      padding: 16px 24px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
    }
    .muted-link {
      color: #0f172a;
      text-decoration: underline;
    }

    /* Make email responsive */
    @media (max-width: 420px) {
      .body { padding: 18px; }
      .header { padding: 18px; }
    }
  </style>
</head>
<body>
  <div class="container" role="article" aria-label="Email verification">
    <div class="header">
      <h1>${appName} — Verify your email</h1>
    </div>

    <div class="body">
      <div class="greeting">Hi ${name},</div>

      <div class="intro">
        Thanks for creating an account with <strong>${appName}</strong>. To complete your sign up, please use the verification code below or click the button to verify your email.
      </div>

      <!-- Verification code block -->
      <div class="code-box" aria-hidden="true">${verificationCode}</div>
 
        <p style="color: #777; font-size: 13px; text-align: center; margin-top: 15px;">
          Open and verify with code: <br>
          <a href="https://traveleasyhai.vercel.app/verifyemail?email=${to}" 
            style="color: #007bff; word-break: break-all;">
            https://traveleasyhai.vercel.app/verifyemail?email=${to}
          </a>
        </p>

      <p class="small" style="margin-top:12px">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>

    <div class="footer">
      <div>${appName} • Trusted travel providers & secure bookings</div>
      <div style="margin-top:6px">© <span id="year"></span> ${appName}. All rights reserved.</div>
    </div>
  </div>

  <!-- small inline script to show current year in supported clients (non-critical) -->
  <script>
    try {
      document.getElementById('year').textContent = new Date().getFullYear();
    } catch (e) {}
  </script>
</body>
</html>

        `;

  const info = await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: 'Verify your TravelEasy account',
    html,
  });

  return info;
}

export async function sendLoginOtpEmail(to, otp, name) {
  if (!transporter) return false;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Your Login OTP — TravelEasyHai</title>
</head>
<body style="margin:0;padding:0;background:#F5F3FF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F3FF;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(109,40,217,0.12);">

        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,#2D1B69 0%,#5B21B6 50%,#7C3AED 100%);padding:36px 32px;text-align:center;">
            <!-- Logo icon -->
            <div style="display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);border-radius:14px;padding:12px;margin-bottom:16px;">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8">
                <rect x="2" y="8" width="20" height="10" rx="2"/>
                <circle cx="7" cy="18" r="2.5" fill="white" stroke="white"/>
                <circle cx="17" cy="18" r="2.5" fill="white" stroke="white"/>
                <path d="M2 11l3-5h14l3 5" stroke-linejoin="round"/>
              </svg>
            </div>
            <div style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">TravelEasy<span style="color:#FCD34D;">Hai</span></div>
            <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:4px;">Share Ride. Save More.</div>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:36px 32px;">
            <div style="font-size:15px;font-weight:600;color:#111827;margin-bottom:6px;">Hi ${name} 👋</div>
            <div style="font-size:14px;color:#6B7280;line-height:1.6;margin-bottom:28px;">
              Use the OTP below to log in to your <strong style="color:#7C3AED;">TravelEasyHai</strong> account. This code is valid for <strong>10 minutes</strong>.
            </div>

            <!-- OTP BOX -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr><td align="center">
                <div style="display:inline-block;background:#F5F3FF;border:2px dashed #C4B5FD;border-radius:16px;padding:20px 40px;">
                  <div style="font-size:11px;font-weight:600;color:#8B5CF6;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">Your OTP Code</div>
                  <div style="font-size:40px;font-weight:800;color:#7C3AED;letter-spacing:12px;font-family:'Courier New',monospace;">${otp}</div>
                  <div style="font-size:11px;color:#9CA3AF;margin-top:8px;">Expires in 10 minutes</div>
                </div>
              </td></tr>
            </table>

            <!-- TIPS -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;border-radius:12px;overflow:hidden;margin-bottom:24px;">
              <tr>
                <td style="padding:16px 20px;">
                  <div style="font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">Security Tips</div>
                  <div style="font-size:13px;color:#6B7280;line-height:1.6;">
                    • Never share this OTP with anyone<br/>
                    • TravelEasyHai will never ask for your OTP via call<br/>
                    • If you didn't request this, ignore this email
                  </div>
                </td>
              </tr>
            </table>

            <div style="font-size:13px;color:#9CA3AF;line-height:1.5;">
              Trouble logging in? Reply to this email or contact our support team.
            </div>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#F9FAFB;border-top:1px solid #F3F4F6;padding:20px 32px;text-align:center;">
            <div style="font-size:12px;color:#9CA3AF;">© ${new Date().getFullYear()} TravelEasyHai · India's Most Affordable Carpooling</div>
            <div style="font-size:11px;color:#D1D5DB;margin-top:4px;">This is an automated message, please do not reply directly.</div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;

  return transporter.sendMail({
    from: `"TravelEasyHai" <${FROM_EMAIL}>`,
    to,
    subject: `${otp} is your TravelEasyHai login OTP`,
    html,
  });
}

export default { sendVerificationEmail, sendLoginOtpEmail };
