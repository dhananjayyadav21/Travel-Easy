import * as webpush from "web-push";

export async function sendPushNotification(subscription, payload) {
    if (!subscription || !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return;

    webpush.setVapidDetails(
        `mailto:${process.env.VAPID_EMAIL || "admin@traveleasyhai.com"}`,
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
    try {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
    } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
            // Subscription expired — could clean up DB here
            console.log("Push subscription expired/invalid");
        } else {
            console.error("Push notification error:", err);
        }
    }
}

import nodemailer from "nodemailer";

const mailer = nodemailer.createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function sendNotificationEmail(to, subject, body) {
    if (!process.env.SMTP_USER || !to) return;
    try {
        await mailer.sendMail({
            from: `"Travel Easy Hai" <${process.env.FROM_EMAIL}>`,
            to,
            subject,
            html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
                <h2 style="color:#4f46e5;">Travel Easy Hai</h2>
                <p style="color:#374151;font-size:16px;">${body}</p>
                <p style="color:#9ca3af;font-size:12px;margin-top:24px;">Travel Easy Hai — Affordable Seat Sharing</p>
            </div>`,
        });
    } catch (err) {
        console.error("Email notification error:", err);
    }
}
