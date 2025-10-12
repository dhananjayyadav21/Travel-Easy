// lib/mongodb.js
import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
    if (isConnected) {
        console.log("✅ MongoDB already connected");
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "travel-easy",
        });
        isConnected = true;
        console.log("✅ MongoDB connected successfully to:", conn.connection.name);
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        throw new Error("MongoDB connection error");
    }
}
