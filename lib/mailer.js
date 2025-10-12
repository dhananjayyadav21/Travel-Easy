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
        secure: Number(SMTP_PORT) === 465,
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

export default { sendVerificationEmail };
