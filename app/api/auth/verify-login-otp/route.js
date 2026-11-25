import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { identifier, otp } = await req.json();
    if (!identifier?.trim() || !otp?.trim()) {
      return NextResponse.json({ error: "Identifier and OTP are required" }, { status: 400 });
    }

    await connectDB();

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim());
    const query = isEmail
      ? { email: identifier.trim().toLowerCase() }
      : { phone: identifier.trim().replace(/\s/g, "") };

    const user = await User.findOne(query);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.loginOtp || !user.loginOtpExpiry) {
      return NextResponse.json({ error: "No OTP requested. Please request a new OTP." }, { status: 400 });
    }

    if (new Date() > new Date(user.loginOtpExpiry)) {
      user.loginOtp = undefined;
      user.loginOtpExpiry = undefined;
      await user.save();
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    if (user.loginOtp !== otp.trim()) {
      return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 400 });
    }

    // Clear OTP fields
    user.loginOtp = undefined;
    user.loginOtpExpiry = undefined;
    // Mark verified if not already
    if (!user.isVerified) user.isVerified = true;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (err) {
    console.error("verify-login-otp error:", err);
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}
