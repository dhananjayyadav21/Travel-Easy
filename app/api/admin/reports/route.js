import { NextResponse } from "next/server";
import { verifyAuth } from "@/utils/verifyAuth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Booking from "@/models/Booking";
import Trip from "@/models/Trip";

export async function GET(req) {
    const auth = verifyAuth(req);
    if (auth.response) return auth.response;

    await connectDB();

    const adminUser = await User.findById(auth.userId).select("role");
    if (!adminUser || adminUser.role !== "admin") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const range = parseInt(searchParams.get("range") || "30", 10);

    const now = new Date();
    const periodStart = new Date(now);
    periodStart.setDate(periodStart.getDate() - range);
    periodStart.setHours(0, 0, 0, 0);

    const prevPeriodStart = new Date(periodStart);
    prevPeriodStart.setDate(prevPeriodStart.getDate() - range);

    // Revenue for current period
    const [currentResult, prevResult] = await Promise.all([
        Booking.aggregate([
            { $match: { status: "Completed", createdAt: { $gte: periodStart } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),
        Booking.aggregate([
            { $match: { status: "Completed", createdAt: { $gte: prevPeriodStart, $lt: periodStart } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),
    ]);

    const totalRevenue = currentResult[0]?.total || 0;
    const prevRevenue = prevResult[0]?.total || 0;
    const growth = prevRevenue > 0 ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100) : 0;

    // Build daily data
    const dailyData = [];
    const daysToShow = Math.min(range, 30);
    for (let i = daysToShow - 1; i >= 0; i--) {
        const dayStart = new Date(now);
        dayStart.setDate(dayStart.getDate() - i);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);

        const [revResult, ridesResult] = await Promise.all([
            Booking.aggregate([
                { $match: { status: "Completed", createdAt: { $gte: dayStart, $lte: dayEnd } } },
                { $group: { _id: null, total: { $sum: "$totalPrice" } } },
            ]),
            Trip.countDocuments({ createdAt: { $gte: dayStart, $lte: dayEnd } }),
        ]);

        dailyData.push({
            date: dayStart.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
            revenue: revResult[0]?.total || 0,
            rides: ridesResult,
        });
    }

    return NextResponse.json({ totalRevenue, growth, dailyData });
}
