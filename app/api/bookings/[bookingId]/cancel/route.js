import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyAuth } from "@/utils/verifyAuth";
import Trip from "@/models/Trip";
import Booking from "@/models/Booking";
import User from "@/models/User";

export async function PUT(req, { params }) {

    const { bookingId } = await params;

    if (!bookingId) {
        return NextResponse.json({ success: false, message: "Booking ID is required in params." }, { status: 400 });
    }

    // Verify JWT token
    const authResult = verifyAuth(req);
    if (authResult.response) return authResult.response;

    const userId = authResult.userId;

    try {
        await connectDB();

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
        }

        // Only travelers can cancel their own bookings
        if (user.role !== "traveler") {
            return NextResponse.json({ success: false, message: "Only travelers can cancel bookings." }, { status: 403 });
        }

        // Find the booking by bookingId and bookedBy userId
        const booking = await Booking.findOne({ _id: bookingId, bookedBy: userId });
        if (!booking) {
            return NextResponse.json({ success: false, message: "No booking found for this trip." }, { status: 404 });
        }

        // Prevent double cancellation
        if (booking.status === "Cancelled") {
            return NextResponse.json({ success: false, message: "This booking is already cancelled." }, { status: 400 });
        }

        // Update booking status
        booking.status = "Cancelled";
        booking.cancelledBy = "Me"
        await booking.save();

        // Update Trip's booked seats
        const trip = await Trip.findById(booking.trip);
        if (trip) {
            trip.bookedseats = Math.max(0, trip.bookedseats - booking.numberOfSeats);
            await trip.save();
        }

        // Return success response
        return NextResponse.json({
            success: true,
            message: "Trip booking cancelled successfully.",
            bookingId: booking._id,
            tripId: booking.trip,
            updatedStatus: booking.status,
        });

    } catch (error) {
        console.error(" Cancel Trip API Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to cancel trip.", error: error.message },
            { status: 500 }
        );
    }
}
