"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [role, setRole] = useState("traveler");
    const [travelName, setTravelName] = useState("");
    const [contact, setContact] = useState("");
    const [vehicle, setVehicle] = useState("");

    // ---------------- VALIDATION ----------------
    const validate = () => {
        if (!name) return "Name is required";
        if (!email) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
        if (!password || password.length < 6) return "Password must be at least 6 characters";
        if (password !== confirm) return "Passwords do not match";
        if (role === "provider") {
            if (!travelName) return "Travel name is required for providers";
            if (!contact) return "Contact number is required for providers";
            if (!vehicle) return "Vehicle number is required for providers";
        }
        return "";
    };

    // page loader (hide after window load or fallback)
    useEffect(() => {
        const onLoad = () => setPageLoading(false);
        if (typeof window !== 'undefined') {
            if (document.readyState === 'complete') setPageLoading(false);
            else {
                window.addEventListener('load', onLoad);
                const t = setTimeout(() => setPageLoading(false), 1200);
                return () => { window.removeEventListener('load', onLoad); clearTimeout(t); };
            }
        }
    }, []);

    // ---------------- SUBMIT HANDLER ----------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const validationError = validate();
        if (validationError) return setError(validationError);

        setLoading(true);

        try {
            // Send form data to API route
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role,
                    travelName,
                    contact,
                    vehicle,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }

            // Success
            setSuccess("Registration successful! Please verify your email.");
            setTimeout(() => router.push(`/verifyemail?email=${encodeURIComponent(email)}`), 1500);
        } catch (err) {
            setError(err.message || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-r from-green-50 to-red-50 px-4 py-2">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

                {pageLoading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 border-4 border-t-transparent border-gray-900 rounded-full animate-spin" />
                            <div className="text-sm text-gray-700">Loading...</div>
                        </div>
                    </div>
                )}

                <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-center mb-2">Create an account</h2>
                    <p className="text-center text-sm text-gray-500 mb-6">
                        Sign up to start booking and managing trips
                    </p>

                    {/* Error Message */}
                    {error && <div className="bg-red-100 text-red-800 p-2 rounded mb-4 text-sm">{error}</div>}

                    {/* Success Message */}
                    {success && <div className="bg-green-100 text-green-800 p-2 rounded mb-4 text-sm">{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Role Selection */}
                        <div className="flex items-center justify-center gap-6">
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="role"
                                    value="traveler"
                                    checked={role === "traveler"}
                                    onChange={() => setRole("traveler")}
                                />
                                <span className="text-sm">Traveler</span>
                            </label>
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="role"
                                    value="provider"
                                    checked={role === "provider"}
                                    onChange={() => setRole("provider")}
                                />
                                <span className="text-sm">Provider</span>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative">
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPassword ? "text" : "password"}
                                    className="block w-full px-4 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-black/30"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm password</label>
                            <input
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                type={showPassword ? "text" : "password"}
                                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30"
                            />
                        </div>

                        {/* Provider Extra Fields */}
                        {role === "provider" && (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Travel / Company name
                                    </label>
                                    <input
                                        value={travelName}
                                        onChange={(e) => setTravelName(e.target.value)}
                                        className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Contact number
                                    </label>
                                    <input
                                        value={contact}
                                        onChange={(e) => setContact(e.target.value)}
                                        className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Vehicle number
                                    </label>
                                    <input
                                        value={vehicle}
                                        onChange={(e) => setVehicle(e.target.value)}
                                        className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full flex justify-center items-center gap-2 bg-black hover:bg-gray-900 text-white py-2 rounded-lg font-medium disabled:opacity-60"
                        >
                            {loading ? "Creating..." : "Create account"}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="text-black font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Right Side Image Section */}
                <div className="hidden md:block relative">
                    <img src="/main.jpg" alt="Travel" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                        <div className="text-white max-w-xs">
                            <h3 className="text-2xl font-bold mb-2">Join our travel community</h3>
                            <p className="text-sm">
                                Create your account to book with trusted providers and manage your trips easily.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
