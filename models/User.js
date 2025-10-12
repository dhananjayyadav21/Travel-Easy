import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },

        // Role: traveler or provider
        role: {
            type: String,
            enum: ["traveler", "provider"],
            default: "traveler",
        },

        // Only for providers
        travelName: {
            type: String,
            required: function () {
                return this.role === "provider";
            },
            trim: true,
        },
        contact: {
            type: String,
            required: function () {
                return this.role === "provider";
            },
            trim: true,
        },
        vehicle: {
            type: String,
            required: function () {
                return this.role === "provider";
            },
            trim: true,
        },

        // Common optional fields
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationCode: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
