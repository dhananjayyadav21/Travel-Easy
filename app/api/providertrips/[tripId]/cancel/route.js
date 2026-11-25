import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyAuth } from "@/utils/verifyAuth";
import Trip from "@/models/Trip";
import Booking from "@/models/Booking";
import User from "@/models/User";
import { sendPushNotification, sendNotificationEmail } from "@/lib/pushNotification";

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

        // Only providers can cancel trips
        if (user.role !== "provider") {
            return NextResponse.json({ message: "Only providers can cancel trips." }, { status: 403 });
        }

        const { tripId } = await params;

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
        trip.status = "Cancelled";
        await trip.save();

        // Update all related Bookings and notify travelers
        const bookings = await Booking.find({ trip: tripId, status: "Active" }).populate("bookedBy", "pushSubscription email name").lean();
        await Booking.updateMany({ trip: tripId }, { $set: { status: "Cancelled", cancelledBy: "Provider" } });

        // Notify each affected traveler
        for (const booking of bookings) {
            const traveler = booking.bookedBy;
            const payload = {
                title: "Trip Cancelled",
                body: `Your booking on ${trip.source} → ${trip.destination} (${trip.date}) has been cancelled by the provider.`,
                url: "/travelertrips",
            };
            if (traveler?.pushSubscription) sendPushNotification(traveler.pushSubscription, payload);
            if (traveler?.email) {
                sendNotificationEmail(
                    traveler.email,
                    `Your trip has been cancelled — Travel Easy Hai`,
                    `Hi ${traveler.name},<br><br>Unfortunately, your trip from <b>${trip.source}</b> to <b>${trip.destination}</b> on <b>${trip.date}</b> has been <b>cancelled by the provider</b>.<br><br>Please book another trip on Travel Easy Hai.`
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: "Trip and all related bookings marked as Cancelled",
        });
    } catch (error) {
        console.error(" Error cancelling trip:", error);
        return NextResponse.json(
            { success: false, message: "Error cancelling trip" },
            { status: 500 }
        );
    }
}
