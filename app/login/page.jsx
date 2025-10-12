"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");

    // ---------------- VALIDATION ----------------
    const validate = () => {
        if (!email) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
        if (!password || password.length < 6) return "Password must be at least 6 characters";
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
        const v = validate();
        if (v) return setError(v);
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Login failed");

            // Save token in localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Dynamic redirect based on role
            if (data.user.role === "traveler") router.push("/traveler-dashboard");
            else if (data.user.role === "provider") router.push("/provider-dashboard");
            else router.push("/");

        } catch (err) {
            setError(err.message || "Login failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-red-50 px-4">

            {pageLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 border-4 border-t-transparent border-gray-900 rounded-full animate-spin" />
                        <div className="text-sm text-gray-700">Loading...</div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {/* Left: form */}
                <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-center mb-2">Welcome back</h2>
                    <p className="text-center text-sm text-gray-500 mb-6">Login to access your bookings and manage trips</p>

                    {error && <div className="bg-red-100 text-red-800 p-2 rounded mb-4 text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="you@company.com"
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
                                    placeholder="Enter your password"
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

                        {/* <div className="flex items-center justify-between">
                            <label className="inline-flex items-center gap-2">
                                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4" />
                                <span className="text-sm">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-sm text-black hover:underline">Forgot password?</Link>
                        </div> */}

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full flex justify-center items-center gap-2 bg-black hover:bg-gray-900 text-white py-2 rounded-lg font-medium disabled:opacity-60"
                        >
                            {loading ? (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                            ) : null}
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account? <Link href="/register" className="text-black font-medium hover:underline">Sign up</Link>
                    </p>
                </div>

                {/* Right: image */}
                <div className="hidden md:block relative">
                    <img src="/images/main.jpg" alt="Travel" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                        <div className="text-white max-w-xs">
                            <h3 className="text-2xl font-bold mb-2">Discover your next trip</h3>
                            <p className="text-sm">Find trusted providers, easy bookings and safe journeys.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
