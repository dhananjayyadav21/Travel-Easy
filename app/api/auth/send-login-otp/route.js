import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendLoginOtpEmail } from "@/lib/mailer";

function maskEmail(email) {
  const [local, domain] = email.split("@");
  const visible = local.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(2, local.length - 2))}@${domain}`;
}

export async function POST(req) {
  try {
    const { identifier } = await req.json();
    if (!identifier?.trim()) {
      return NextResponse.json({ error: "Email or phone is required" }, { status: 400 });
    }

    await connectDB();

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim());
    const isPhone = /^\+?[0-9]{10,15}$/.test(identifier.trim().replace(/\s/g, ""));

    if (!isEmail && !isPhone) {
      return NextResponse.json({ error: "Enter a valid email address or phone number" }, { status: 400 });
    }

    const query = isEmail
      ? { email: identifier.trim().toLowerCase() }
      : { phone: identifier.trim().replace(/\s/g, "") };

    const user = await User.findOne(query);
    if (!user) {
      return NextResponse.json({ error: "No account found with this email or phone" }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.loginOtp = otp;
    user.loginOtpExpiry = expiry;
    await user.save();

    await sendLoginOtpEmail(user.email, otp, user.name);

    return NextResponse.json({
      success: true,
      maskedEmail: maskEmail(user.email),
      message: "OTP sent to your registered email address",
    });
  } catch (err) {
    console.error("send-login-otp error:", err);
    return NextResponse.json({ error: "Failed to send OTP. Please try again." }, { status: 500 });
  }
}
