import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyAuth } from "@/utils/verifyAuth";
import Trip from "@/models/Trip";
import Booking from "@/models/Booking";
import User from "@/models/User";
import { sendPushNotification, sendNotificationEmail } from "@/lib/pushNotification";

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

        // Validate travelerName (letters, spaces, dots — min 2 chars)
        const nameRegex = /^[a-zA-Z\s.]{2,50}$/;
        if (!nameRegex.test(travelerName)) {
            return NextResponse.json({ error: "Invalid traveler name." }, { status: 400 });
        }

        // Validate travelerNumber (strip non-digits, then check 10-15 digits)
        const phoneRegex = /^\d{10,15}$/;
        const cleanTravelerNumber = travelerNumber.replace(/\D/g, "");
        if (!phoneRegex.test(cleanTravelerNumber)) {
            return NextResponse.json({ error: "Invalid traveler number. Must be 10-15 digits." }, { status: 400 });
        }
        const cleanContact = contact.replace(/\D/g, "");
        if (cleanContact.length < 10) {
            return NextResponse.json({ error: "Invalid provider contact number." }, { status: 400 });
        }

        // Check trip existence
        const tripExists = await Trip.findById(trip);
        if (!tripExists) {
            return NextResponse.json({ error: "Trip not found" }, { status: 404 });
        }

        // Validate kilometers against trip's actual distance (round to avoid float drift)
        if (Math.round(parseFloat(kilometers)) !== Math.round(parseFloat(tripExists.kilometer))) {
            return NextResponse.json({
                error: `Kilometer mismatch: booking says ${kilometers} km but trip is ${tripExists.kilometer} km.`
            }, { status: 400 });
        }

        // Check seat availability before updating
        const currentBooked = tripExists.bookedseats || 0;
        if (currentBooked + numberOfSeats > tripExists.seats) {
            return NextResponse.json({ message: "All seats are already booked." }, { status: 400 });
        }

        // Update only bookedseats — avoids full-document validation on save()
        await Trip.findByIdAndUpdate(trip, { $inc: { bookedseats: numberOfSeats } });

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
            bookedBy: userId,
            paymentMethod: body.paymentMethod === "cash" ? "cash" : "online",
        });
        await newBooking.save();

        // Notify the provider (push + email)
        const provider = await User.findById(tripExists.creator).select("pushSubscription email name").lean();
        const notifPayload = {
            title: "New Booking!",
            body: `${travelerName} booked ${numberOfSeats} seat(s) on your trip ${source} → ${destination}.`,
            url: `/providertrips/${tripExists._id}`,
        };
        if (provider?.pushSubscription) {
            sendPushNotification(provider.pushSubscription, notifPayload);
        }
        if (provider?.email) {
            sendNotificationEmail(
                provider.email,
                `New Booking on your trip — Travel Easy Hai`,
                `Hi ${provider.name},<br><br><b>${travelerName}</b> has booked <b>${numberOfSeats} seat(s)</b> on your trip from <b>${source}</b> to <b>${destination}</b> on <b>${date}</b>.<br><br>Total fare: ₹${totalPrice}`
            );
        }

        return NextResponse.json({ success: true, message: "Booking confirmed!", booking: newBooking }, { status: 201 });

    } catch (error) {
        console.error("Booking API Error:", error);
        return NextResponse.json({ error: "Failed to process booking request." }, { status: 500 });
    }
}
