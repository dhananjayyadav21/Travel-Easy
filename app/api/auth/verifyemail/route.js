import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
    try {

        // connect to MongoDB
        await connectDB();

        const { email, code } = await req.json();

        // Basic validation
        if (!email || !code) {
            return NextResponse.json(
                { success: false, message: "Email and verification code are required." },
                { status: 400 }
            );
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found." },
                { status: 404 }
            );
        }

        // Check if already verified
        if (user.isVerified) {
            return NextResponse.json(
                { success: true, message: "Email already verified." },
                { status: 200 }
            );
        }

        // Compare verification code 
        const isCodeValid = code === user.verificationCode
        if (!isCodeValid) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired verification code." },
                { status: 400 }
            );
        }

        // Mark user as verified and clear code
        user.isVerified = true;
        user.verificationCode = undefined;
        await user.save();

        return NextResponse.json(
            { success: true, message: "Email verified successfully." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Verification Error:", error);
        return NextResponse.json(
            { success: false, message: "Server error while verifying email." },
            { status: 500 }
        );
    }
}
