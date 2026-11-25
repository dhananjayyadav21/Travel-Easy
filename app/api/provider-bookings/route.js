import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Trip from "@/models/Trip";
import { verifyAuth } from "@/utils/verifyAuth";

export async function GET(req) {
    const authResult = verifyAuth(req);
    if (authResult.response) return authResult.response;
    const userId = authResult.userId;

    try {
        await connectDB();
        const trips = await Trip.find({ creator: userId }).select("_id source destination").lean();
        const tripIds = trips.map(t => t._id);
        const tripMap = Object.fromEntries(trips.map(t => [t._id.toString(), t]));

        const bookings = await Booking.find({ trip: { $in: tripIds } })
            .sort({ createdAt: -1 })
            .lean();

        const data = bookings.map(b => ({
            ...b,
            tripSource: tripMap[b.trip?.toString()]?.source || "",
            tripDestination: tripMap[b.trip?.toString()]?.destination || "",
        }));

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
