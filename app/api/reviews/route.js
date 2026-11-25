import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import Booking from "@/models/Booking";
import Trip from "@/models/Trip";
import User from "@/models/User";
import { verifyAuth } from "@/utils/verifyAuth";
import { NextResponse } from "next/server";

// POST /api/reviews — submit a review
export async function POST(req) {
    await connectDB();
    const authResult = verifyAuth(req);
    if (authResult.response) return authResult.response;

    try {
        const { bookingId, rating, comment } = await req.json();

        if (!bookingId || !rating || rating < 1 || rating > 5) {
            return NextResponse.json({ message: "bookingId and rating (1-5) required" }, { status: 400 });
        }

        const booking = await Booking.findById(bookingId).populate("trip");
        if (!booking) return NextResponse.json({ message: "Booking not found" }, { status: 404 });
        if (String(booking.bookedBy) !== String(authResult.userId)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }
        if (booking.status !== "Completed") {
            return NextResponse.json({ message: "You can only review completed trips" }, { status: 400 });
        }

        const trip = await Trip.findById(booking.trip);
        if (!trip) return NextResponse.json({ message: "Trip not found" }, { status: 404 });

        const review = await Review.create({
            booking: bookingId,
            trip: trip._id,
            reviewer: authResult.userId,
            provider: trip.creator,
            rating,
            comment: comment?.trim() || "",
        });

        // Recalculate provider's avg rating
        const allReviews = await Review.find({ provider: trip.creator });
        const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await User.findByIdAndUpdate(trip.creator, {
            avgRating: Math.round(avg * 10) / 10,
            totalRatings: allReviews.length,
        });

        return NextResponse.json({ success: true, review }, { status: 201 });
    } catch (err) {
        if (err.code === 11000) {
            return NextResponse.json({ message: "You have already reviewed this trip" }, { status: 409 });
        }
        console.error(err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// GET /api/reviews?providerId= — fetch reviews for a provider
export async function GET(req) {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get("providerId");

    if (!providerId) return NextResponse.json({ message: "providerId required" }, { status: 400 });

    try {
        const reviews = await Review.find({ provider: providerId })
            .populate("reviewer", "name profilePhoto")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ success: true, reviews });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
