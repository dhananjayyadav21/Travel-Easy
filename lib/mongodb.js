import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
    if (isConnected) return;

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "travel-easy",
        });
        isConnected = true;
        if (process.env.NODE_ENV !== "production") {
            console.log("MongoDB connected:", conn.connection.name);
        }
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw new Error("MongoDB connection error");
    }
}
