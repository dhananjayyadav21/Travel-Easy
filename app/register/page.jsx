"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Eye, EyeOff, Loader2, X, User, Car, CheckCircle,
    Mail, Lock, Phone, Info, Check, ArrowRight, Users
} from "lucide-react";

export default function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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
        if (!name.trim()) return "Name is required";
        if (!email.trim()) return "Email is required";
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
            setSuccess("Account created! Please verify your email.");
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
    const strengthColors = ["", "bg-red-400", "bg-amber-400", "bg-green-400"];

    /* ── shared input class for glass inputs ── */
    const glassInput = "flex-1 h-full px-4 text-base text-white placeholder-white/40 bg-transparent focus:outline-none";
    const glassWrap  = "flex items-center h-13 bg-white/15 border border-white/25 rounded-xl overflow-hidden focus-within:border-white focus-within:bg-white/20 transition-all";

    return (
        <div
            className="min-h-screen md:min-h-[calc(100vh-56px)] flex flex-col items-center justify-start relative overflow-hidden px-4 py-8"
            style={{ background: "linear-gradient(170deg, #1E0A44 0%, #4C1D95 35%, #7C3AED 70%, #8B5CF6 100%)" }}
        >
            {/* Background blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-400/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-800/20 rounded-full blur-3xl pointer-events-none" />
            {[[5,8],[92,12],[15,45],[88,38],[10,72],[90,70]].map(([l,t],i) => (
                <div key={i} className="absolute w-1.5 h-1.5 bg-white/20 rounded-full pointer-events-none" style={{left:`${l}%`,top:`${t}%`}} />
            ))}

            {/* Header */}
            <div className="relative z-10 w-full flex items-center justify-between max-w-sm md:max-w-md lg:max-w-lg mb-6">
                <button
                    onClick={() => router.push("/")}
                    className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center hover:bg-white/25 transition"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
                    </svg>
                </button>
                <span className="text-xs font-bold text-white/70 uppercase tracking-[3px]">Create Account</span>
                <div className="w-9" />
            </div>

            {/* Form card */}
            <div className="relative z-10 w-full max-w-sm md:max-w-md lg:max-w-lg">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">

                    <h1 className="text-2xl font-extrabold text-white mb-1">Join TravelEasyHai</h1>
                    <p className="text-violet-200 text-sm mb-5">
                        Already have an account?{" "}
                        <Link href="/login" className="text-white font-bold hover:underline">Sign in →</Link>
                    </p>

                    {/* Role selector */}
                    <div className="flex gap-3 mb-4">
                        {[
                            { value: "traveler", icon: Users, label: "Traveler", desc: "Book seats" },
                            { value: "provider", icon: Car,   label: "Driver", desc: "Offer rides" },
                        ].map(({ value, icon: Icon, label, desc }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setRole(value)}
                                className={`flex-1 rounded-xl border-2 p-3 transition-all text-center ${
                                    role === value
                                        ? "border-white bg-white/20 shadow-lg"
                                        : "border-white/20 bg-white/10 hover:border-white/40"
                                }`}
                            >
                                <div className={`w-9 h-9 rounded-xl mx-auto mb-1.5 flex items-center justify-center ${role === value ? "bg-white" : "bg-white/15"}`}>
                                    <Icon size={18} className={role === value ? "text-[#7C3AED]" : "text-white/70"} />
                                </div>
                                <p className="text-sm font-bold text-white">{label}</p>
                                <p className="text-xs text-white/60">{desc}</p>
                            </button>
                        ))}
                    </div>

                    {role === "provider" && (
                        <div className="flex items-start gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 mb-4">
                            <Info size={13} className="text-violet-200 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-violet-200">Vehicle details are added when you post your first trip.</p>
                        </div>
                    )}

                    {/* Error / Success */}
                    {error && (
                        <div className="flex items-center gap-2 bg-red-900/30 border border-red-400/30 text-red-300 rounded-xl px-3 py-2.5 mb-4 text-xs">
                            <X size={12} className="flex-shrink-0"/><span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center gap-2 bg-green-900/30 border border-green-400/30 text-green-300 rounded-xl px-3 py-2.5 mb-4 text-xs">
                            <CheckCircle size={12} className="flex-shrink-0"/><span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3">

                        {/* Name */}
                        <div className={glassWrap} style={{height:'52px'}}>
                            <div className="pl-4 pr-3 border-r border-white/25 h-full flex items-center flex-shrink-0">
                                <User size={16} className="text-white/60"/>
                            </div>
                            <input value={name} onChange={e => setName(e.target.value)} type="text"
                                placeholder="Full name" className={glassInput} style={{height:'52px'}} />
                        </div>

                        {/* Email */}
                        <div className={glassWrap} style={{height:'52px'}}>
                            <div className="pl-4 pr-3 border-r border-white/25 h-full flex items-center flex-shrink-0">
                                <Mail size={16} className="text-white/60"/>
                            </div>
                            <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                                placeholder="Email address" autoComplete="email" className={glassInput} style={{height:'52px'}} />
                        </div>

                        {/* Phone */}
                        <div className={glassWrap} style={{height:'52px'}}>
                            <div className="flex items-center gap-1.5 pl-4 pr-3 border-r border-white/25 h-full flex-shrink-0">
                                <span className="text-base leading-none">🇮🇳</span>
                                <span className="text-sm font-bold text-white">+91</span>
                            </div>
                            <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/,"").slice(0,10))}
                                type="tel" placeholder="Phone (optional)" className={glassInput} style={{height:'52px'}} />
                        </div>

                        {/* Password */}
                        <div className={glassWrap} style={{height:'52px'}}>
                            <div className="pl-4 pr-3 border-r border-white/25 h-full flex items-center flex-shrink-0">
                                <Lock size={16} className="text-white/60"/>
                            </div>
                            <input value={password} onChange={e => setPassword(e.target.value)}
                                type={showPassword ? "text" : "password"} placeholder="Password (min. 6 chars)"
                                className={glassInput} style={{height:'52px'}} />
                            <button type="button" onClick={() => setShowPassword(s => !s)}
                                className="pr-4 text-white/50 hover:text-white transition" tabIndex={-1}>
                                {showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}
                            </button>
                        </div>
                        {password && (
                            <div className="flex items-center gap-2 -mt-1">
                                <div className="flex gap-1 flex-1">
                                    {[1,2,3].map(i => (
                                        <div key={i} className={`h-0.5 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : "bg-white/20"}`} />
                                    ))}
                                </div>
                                <span className="text-xs text-white/50">{strengthLabels[strength]}</span>
                            </div>
                        )}

                        {/* Confirm password */}
                        <div className={glassWrap} style={{height:'52px'}}>
                            <div className="pl-4 pr-3 border-r border-white/25 h-full flex items-center flex-shrink-0">
                                <Lock size={16} className="text-white/60"/>
                            </div>
                            <input value={confirm} onChange={e => setConfirm(e.target.value)}
                                type={showConfirm ? "text" : "password"} placeholder="Repeat password"
                                className={glassInput} style={{height:'52px'}} />
                            <button type="button" onClick={() => setShowConfirm(s => !s)}
                                className="pr-4 text-white/50 hover:text-white transition" tabIndex={-1}>
                                {showConfirm ? <EyeOff size={17}/> : <Eye size={17}/>}
                            </button>
                        </div>

                        {/* Provider extra fields */}
                        {role === "provider" && (
                            <div className="border border-white/20 rounded-xl p-4 space-y-3 bg-white/5">
                                <p className="text-xs font-bold text-white/80 uppercase tracking-wide flex items-center gap-1.5">
                                    <Car size={12}/> Driver Details
                                </p>
                                <div className={glassWrap} style={{height:'48px'}}>
                                    <input value={travelName} onChange={e => setTravelName(e.target.value)}
                                        placeholder="Travel / Company Name" className={glassInput} style={{height:'48px', paddingLeft:'16px'}} />
                                </div>
                                <div className={glassWrap} style={{height:'48px'}}>
                                    <input value={contact} onChange={e => setContact(e.target.value)}
                                        placeholder="Contact Number" className={glassInput} style={{height:'48px', paddingLeft:'16px'}} />
                                </div>
                                <div className={glassWrap} style={{height:'48px'}}>
                                    <input value={vehicle} onChange={e => setVehicle(e.target.value.toUpperCase())}
                                        placeholder="Vehicle Number (e.g. MH12AB1234)" className={glassInput} style={{height:'48px', paddingLeft:'16px'}} />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-white hover:bg-gray-50 disabled:opacity-50 text-[#7C3AED] font-extrabold rounded-xl text-base transition-all shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <><Loader2 size={18} className="animate-spin text-[#7C3AED]"/> Creating account...</>
                            ) : (
                                <>Create Account <ArrowRight size={16}/></>
                            )}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-xs text-white/40">
                        By registering, you agree to our{" "}
                        <span className="text-white/70 cursor-pointer hover:underline">Terms</span> &amp;{" "}
                        <span className="text-white/70 cursor-pointer hover:underline">Privacy Policy</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
