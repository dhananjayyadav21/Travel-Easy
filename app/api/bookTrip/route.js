import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyAuth } from "@/utils/verifyAuth";
import Trip from "@/models/Trip";
import Booking from "@/models/Booking";
import User from "@/models/User";

export async function POST(req) {
    await connectDB();

    // Verify JWT token
    const authResult = verifyAuth(req);
    if (authResult.response) return authResult.response;

    const userId = authResult.userId;

    try {
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        // Only travelers can book trips
        if (user.role !== "traveler") {
            return NextResponse.json({ message: "Only travelers can book trips." }, { status: 403 });
        }

        const body = await req.json();

        const {
            trip,
            source,
            destination,
            contact,
            travelerName,
            travelerNumber,
            seatsBooked,
            numberOfSeats,
            kilometers,
            date,
            totalPrice,
            ratePerKm,
        } = body;

        // Basic field validation
        if (!trip || !source || !destination || !contact || !travelerName || !travelerNumber || !seatsBooked?.length || !numberOfSeats || !kilometers || !date || !totalPrice) {
            return NextResponse.json({ error: "All required fields must be filled." }, { status: 400 });
        }

        // Validate travelerName (letters and spaces only, min 2 chars)
        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        if (!nameRegex.test(travelerName)) {
            return NextResponse.json({ error: "Invalid traveler name." }, { status: 400 });
        }

        // Validate travelerNumber & contact (10-15 digits)
        const phoneRegex = /^\d{10,15}$/;
        if (!phoneRegex.test(travelerNumber)) {
            return NextResponse.json({ error: "Invalid traveler number. Must be 10-15 digits." }, { status: 400 });
        }
        if (!phoneRegex.test(contact)) {
            return NextResponse.json({ error: "Invalid provider contact. Must be 10-15 digits." }, { status: 400 });
        }

        // Check trip existence
        const tripExists = await Trip.findById(trip);
        if (!tripExists) {
            return NextResponse.json({ error: "Trip not found" }, { status: 404 });
        }

        // Validate kilometers against trip's actual distance
        if (parseFloat(kilometers) !== parseFloat(tripExists.kilometer)) {
            return NextResponse.json({
                error: `Entered kilometers (${kilometers}) do not match the trip's distance (${tripExists.kilometer}).`
            }, { status: 400 });
        }

        // Update booked seats
        tripExists.bookedseats = (tripExists.bookedseats || 0) + numberOfSeats;

        // If all seats are booked
        if (tripExists.bookedseats > tripExists.seats) {
            return NextResponse.json({ message: "All seats are already booked." }, { status: 400 });
        }

        await tripExists.save();

        // Create new booking
        const newBooking = new Booking({
            trip,
            source,
            destination,
            contact,
            travelerName,
            travelerNumber,
            seatsBooked,
            numberOfSeats,
            kilometers,
            date,
            totalPrice,
            ratePerKm,
        });
        await newBooking.save();

        return NextResponse.json({ success: true, message: "Booking confirmed!", booking: newBooking }, { status: 201 });

    } catch (error) {
        console.error("Booking API Error:", error);
        return NextResponse.json({ error: "Failed to process booking request." }, { status: 500 });
    }
}
