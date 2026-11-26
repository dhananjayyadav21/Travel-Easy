import { connectDB } from "@/lib/mongodb";
import Trip from "@/models/Trip";
import { verifyAuth } from "@/utils/verifyAuth";
import { NextResponse } from "next/server";
import Pusher from "pusher";

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
});

export async function PUT(req) {
    const authResult = verifyAuth(req);
    if (authResult.response) return authResult.response;
    await connectDB();

    try {
        const { tripId, lat, lng } = await req.json();
        if (!tripId || !lat || !lng) {
            return NextResponse.json({ message: "tripId, lat, lng required" }, { status: 400 });
        }

        await Trip.findByIdAndUpdate(tripId, {
            liveLocation: { lat, lng, updatedAt: new Date() },
        });

        // Broadcast to Pusher channel
        await pusher.trigger(`trip-${tripId}`, "location-update", { lat, lng });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Live location error:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
