import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Trip from "@/models/Trip";
import { verifyAuth } from "@/utils/verifyAuth";

export async function PUT(req, { params }) {
    const authResult = verifyAuth(req);
    if (authResult.response) return authResult.response;
    const userId = authResult.userId;

    const { bookingId } = await params;

    try {
        await connectDB();

        const booking = await Booking.findById(bookingId).populate("trip");
        if (!booking) return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });

        // Allow provider (trip creator) or the traveler who booked to cancel
        const isProvider = String(booking.trip?.creator) === String(userId);
        const isTraveler = String(booking.bookedBy) === String(userId);
        if (!isProvider && !isTraveler) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        booking.status = "Cancelled";
        booking.cancelledBy = isProvider ? "Provider" : "Traveler";
        await booking.save();

        return NextResponse.json({ success: true, message: "Booking cancelled successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
