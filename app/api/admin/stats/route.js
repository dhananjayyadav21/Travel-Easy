import { NextResponse } from "next/server";
import { verifyAuth } from "@/utils/verifyAuth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Trip from "@/models/Trip";
import Booking from "@/models/Booking";

export async function GET(req) {
    const auth = verifyAuth(req);
    if (auth.response) return auth.response;

    await connectDB();

    // Verify admin role
    const user = await User.findById(auth.userId).select("role");
    if (!user || user.role !== "admin") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const [totalUsers, totalRides, activeDrivers] = await Promise.all([
        User.countDocuments({ role: { $ne: "admin" } }),
        Trip.countDocuments(),
        User.countDocuments({ role: "provider" }),
    ]);

    // Total revenue from completed bookings
    const revenueResult = await Booking.aggregate([
        { $match: { status: "Completed" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Daily revenue for last 7 days — parallel queries
    const dayRanges = Array.from({ length: 7 }, (_, idx) => {
        const start = new Date();
        start.setDate(start.getDate() - (6 - idx));
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
        return { start, end };
    });

    const dailyResults = await Promise.all(
        dayRanges.map(({ start, end }) =>
            Booking.aggregate([
                { $match: { status: "Completed", createdAt: { $gte: start, $lte: end } } },
                { $group: { _id: null, total: { $sum: "$totalPrice" } } },
            ])
        )
    );
    const dailyRevenue = dailyResults.map(r => r[0]?.total || 0);

    return NextResponse.json({ totalUsers, totalRides, totalRevenue, activeDrivers, dailyRevenue });
}
