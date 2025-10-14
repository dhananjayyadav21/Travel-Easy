import { connectDB } from "@/lib/mongodb";
import Trip from "@/models/Trip";
import { verifyAuth } from "@/utils/verifyAuth";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        // Connect to MongoDB
        await connectDB();

        // Verify JWT Authentication
        const authResult = verifyAuth(req);
        if (authResult.response) return authResult.response;

        const userId = authResult.userId;

        // Extract query parameter (status)
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        // Build MongoDB query
        const query = {};
        if (status && ["Pending", "Active", "Completed", "Cancelled"].includes(status)) {
            query.status = status;
        }

        // Fetch trips (sort by most recent date)
        const trips = await Trip.find(query).sort({ createdAt: -1 });

        // Handle empty case
        if (trips.length === 0) {
            return NextResponse.json(
                { message: "No trips found for this status.", trips: [] },
                { status: 200 }
            );
        }

        // Return trips
        return NextResponse.json({ trips }, { status: 200 });
    } catch (err) {
        console.error(" Fetch Trips Error:", err);
        return NextResponse.json({ message: "Server error." }, { status: 500 });
    }
}
