import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyAuth } from "@/utils/verifyAuth";
import { NextResponse } from "next/server";

export async function GET(req) {
    await connectDB();
    const authResult = verifyAuth(req);
    if (authResult.response) return authResult.response;

    try {
        const user = await User.findById(authResult.userId)
            .select("-password -verificationCode -phoneOtp -phoneOtpExpiry -pushSubscription")
            .lean();

        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        return NextResponse.json({ user });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
