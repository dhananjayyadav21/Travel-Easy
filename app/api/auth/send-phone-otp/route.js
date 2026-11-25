import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

async function sendOTPEmail(to, otp, name) {
    await transporter.sendMail({
        from: `"Travel Easy Hai" <${process.env.FROM_EMAIL}>`,
        to,
        subject: `${otp} is your Travel Easy Hai login OTP`,
        html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
            <h2 style="color:#4f46e5;margin-bottom:8px;">Phone Login OTP</h2>
            <p style="color:#374151;">Hi <b>${name || "there"}</b>,</p>
            <p style="color:#374151;">Your one-time password for Travel Easy Hai login is:</p>
            <div style="font-size:40px;font-weight:800;letter-spacing:12px;color:#4f46e5;text-align:center;padding:24px 0;">${otp}</div>
            <p style="color:#6b7280;font-size:13px;">Valid for <b>10 minutes</b>. Do not share this OTP with anyone.</p>
        </div>`,
    });
}

export async function POST(req) {
    await connectDB();
    try {
        const { phone } = await req.json();

        if (!phone || !/^\d{10}$/.test(phone)) {
            return NextResponse.json({ message: "Valid 10-digit phone number required" }, { status: 400 });
        }

        const user = await User.findOne({ phone });
        if (!user) {
            return NextResponse.json({ message: "No account found with this phone number. Please register first." }, { status: 404 });
        }

        const otp = generateOTP();
        const expiry = new Date(Date.now() + 10 * 60 * 1000);

        await User.findByIdAndUpdate(user._id, { phoneOtp: otp, phoneOtpExpiry: expiry });

        await sendOTPEmail(user.email, otp, user.name);

        return NextResponse.json({
            success: true,
            message: `OTP sent to your registered email (${user.email.replace(/(.{2}).+(@.+)/, "$1***$2")})`,
        });
    } catch (err) {
        console.error("Send OTP error:", err);
        return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 });
    }
}
