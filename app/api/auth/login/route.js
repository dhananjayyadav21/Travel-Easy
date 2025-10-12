import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        // check validate data
        if (!email || !password) return new Response(JSON.stringify({ message: "Email and password required" }), { status: 400 });

        // check user from db 
        const user = await User.findOne({ email });
        if (!user) return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });

        // check isVerified
        if (!user.isVerified) return new Response(JSON.stringify({ message: "Email not verified" }), { status: 403 });

        // check password
        const match = await bcrypt.compare(password, user.password);
        if (!match) return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return new Response(JSON.stringify({ message: "Login successful", token, user: { id: user._id, name: user.name, role: user.role, email: user.email } }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
