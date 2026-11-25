import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyAuth } from "@/utils/verifyAuth";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();
    const authResult = verifyAuth(req);
    if (authResult.response) return authResult.response;

    try {
        const subscription = await req.json();
        await User.findByIdAndUpdate(authResult.userId, { pushSubscription: subscription });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
