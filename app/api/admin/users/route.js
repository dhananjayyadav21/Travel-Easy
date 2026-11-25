import { NextResponse } from "next/server";
import { verifyAuth } from "@/utils/verifyAuth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

async function requireAdmin(req) {
    const auth = verifyAuth(req);
    if (auth.response) return { error: auth.response };
    await connectDB();
    const user = await User.findById(auth.userId).select("role");
    if (!user || user.role !== "admin") {
        return { error: NextResponse.json({ message: "Forbidden" }, { status: 403 }) };
    }
    return { ok: true };
}

export async function GET(req) {
    const check = await requireAdmin(req);
    if (check.error) return check.error;

    const { searchParams } = new URL(req.url);
    const tab = searchParams.get("tab") || "all";

    let query = { role: { $ne: "admin" } };
    if (tab === "active") query.isBlocked = { $ne: true };
    if (tab === "blocked") query.isBlocked = true;

    const users = await User.find(query)
        .select("name email phone role isVerified isBlocked createdAt profilePhoto")
        .sort({ createdAt: -1 })
        .limit(100);

    return NextResponse.json({
        users: users.map((u) => ({
            id: u._id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            role: u.role,
            isVerified: u.isVerified,
            isBlocked: u.isBlocked || false,
            profilePhoto: u.profilePhoto,
            createdAt: u.createdAt,
        })),
    });
}

export async function PATCH(req) {
    const check = await requireAdmin(req);
    if (check.error) return check.error;

    const { userId, action } = await req.json();
    if (!userId || !action) {
        return NextResponse.json({ message: "userId and action required" }, { status: 400 });
    }

    const target = await User.findById(userId);
    if (!target) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (action === "block") {
        target.isBlocked = true;
        await target.save();
    } else if (action === "unblock") {
        target.isBlocked = false;
        await target.save();
    } else if (action === "makeProvider") {
        target.role = "provider";
        await target.save();
    } else if (action === "delete") {
        await User.findByIdAndDelete(userId);
    } else {
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
}
