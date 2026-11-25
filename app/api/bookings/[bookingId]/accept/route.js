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

        // Verify the authenticated user is the trip's provider
        if (String(booking.trip?.creator) !== String(userId)) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        if (booking.status !== "Pending") {
            return NextResponse.json({ success: false, message: "Booking is not in Pending state" }, { status: 400 });
        }

        booking.status = "Active";
        await booking.save();

        return NextResponse.json({ success: true, message: "Booking accepted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
