import { connectDB } from "@/lib/mongodb";
import Trip from "@/models/Trip";
import { verifyAuth } from "@/utils/verifyAuth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    await connectDB();
    const authResult = verifyAuth(req);
    if (authResult.response) return authResult.response;

    try {
        const { tripId } = await params;
        const trip = await Trip.findById(tripId).lean();
        if (!trip) return NextResponse.json({ message: "Trip not found" }, { status: 404 });

        return NextResponse.json({ success: true, trip });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
