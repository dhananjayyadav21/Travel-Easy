// app/api/bookingsfortrip/[bookingId]/status/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyAuth } from "@/utils/verifyAuth";
import Booking from "@/models/Booking";
import Trip from "@/models/Trip";
import User from "@/models/User";

export async function PUT(req, { params }) {
    const { bookingId } = await params;
    const { status } = await req.json();

    if (!bookingId || !status) {
        return NextResponse.json(
            { success: false, message: "Booking ID and status are required" },
            { status: 400 }
        );
    }

    // Verify JWT token
    const authResult = verifyAuth(req);
    if (authResult.response) return authResult.response;
    const userId = authResult.userId;

    try {
        await connectDB();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Only admin or traveler (if needed) can update
        if (!["admin", "traveler"].includes(user.role)) {
            return NextResponse.json(
                { success: false, message: "You are not authorized to update booking status" },
                { status: 403 }
            );
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
        }

        if (booking.status === status) {
            return NextResponse.json({
                success: false,
                message: `Booking is already ${status}`,
            });
        }

        // Update booking status
        booking.status = status;
        await booking.save();

        // If cancelled, free up seats in the Trip
        if (status === "Cancelled") {
            const trip = await Trip.findById(booking.trip);
            if (trip) {
                trip.bookedseats = Math.max(0, trip.bookedseats - booking.numberOfSeats);
                await trip.save();
            }
        }

        return NextResponse.json({
            success: true,
            message: `Booking status updated to ${status}`,
            bookingId: booking._id,
            updatedStatus: booking.status,
        });
    } catch (error) {
        console.error("Update Booking Status Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update status", error: error.message },
            { status: 500 }
        );
    }
}
