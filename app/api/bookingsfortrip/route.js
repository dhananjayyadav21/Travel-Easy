import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { verifyAuth } from "@/utils/verifyAuth";
import User from "@/models/User";

export async function GET(req) {

    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get("tripId");

    if (!tripId) {
        return NextResponse.json({ success: false, message: "Trip ID is required in params." }, { status: 400 });
    }

    // Verify JWT token
    const authResult = verifyAuth(req);
    if (authResult.response) return authResult.response;

    const userId = authResult.userId;

    try {
        // Connect db
        await connectDB();

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
        }

        // Only provider can use
        if (user.role !== "provider") {
            return NextResponse.json({ success: false, message: "Only provider can access." }, { status: 403 });
        }

        // Fetch all bookings for this trip
        const bookings = await Booking.find({ trip: tripId }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: bookings });

    } catch (error) {
        console.error("Fetch Bookings Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch bookings", error: error.message },
            { status: 500 }
        );
    }
}
