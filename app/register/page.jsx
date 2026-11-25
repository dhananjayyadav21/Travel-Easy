"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Eye, EyeOff, Loader2, X, User, Car, CheckCircle,
    Mail, Lock, IndianRupee, MapPin, Users, Phone, Info, Check, ArrowRight
} from "lucide-react";

export default function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [role, setRole] = useState("traveler");
    const [phone, setPhone] = useState("");
    const [travelName, setTravelName] = useState("");
    const [contact, setContact] = useState("");
    const [vehicle, setVehicle] = useState("");

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

    useEffect(() => {
        const onLoad = () => setPageLoading(false);
        if (typeof window !== "undefined") {
            if (document.readyState === "complete") setPageLoading(false);
            else {
                window.addEventListener("load", onLoad);
                const t = setTimeout(() => setPageLoading(false), 1200);
                return () => { window.removeEventListener("load", onLoad); clearTimeout(t); };
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        const validationError = validate();
        if (validationError) return setError(validationError);
        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role, phone, travelName, contact, vehicle }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed");
            setSuccess("Registration successful! Please verify your email.");
            setTimeout(() => router.push(`/verifyemail?email=${encodeURIComponent(email)}`), 1500);
        } catch (err) {
            setError(err.message || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const getStrength = () => {
        if (!password) return 0;
        if (password.length < 6) return 1;
        if (password.length < 10) return 2;
        return 3;
    };
    const strength = getStrength();
    const strengthLabels = ["", "Weak", "Fair", "Strong"];
    const strengthColors = ["", "bg-red-500", "bg-amber-500", "bg-[#7C3AED]"];

    if (pageLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D1B69]">
                <div className="w-8 h-8 border-2 border-t-transparent border-violet-300 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-56px)] bg-white lg:flex lg:h-[calc(100vh-56px)]">

            {/* ── LEFT PANEL ── */}
            <div className="hidden lg:flex lg:w-1/2 lg:flex-shrink-0 flex-col h-full bg-gradient-to-br from-[#2D1B69] via-[#5B21B6] to-[#7C3AED] p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-800/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex-1 flex flex-col justify-center relative z-10 max-w-xs mt-8">
                    <p className="text-xs font-semibold text-violet-300 uppercase tracking-widest mb-3">Join the community</p>
                    <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
                        Share rides.<br />Save money.<br />
                        <span className="text-yellow-300">Travel smart.</span>
                    </h2>
                    <p className="text-sm text-violet-200/80 leading-relaxed mb-8">
                        Join thousands of Indians who travel smarter every day.
                    </p>

                    <div className="space-y-3">
                        {[
                            "₹8/km — India's cheapest carpooling",
                            "Live GPS tracking on every ride",
                            "50,000+ rides completed across India",
                        ].map((text) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
                                    <Check size={12} className="text-green-300" />
                                </div>
                                <span className="text-sm text-violet-100/90">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto relative z-10">
                    <div className="absolute bottom-0 left-0 right-0 h-6 opacity-20">
                        <svg viewBox="0 0 400 24" fill="none" className="w-full h-full">
                            <rect y="12" width="400" height="12" fill="white" />
                            <line x1="0" y1="18" x2="400" y2="18" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="30 15" />
                        </svg>
                    </div>
                    <img src="/images/car.png" alt="Car" className="relative w-full max-w-[260px] object-contain drop-shadow-2xl mx-auto" />
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="bg-white flex-1 flex flex-col justify-center px-6 sm:px-10 py-10 overflow-y-auto">
                <div className="w-full max-w-md mx-auto">

                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center shadow-md shadow-violet-200">
                            <Car size={16} className="text-white" />
                        </div>
                        <span className="text-sm font-bold text-gray-900">TravelEasy<span className="text-[#7C3AED]">Hai</span></span>
                    </div>

                    <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create account</h1>
                    <p className="text-sm text-gray-500 mb-6">
                        Already have one?{" "}
                        <Link href="/login" className="text-[#7C3AED] hover:underline font-semibold">Sign in</Link>
                    </p>

                    {/* Role selector */}
                    <div className="flex gap-3 mb-5">
                        {[
                            { value: "traveler", icon: Users, label: "Traveler", desc: "Book seats" },
                            { value: "provider", icon: Car, label: "Provider", desc: "Offer rides" },
                        ].map(({ value, icon: Icon, label, desc }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setRole(value)}
                                className={`flex-1 rounded-xl border-2 p-3 transition-all text-center cursor-pointer ${
                                    role === value
                                        ? "border-[#7C3AED] bg-violet-50 shadow-md shadow-violet-100"
                                        : "border-gray-200 bg-white hover:border-violet-300"
                                }`}
                            >
                                <div className={`w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center ${role === value ? "bg-[#7C3AED]" : "bg-gray-100"}`}>
                                    <Icon size={18} className={role === value ? "text-white" : "text-gray-500"} />
                                </div>
                                <p className="text-sm font-bold text-gray-900">{label}</p>
                                <p className="text-xs text-gray-500">{desc}</p>
                            </button>
                        ))}
                    </div>

                    {role === "provider" && (
                        <div className="flex items-start gap-2 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2.5 mb-4">
                            <Info size={13} className="text-violet-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-violet-700">Vehicle details are added when you post your first trip.</p>
                        </div>
                    )}

                    {/* Error / Success */}
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl px-3 py-2.5 mb-4 text-xs">
                            <X size={12} className="flex-shrink-0" /><span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 rounded-xl px-3 py-2.5 mb-4 text-xs">
                            <CheckCircle size={12} className="flex-shrink-0" /><span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3">

                        {/* Name + Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
                                <div className="flex items-center h-11 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-violet-100 focus-within:bg-white transition-all">
                                    <div className="pl-3 pr-2"><User size={14} className="text-[#7C3AED]" /></div>
                                    <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Your name" className="flex-1 h-full pr-3 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
                                <div className="flex items-center h-11 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-violet-100 focus-within:bg-white transition-all">
                                    <div className="pl-3 pr-2"><Mail size={14} className="text-[#7C3AED]" /></div>
                                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="flex-1 h-full pr-3 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                Phone <span className="normal-case font-normal text-gray-400">(optional)</span>
                            </label>
                            <div className="flex items-center h-11 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-violet-100 focus-within:bg-white transition-all overflow-hidden">
                                <div className="flex items-center gap-1.5 px-3 h-full bg-violet-50 border-r border-violet-100 flex-shrink-0">
                                    <Phone size={12} className="text-[#7C3AED]" />
                                    <span className="text-xs text-[#7C3AED] font-semibold">+91</span>
                                </div>
                                <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/, "").slice(0, 10))} type="tel" placeholder="10-digit number" className="flex-1 h-full px-3 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none" />
                            </div>
                        </div>

                        {/* Password + Confirm */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
                                <div className="flex items-center h-11 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-violet-100 focus-within:bg-white transition-all">
                                    <div className="pl-3 pr-2"><Lock size={14} className="text-[#7C3AED]" /></div>
                                    <input value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="Min. 6 chars" className="flex-1 h-full bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none" />
                                    <button type="button" onClick={() => setShowPassword(s => !s)} className="pr-3 pl-1 text-gray-400 hover:text-[#7C3AED]" tabIndex={-1}>
                                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                                {password && (
                                    <div className="mt-1.5 flex items-center gap-2">
                                        <div className="flex gap-1 flex-1">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className={`h-0.5 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : "bg-gray-200"}`} />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-400">{strengthLabels[strength]}</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Confirm</label>
                                <div className="flex items-center h-11 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-violet-100 focus-within:bg-white transition-all">
                                    <div className="pl-3 pr-2"><Lock size={14} className="text-[#7C3AED]" /></div>
                                    <input value={confirm} onChange={e => setConfirm(e.target.value)} type={showConfirm ? "text" : "password"} placeholder="Repeat password" className="flex-1 h-full bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none" />
                                    <button type="button" onClick={() => setShowConfirm(s => !s)} className="pr-3 pl-1 text-gray-400 hover:text-[#7C3AED]" tabIndex={-1}>
                                        {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Provider extra fields */}
                        {role === "provider" && (
                            <div className="border border-violet-100 rounded-xl p-4 space-y-3 bg-violet-50/50">
                                <p className="text-xs font-semibold text-violet-700 uppercase tracking-wide flex items-center gap-1.5">
                                    <Car size={12} className="text-[#7C3AED]" /> Provider Details
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Travel / Company Name</label>
                                        <input value={travelName} onChange={e => setTravelName(e.target.value)} placeholder="e.g. Sharma Travels" className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-violet-100 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Contact Number</label>
                                        <input value={contact} onChange={e => setContact(e.target.value)} placeholder="10-digit number" className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-violet-100 transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Vehicle Number</label>
                                    <input value={vehicle} onChange={e => setVehicle(e.target.value.toUpperCase())} placeholder="e.g. MH12AB1234" className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-violet-100 transition-all" />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 flex justify-center items-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl text-sm font-bold shadow-md shadow-violet-200 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                        >
                            {loading ? (
                                <><Loader2 size={15} className="animate-spin" /> Creating account...</>
                            ) : (
                                <><span>Create Account</span><ArrowRight size={15} /></>
                            )}
                        </button>
                    </form>

                    {/* Divider + Google */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-gray-200"/>
                        <span className="text-xs text-gray-400 whitespace-nowrap">or sign up with</span>
                        <div className="flex-1 h-px bg-gray-200"/>
                    </div>

                    <a
                        href="/login"
                        className="w-full h-12 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-2xl flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 transition shadow-sm hover:shadow-md"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                    </a>

                    <p className="mt-5 text-center text-xs text-gray-400">
                        By registering, you agree to our{" "}
                        <span className="text-[#7C3AED] cursor-pointer hover:underline">Terms</span> &amp;{" "}
                        <span className="text-[#7C3AED] cursor-pointer hover:underline">Privacy Policy</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
