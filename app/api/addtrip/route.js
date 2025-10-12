import { connectDB } from "@/lib/mongodb";
import Trip from "@/models/Trip";
import { verifyAuth } from "@/utils/verifyAuth";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(req) {
    // Connect to MongoDB
    await connectDB();

    // Verify JWT token
    const authResult = verifyAuth(req);
    if (authResult.response) return authResult.response; // Unauthorized

    const userId = authResult.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        // Only providers can add trips
        if (user.role !== "provider") {
            return NextResponse.json({ message: "Only providers can add trips." }, { status: 403 });
        }

        const body = await req.json();

        // Server-side validation
        const requiredFields = [
            "name",
            "seats",
            "date",
            "time",
            "meetPlace",
            "source",
            "destination",
            "kilometer",
            "contact",
            "vehicle",
            "vehicleType",
            "panCard",
        ];

        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json({ message: `${field} is required.` }, { status: 400 });
            }
        }


        // Validate kilometers (must be positive number)
        if (isNaN(body.kilometer) || body.kilometer <= 0) {
            return NextResponse.json({ message: "Invalid kilometer value." }, { status: 400 });
        }


        // Validate contact number (10-15 digits)
        if (!/^\d{10,15}$/.test(body.contact)) {
            return NextResponse.json({ message: "Invalid contact number." }, { status: 400 });
        }

        // Validate vehicle number (alphanumeric, uppercase)
        if (!/^[A-Z0-9]+$/.test(body.vehicle.replace(/\s+/g, ""))) {
            return NextResponse.json({ message: "Invalid vehicle number." }, { status: 400 });
        }

        // Validate PAN card (5 letters, 4 digits, 1 letter)
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(body.panCard.toUpperCase())) {
            return NextResponse.json({ message: "Invalid PAN card number." }, { status: 400 });
        }

        // Validate vehicleType (must be string, optionally could validate against list)
        if (typeof body.vehicleType !== "string" || body.vehicleType.trim() === "") {
            return NextResponse.json({ message: "Vehicle type is required." }, { status: 400 });
        }

        // Create trip
        const trip = await Trip.create({
            creator: userId,
            name: body.name,
            seats: body.seats,
            date: body.date,
            time: body.time,
            meetPlace: body.meetPlace,
            source: body.source,
            destination: body.destination,
            kilometer: body.kilometer,
            contact: body.contact,
            vehicle: body.vehicle.toUpperCase(),
            vehicleType: body.vehicleType,
            panCard: body.panCard.toUpperCase(),
        });

        return NextResponse.json({ message: "Trip added successfully!", trip }, { status: 201 });

    } catch (err) {
        console.error("Add Trip Error:", err);
        return NextResponse.json({ message: "Server error. Try again." }, { status: 500 });
    }
}
