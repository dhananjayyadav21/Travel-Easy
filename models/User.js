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

        // Role: traveler, provider, or admin
        role: {
            type: String,
            enum: ["traveler", "provider", "admin"],
            default: "traveler",
        },

        // Admin: block users
        isBlocked: { type: Boolean, default: false },

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

        // Phone auth
        phone: { type: String, trim: true },
        phoneVerified: { type: Boolean, default: false },
        phoneOtp: { type: String },
        phoneOtpExpiry: { type: Date },

        // Login OTP (email-based, works for email or phone lookup)
        loginOtp: { type: String },
        loginOtpExpiry: { type: Date },

        // Profile
        profilePhoto: { type: String },

        // Rating (computed from reviews)
        avgRating: { type: Number, default: 0 },
        totalRatings: { type: Number, default: 0 },

        // Web Push
        pushSubscription: { type: mongoose.Schema.Types.Mixed },

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
