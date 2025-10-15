import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyAuth } from "@/utils/verifyAuth";
import Trip from "@/models/Trip";
import Booking from "@/models/Booking";
import User from "@/models/User";

export async function PUT(req, { params }) {
    try {
        //connect db
        await connectDB();

        // Verify JWT token
        const authResult = verifyAuth(req);
        if (authResult.response) return authResult.response;

        const userId = authResult.userId;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        // Only providers can complete trips
        if (user.role !== "provider") {
            return NextResponse.json({ message: "Only providers can complete trips." }, { status: 403 });
        }

        const { tripId } = params;

        const trip = await Trip.findOne({ _id: tripId, creator: userId });
        if (!trip) {
            return NextResponse.json({ success: false, message: "Trip not found" }, { status: 404 });
        }

        if (trip.status === "Completed" || trip.status === "Cancelled") {
            return NextResponse.json({
                success: false,
                message: `Trip already ${trip.status}`,
            });
        }

        // Update Trip status
        trip.status = "Completed";
        await trip.save();

        // Update all related Bookings
        await Booking.updateMany(
            { trip: tripId },
            { $set: { status: "Completed" } }
        );

        return NextResponse.json({
            success: true,
            message: "Trip and all related bookings marked as Completed",
        });
    } catch (error) {
        console.error(" Error completing trip:", error);
        return NextResponse.json(
            { success: false, message: "Error completing trip" },
            { status: 500 }
        );
    }
}
