import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
    await connectDB();
    try {
        const { phone, otp } = await req.json();

        if (!phone || !otp) {
            return NextResponse.json({ message: "Phone and OTP are required" }, { status: 400 });
        }

        const user = await User.findOne({ phone });
        if (!user) {
            return NextResponse.json({ message: "No account found with this phone number" }, { status: 404 });
        }

        if (!user.phoneOtp || user.phoneOtp !== otp) {
            return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
        }

        if (!user.phoneOtpExpiry || new Date() > user.phoneOtpExpiry) {
            return NextResponse.json({ message: "OTP has expired. Please request a new one." }, { status: 400 });
        }

        if (!user.isVerified) {
            return NextResponse.json({ message: "Please verify your email first before logging in with phone." }, { status: 400 });
        }

        // Clear OTP and mark phone verified
        await User.findByIdAndUpdate(user._id, {
            phoneOtp: null,
            phoneOtpExpiry: null,
            phoneVerified: true,
        });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return NextResponse.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                profilePhoto: user.profilePhoto,
            },
        });
    } catch (err) {
        console.error("Verify phone OTP error:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
