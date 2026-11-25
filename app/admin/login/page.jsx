"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) return setError("Email and password are required");
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Invalid credentials");
            if (data.user?.role !== "admin") throw new Error("Access denied. Admin only.");

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.dispatchEvent(new Event("authChanged"));
            router.push("/admin");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-56px)] bg-slate-900 flex items-center justify-center px-4">

            {/* Background grid pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)`
            }}/>

            {/* Glow blobs */}
            <div className="absolute top-20 left-1/4 w-72 h-72 bg-violet-700/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-1/4 w-56 h-56 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-sm">

                {/* Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl">

                    {/* Shield icon + branding */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-900/50">
                            <Shield size={28} className="text-white" />
                        </div>
                        <span className="text-[10px] font-bold text-violet-400 uppercase tracking-[3px] mb-1">Admin Panel</span>
                        <h1 className="text-2xl font-extrabold text-white">Restricted Access</h1>
                        <p className="text-slate-400 text-sm mt-1">Authorised personnel only</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Email */}
                        <div className="flex items-center h-12 bg-slate-700/60 border border-slate-600 rounded-xl focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500/30 transition-all">
                            <Mail size={16} className="text-slate-400 ml-4 mr-3 flex-shrink-0" />
                            <input
                                value={email}
                                onChange={e => { setEmail(e.target.value); setError(""); }}
                                type="email"
                                placeholder="Admin email"
                                autoComplete="email"
                                className="flex-1 h-full pr-4 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex items-center h-12 bg-slate-700/60 border border-slate-600 rounded-xl focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500/30 transition-all">
                            <Lock size={16} className="text-slate-400 ml-4 mr-3 flex-shrink-0" />
                            <input
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError(""); }}
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                autoComplete="current-password"
                                className="flex-1 h-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(s => !s)}
                                className="pr-4 text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 text-red-400 rounded-xl px-3 py-2.5 text-xs">
                                <AlertCircle size={13} className="flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-violet-900/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2"
                        >
                            {loading
                                ? <><Loader2 size={16} className="animate-spin" /> Verifying...</>
                                : <><Shield size={15} /> Access Admin Panel</>
                            }
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-xs text-slate-500">
                            Not an admin?{" "}
                            <a href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                                Go to main login
                            </a>
                        </p>
                    </div>
                </div>

                {/* Bottom label */}
                <p className="text-center text-xs text-slate-600 mt-4">
                    TravelEasyHai · Admin Console · v1.0
                </p>
            </div>
        </div>
    );
}
