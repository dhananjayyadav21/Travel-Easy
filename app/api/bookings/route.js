import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { verifyAuth } from "@/utils/verifyAuth";
import User from "@/models/User";
import { Contact } from 'lucide-react';

export async function GET(req) {

    // Verify JWT token
    const authResult = verifyAuth(req);
    if (authResult.response) return authResult.response;

    const userId = authResult.userId;

    try {
        // Step 1: Connect to MongoDB
        await connectDB();

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        //  Step 2: Retrieve all bookings, sorted by newest first
        const bookings = await Booking.find({}).sort({ createdAt: -1 });

        //  Step 3: Format bookings for frontend readability
        const formattedBookings = bookings.map((booking) => ({
            id: booking._id.toString(),
            source: booking.source,
            destination: booking.destination,
            date: booking.date,
            price: booking.totalPrice,
            status: booking.status,
            contact: booking.contact,
        }));

        //  Step 4: Return success response
        return NextResponse.json({
            success: true,
            message: 'Bookings fetched successfully.',
            total: formattedBookings.length,
            data: formattedBookings,
        });
    } catch (error) {
        console.error(' Error while fetching bookings:', error);

        // Step 5: Handle any database or server error
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch bookings due to a server error.',
                error: error.message,
            },
            { status: 500 }
        );
    }
}
