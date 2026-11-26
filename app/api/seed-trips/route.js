import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Trip from "@/models/Trip";
import Booking from "@/models/Booking";
import { verifyAuth } from "@/utils/verifyAuth";

const COMMON = { panCard: "ABCDE1234F", meetPlace: "Main Gate", contact: "9876543210" };

const SAMPLE_TRIPS = [
    {
        name: "Delhi → Agra Express",
        source: "New Delhi, Delhi, India",
        destination: "Agra, Uttar Pradesh, India",
        date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
        time: "08:00", seats: 4, bookedseats: 2,
        kilometer: 235, vehicle: "DL01AB1234", vehicleType: "Car", status: "Active",
        sourceCoords: { lat: 28.6139, lng: 77.2090 },
        destinationCoords: { lat: 27.1767, lng: 78.0081 },
        ...COMMON,
    },
    {
        name: "Mumbai → Pune Ride",
        source: "Mumbai, Maharashtra, India",
        destination: "Pune, Maharashtra, India",
        date: new Date(Date.now() + 1 * 86400000).toISOString().split("T")[0],
        time: "07:30", seats: 3, bookedseats: 1,
        kilometer: 148, vehicle: "MH01CD5678", vehicleType: "SUV", status: "Active",
        sourceCoords: { lat: 19.0760, lng: 72.8777 },
        destinationCoords: { lat: 18.5204, lng: 73.8567 },
        ...COMMON,
    },
    {
        name: "Bangalore → Mysore",
        source: "Bengaluru, Karnataka, India",
        destination: "Mysuru, Karnataka, India",
        date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
        time: "09:00", seats: 4, bookedseats: 4,
        kilometer: 143, vehicle: "KA01EF9012", vehicleType: "Car", status: "Completed",
        sourceCoords: { lat: 12.9716, lng: 77.5946 },
        destinationCoords: { lat: 12.2958, lng: 76.6394 },
        ...COMMON,
    },
    {
        name: "Jaipur → Delhi",
        source: "Jaipur, Rajasthan, India",
        destination: "New Delhi, Delhi, India",
        date: new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0],
        time: "06:00", seats: 4, bookedseats: 2,
        kilometer: 280, vehicle: "RJ14GH3456", vehicleType: "Car", status: "Cancelled",
        sourceCoords: { lat: 26.9124, lng: 75.7873 },
        destinationCoords: { lat: 28.6139, lng: 77.2090 },
        ...COMMON,
    },
];

export async function POST(req) {
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const authResult = verifyAuth(req);
    if (authResult.response) return authResult.response;
    const userId = authResult.userId;

    try {
        await connectDB();

        // Delete existing seed data first so re-seeding always works
        const existingTrips = await Trip.find({ creator: userId }).select("_id");
        if (existingTrips.length > 0) {
            const tripIds = existingTrips.map(t => t._id);
            await Booking.deleteMany({ trip: { $in: tripIds } });
            await Trip.deleteMany({ creator: userId });
        }

        const trips = await Trip.insertMany(
            SAMPLE_TRIPS.map(t => ({ ...t, creator: userId }))
        );

        // Create sample bookings for the first two active trips
        const sampleBookings = [
            {
                trip: trips[0]._id,
                source: trips[0].source,
                destination: trips[0].destination,
                contact: "9876543210",
                travelerName: "Rahul Sharma",
                travelerNumber: "9811234567",
                seatsBooked: ["A1", "A2"],
                numberOfSeats: 2,
                kilometers: trips[0].kilometer,
                ratePerKm: 8,
                totalPrice: trips[0].kilometer * 8 * 2,
                date: trips[0].date,
                status: "Active",
                bookedBy: userId,
            },
            {
                trip: trips[1]._id,
                source: trips[1].source,
                destination: trips[1].destination,
                contact: "9876543210",
                travelerName: "Priya Patel",
                travelerNumber: "9822345678",
                seatsBooked: ["B1"],
                numberOfSeats: 1,
                kilometers: trips[1].kilometer,
                ratePerKm: 8,
                totalPrice: trips[1].kilometer * 8 * 1,
                date: trips[1].date,
                status: "Active",
                bookedBy: userId,
            },
            {
                trip: trips[2]._id,
                source: trips[2].source,
                destination: trips[2].destination,
                contact: "9876543210",
                travelerName: "Amit Kumar",
                travelerNumber: "9833456789",
                seatsBooked: ["C1", "C2", "C3"],
                numberOfSeats: 3,
                kilometers: trips[2].kilometer,
                ratePerKm: 8,
                totalPrice: trips[2].kilometer * 8 * 3,
                date: trips[2].date,
                status: "Completed",
                bookedBy: userId,
            },
        ];

        // Pending requests (waiting for provider to accept)
        const pendingBookings = [
            {
                trip: trips[0]._id,
                source: trips[0].source,
                destination: trips[0].destination,
                contact: "9876543210",
                travelerName: "Sneha Gupta",
                travelerNumber: "9844567890",
                seatsBooked: ["A3"],
                numberOfSeats: 1,
                kilometers: trips[0].kilometer,
                ratePerKm: 8,
                totalPrice: trips[0].kilometer * 8 * 1,
                date: trips[0].date,
                status: "Pending",
                bookedBy: userId,
            },
            {
                trip: trips[1]._id,
                source: trips[1].source,
                destination: trips[1].destination,
                contact: "9876543210",
                travelerName: "Vikram Singh",
                travelerNumber: "9855678901",
                seatsBooked: ["B2", "B3"],
                numberOfSeats: 2,
                kilometers: trips[1].kilometer,
                ratePerKm: 8,
                totalPrice: trips[1].kilometer * 8 * 2,
                date: trips[1].date,
                status: "Pending",
                bookedBy: userId,
            },
        ];

        await Booking.insertMany([...sampleBookings, ...pendingBookings]);

        return NextResponse.json({
            success: true,
            message: `Created ${trips.length} sample trips + ${sampleBookings.length + pendingBookings.length} bookings (${pendingBookings.length} pending requests)!`,
            count: trips.length,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
