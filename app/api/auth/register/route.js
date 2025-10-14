import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendVerificationEmail } from '@/lib/mailer';

export async function POST(req) {
    try {
        const {
            name,
            email,
            password,
            role,
            travelName,
            contact,
            vehicle,
        } = await req.json();

        // field validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        //  Role-based validation
        if (role === "provider" && (!travelName || !contact || !vehicle)) {
            return NextResponse.json(
                { error: "Provider must include travelName, contact, and vehicle" },
                { status: 400 }
            );
        }

        // Connect to DB
        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Hash password with salt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //  Generate a 6-digit numeric email verification code
        const verificationCode = String(crypto.randomInt(0, 1000000)).padStart(6, '0');

        //  Create user 
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'traveler',
            travelName: role === 'provider' ? travelName : undefined,
            contact: role === 'provider' ? contact : undefined,
            vehicle: role === 'provider' ? vehicle : undefined,
            verificationCode,
            isVerified: false,
        });

        await newUser.save();

        // send verification email
        let result = null;
        try {
            result = await sendVerificationEmail(newUser.email, verificationCode, name);
        } catch (e) {
            console.warn('Mailer invocation failed', e);
            throw e;
        }

        // Return success response
        return NextResponse.json(
            {
                message: "User registered successfully. Please verify your email.",
                userId: newUser._id,
                verificationCode,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(" Register API error:", error);
        return NextResponse.json(
            { error: error },
            { status: 500 }
        );
    }
}
