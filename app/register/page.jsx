"use client";
import { useState } from "react";
import Link from "next/link";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [role, setRole] = useState("traveler"); // 'traveler' or 'provider'
    const [travelName, setTravelName] = useState("");
    const [contact, setContact] = useState("");
    const [vehicle, setVehicle] = useState("");

    const validate = () => {
        if (!name) return "Name is required";
        if (!email) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
        if (!password || password.length < 6) return "Password must be at least 6 characters";
        if (password !== confirm) return "Passwords do not match";
        if (role === 'provider') {
            if (!travelName) return 'Travel name is required for providers';
            if (!contact) return 'Contact is required for providers';
        }
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const v = validate();
        if (v) return setError(v);
        setLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 900));
            console.log({ name, email, role, travelName, contact, vehicle });
            // TODO: call register API and redirect to login or dashboard
        } catch (err) {
            setError("Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-red-50 px-4 py-10 sm:py-6 ">

            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-center mb-2">Create an account</h2>
                    <p className="text-center text-sm text-gray-500 mb-6">Sign up to start booking and managing trips</p>

                    {error && <div className="bg-red-100 text-red-800 p-2 rounded mb-4 text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Role selection */}
                        <div className="flex items-center justify-center gap-6">
                            <label className="inline-flex items-center gap-2">
                                <input type="radio" name="role" value="traveler" checked={role === 'traveler'} onChange={() => setRole('traveler')} />
                                <span className="text-sm">Traveler</span>
                            </label>
                            <label className="inline-flex items-center gap-2">
                                <input type="radio" name="role" value="provider" checked={role === 'provider'} onChange={() => setRole('provider')} />
                                <span className="text-sm">Provider</span>
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative">
                                <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} className="block w-full px-4 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-black/30" />
                                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600">{showPassword ? 'Hide' : 'Show'}</button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm password</label>
                            <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type={showPassword ? "text" : "password"} className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30" />
                        </div>

                        {role === 'provider' && (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Travel / Company name</label>
                                    <input value={travelName} onChange={(e) => setTravelName(e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contact number</label>
                                    <input value={contact} onChange={(e) => setContact(e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Vehicle number</label>
                                    <input value={vehicle} onChange={(e) => setVehicle(e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/30" />
                                </div>
                            </div>
                        )}

                        <button disabled={loading} type="submit" className="w-full flex justify-center items-center gap-2 bg-black hover:bg-gray-900 text-white py-2 rounded-lg font-medium disabled:opacity-60">
                            {loading ? 'Creating...' : 'Create account'}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600">Already have an account? <Link href="/login" className="text-black font-medium hover:underline">Sign in</Link></p>
                </div>

                <div className="hidden md:block relative">
                    <img src="/images/main.jpg" alt="Travel" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                        <div className="text-white max-w-xs">
                            <h3 className="text-2xl font-bold mb-2">Join our travel community</h3>
                            <p className="text-sm">Create your account to book with trusted providers and manage your trips easily.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

