import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyAuth } from "@/utils/verifyAuth";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
    await connectDB();
    const authResult = verifyAuth(req);
    if (authResult.response) return authResult.response;

    try {
        const formData = await req.formData();
        const file = formData.get("photo");

        if (!file) {
            return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(base64, {
            folder: "travel-easy/profiles",
            transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
        });

        // Save to user document
        await User.findByIdAndUpdate(authResult.userId, { profilePhoto: result.secure_url });

        return NextResponse.json({ success: true, url: result.secure_url });
    } catch (err) {
        console.error("Photo upload error:", err);
        return NextResponse.json({ message: "Upload failed" }, { status: 500 });
    }
}
