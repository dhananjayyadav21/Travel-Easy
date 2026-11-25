"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X, Eye, EyeOff } from "lucide-react";

function CarIllustration() {
    return (
        <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs drop-shadow-2xl mx-auto">
            <ellipse cx="160" cy="188" rx="100" ry="8" fill="black" fillOpacity="0.18"/>
            <rect x="30" y="100" width="260" height="72" rx="14" fill="white" fillOpacity="0.95"/>
            <path d="M75 100 L90 54 Q102 38 118 36 L202 36 Q218 38 230 54 L245 100Z" fill="white"/>
            <rect x="90" y="48" width="52" height="38" rx="7" fill="#C4B5FD" fillOpacity="0.55"/>
            <rect x="150" y="48" width="52" height="38" rx="7" fill="#C4B5FD" fillOpacity="0.55"/>
            <line x1="142" y1="48" x2="142" y2="86" stroke="white" strokeWidth="3" strokeOpacity="0.5"/>
            <rect x="275" y="112" width="14" height="10" rx="3" fill="#FDE68A" fillOpacity="0.9"/>
            <rect x="31" y="112" width="10" height="10" rx="3" fill="#FCA5A5" fillOpacity="0.8"/>
            <ellipse cx="98" cy="172" rx="28" ry="10" fill="#5B21B6" fillOpacity="0.3"/>
            <ellipse cx="222" cy="172" rx="28" ry="10" fill="#5B21B6" fillOpacity="0.3"/>
            <circle cx="98" cy="166" r="22" fill="#4C1D95"/>
            <circle cx="98" cy="166" r="13" fill="white" fillOpacity="0.15"/>
            <circle cx="98" cy="166" r="6" fill="white" fillOpacity="0.5"/>
            <circle cx="222" cy="166" r="22" fill="#4C1D95"/>
            <circle cx="222" cy="166" r="13" fill="white" fillOpacity="0.15"/>
            <circle cx="222" cy="166" r="6" fill="white" fillOpacity="0.5"/>
            <line x1="142" y1="100" x2="142" y2="172" stroke="#E5E7EB" strokeWidth="1.5" strokeOpacity="0.4"/>
            <circle cx="116" cy="61" r="10" fill="#FCD34D"/>
            <path d="M109 69 Q116 73 123 69" fill="none" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M107 57 Q109 48 116 48 Q123 48 125 57" fill="#7C3AED" fillOpacity="0.7"/>
            <circle cx="176" cy="60" r="10" fill="#FDA4AF"/>
            <path d="M169 68 Q176 72 183 68" fill="none" stroke="#9F1239" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M168 54 Q172 44 180 46 Q186 50 184 56" fill="#7C3AED" fillOpacity="0.6"/>
            <circle cx="193" cy="62" r="8" fill="#86EFAC"/>
            <path d="M187 69 Q193 73 199 69" fill="none" stroke="#166534" strokeWidth="1.5" strokeLinecap="round"/>
            <rect x="0" y="184" width="320" height="16" fill="white" fillOpacity="0.08"/>
            <line x1="20" y1="192" x2="80" y2="192" stroke="white" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="40 20"/>
            <line x1="130" y1="192" x2="190" y2="192" stroke="white" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="40 20"/>
            <line x1="240" y1="192" x2="300" y2="192" stroke="white" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="40 20"/>
        </svg>
    );
}

export default function PassengerLogin() {
    const router = useRouter();

    // mode: "otp" | "password"
    const [mode, setMode]               = useState("otp");

    // OTP flow
    const [step, setStep]               = useState(1);
    const [identifier, setIdentifier]   = useState("");
    const [maskedEmail, setMaskedEmail] = useState("");
    const [otp, setOtp]                 = useState(["", "", "", "", "", ""]);
    const [timer, setTimer]             = useState(60);
    const [canResend, setCanResend]     = useState(false);

    // Password flow
    const [email, setEmail]             = useState("");
    const [password, setPassword]       = useState("");
    const [showPass, setShowPass]       = useState(false);

    const [loading, setLoading]         = useState(false);
    const [error, setError]             = useState("");

    const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

    useEffect(() => {
        if (step !== 2) return;
        setTimer(60); setCanResend(false);
        const iv = setInterval(() => {
            setTimer(p => { if (p <= 1) { clearInterval(iv); setCanResend(true); return 0; } return p - 1; });
        }, 1000);
        return () => clearInterval(iv);
    }, [step]);

    const saveAndRedirect = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("authChanged"));
        if (data.user.role === "admin")         router.push("/admin");
        else if (data.user.role === "provider") router.push("/provider-dashboard");
        else                                     router.push("/traveler-dashboard");
    };

    const isPhone = (val) => /^\+?[0-9]{10,15}$/.test(val.trim().replace(/[\s-]/g, ""));

    // ── OTP send ──
    const handleSendOtp = async () => {
        setError("");
        const val = identifier.trim();
        if (!val) return setError("Enter your phone number or email");
        setLoading(true);
        try {
            const res  = await fetch("/api/auth/send-login-otp", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: val }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send OTP");
            setMaskedEmail(data.maskedEmail || "");
            setStep(2);
            setTimeout(() => otpRefs[0].current?.focus(), 100);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    // ── OTP verify ──
    const handleVerifyOtp = async () => {
        setError("");
        const otpStr = otp.join("");
        if (otpStr.length < 6) return setError("Enter the complete 6-digit OTP");
        setLoading(true);
        try {
            const res  = await fetch("/api/auth/verify-login-otp", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: identifier.trim(), otp: otpStr }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Invalid OTP");
            saveAndRedirect(data);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    // ── Password login ──
    const handlePasswordLogin = async () => {
        setError("");
        if (!email.trim()) return setError("Email is required");
        if (!password || password.length < 6) return setError("Password must be at least 6 characters");
        setLoading(true);
        try {
            const res  = await fetch("/api/auth/login", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");
            saveAndRedirect(data);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    const handleOtpChange = (i, val) => {
        if (!/^\d*$/.test(val)) return;
        const n = [...otp]; n[i] = val.slice(-1); setOtp(n);
        if (val && i < 5) otpRefs[i + 1].current?.focus();
    };
    const handleOtpKeyDown = (i, e) => {
        if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs[i - 1].current?.focus();
    };

    const switchMode = (m) => { setMode(m); setError(""); setStep(1); setOtp(["","","","","",""]); };

    const showPhonePrefix = isPhone(identifier) || /^\d+$/.test(identifier.trim());

    // header back action
    const handleBack = () => {
        if (mode === "password") { switchMode("otp"); return; }
        if (step === 2)          { setStep(1); setError(""); setOtp(["","","","","",""]); return; }
        router.push("/");
    };

    return (
        <div
            className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-between relative overflow-hidden px-6 py-10"
            style={{ background: "linear-gradient(170deg, #1E0A44 0%, #4C1D95 35%, #7C3AED 70%, #8B5CF6 100%)" }}
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-400/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-800/20 rounded-full blur-3xl pointer-events-none" />
            {[[5,8],[92,12],[15,45],[88,38],[10,72],[90,70],[50,3],[75,55]].map(([l,t],i) => (
                <div key={i} className="absolute w-1.5 h-1.5 bg-white/20 rounded-full pointer-events-none" style={{left:`${l}%`,top:`${t}%`}} />
            ))}

            {/* Header */}
            <div className="relative z-10 w-full flex items-center justify-between max-w-sm">
                <button
                    onClick={handleBack}
                    className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center hover:bg-white/25 transition"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
                    </svg>
                </button>
                <span className="text-xs font-bold text-white/70 uppercase tracking-[3px]">Passenger App</span>
                <div className="w-9" />
            </div>

            {/* Illustration */}
            <div className="relative z-10 mt-2 w-full max-w-xs">
                <CarIllustration />
            </div>

            {/* Form card */}
            <div className="relative z-10 w-full max-w-sm">

                {/* ══ OTP: STEP 1 ══ */}
                {mode === "otp" && step === 1 && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
                        <h1 className="text-2xl font-extrabold text-white mb-1">Welcome Back!</h1>
                        <p className="text-violet-200 text-sm mb-5">Login to continue</p>

                        <div className="flex items-center h-14 bg-white/15 border border-white/25 rounded-2xl overflow-hidden focus-within:border-white focus-within:bg-white/20 transition-all mb-1">
                            {showPhonePrefix ? (
                                <div className="flex items-center gap-1.5 pl-4 pr-3 border-r border-white/25 h-full flex-shrink-0">
                                    <span className="text-lg leading-none">🇮🇳</span>
                                    <span className="text-sm font-bold text-white">+91</span>
                                </div>
                            ) : (
                                <div className="pl-4 pr-3 border-r border-white/25 h-full flex items-center flex-shrink-0">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                </div>
                            )}
                            <input
                                value={identifier}
                                onChange={e => { setIdentifier(e.target.value); setError(""); }}
                                type="text"
                                inputMode={showPhonePrefix ? "numeric" : "email"}
                                placeholder={showPhonePrefix ? "98765 43210" : "Phone number or email"}
                                autoComplete="username"
                                className="flex-1 h-full px-4 text-base text-white placeholder-white/40 bg-transparent focus:outline-none"
                                onKeyDown={e => e.key === "Enter" && handleSendOtp()}
                            />
                        </div>
                        <p className="text-xs text-white/40 mb-4 pl-1">OTP will be sent to your registered email</p>

                        {error && <div className="flex items-center gap-2 bg-red-900/30 border border-red-400/30 text-red-300 rounded-xl px-3 py-2.5 text-xs mb-4"><X size={12}/><span>{error}</span></div>}

                        <button onClick={handleSendOtp} disabled={loading || !identifier.trim()}
                            className="w-full h-14 bg-white hover:bg-gray-50 disabled:opacity-50 text-[#7C3AED] font-extrabold rounded-2xl text-base transition-all shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 mb-4">
                            {loading ? <><Loader2 size={18} className="animate-spin text-[#7C3AED]" /> Sending...</> : "Get OTP"}
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-1 h-px bg-white/20" />
                            <span className="text-xs text-white/50 whitespace-nowrap">or</span>
                            <div className="flex-1 h-px bg-white/20" />
                        </div>

                        <button onClick={() => switchMode("password")}
                            className="w-full h-11 bg-white/15 border border-white/25 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold text-white hover:bg-white/25 transition mb-4">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            Login with Password
                        </button>

                        <div className="text-center">
                            <p className="text-xs text-white/40">
                                Are you a driver?{" "}
                                <Link href="/provider-login" className="text-white font-semibold hover:underline">Driver Login →</Link>
                            </p>
                        </div>
                    </div>
                )}

                {/* ══ OTP: STEP 2 ══ */}
                {mode === "otp" && step === 2 && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center mx-auto mb-4">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.63a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16z"/>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-extrabold text-white mb-1">OTP Sent!</h1>
                        <p className="text-violet-200 text-sm mb-1">Code sent to your registered email</p>
                        <p className="text-white font-bold text-sm mb-6">{maskedEmail}</p>

                        <div className="flex justify-between gap-2 mb-5">
                            {otp.map((digit, i) => (
                                <input key={i} ref={otpRefs[i]} value={digit}
                                    onChange={e => handleOtpChange(i, e.target.value)}
                                    onKeyDown={e => handleOtpKeyDown(i, e)}
                                    type="text" inputMode="numeric" maxLength={1}
                                    className={`w-11 text-center text-xl font-extrabold rounded-xl focus:outline-none transition-all border-2 ${digit ? "bg-white text-[#7C3AED] border-white" : "bg-white/15 text-white border-white/30 focus:border-white focus:bg-white/20"}`}
                                    style={{ height: "52px" }}
                                />
                            ))}
                        </div>

                        <div className="mb-4">
                            {canResend ? (
                                <button onClick={() => { setOtp(["","","","","",""]); handleSendOtp(); }} className="text-sm text-white font-semibold hover:underline">Resend OTP</button>
                            ) : (
                                <p className="text-sm text-white/70">Resend in <span className="text-white font-bold">00:{String(timer).padStart(2, "0")}</span></p>
                            )}
                        </div>

                        {error && <div className="flex items-center gap-2 bg-red-900/30 border border-red-400/30 text-red-300 rounded-xl px-3 py-2.5 text-xs mb-4"><X size={12}/><span>{error}</span></div>}

                        <button onClick={handleVerifyOtp} disabled={loading || otp.join("").length < 6}
                            className="w-full h-14 bg-white hover:bg-gray-50 disabled:opacity-50 text-[#7C3AED] font-extrabold rounded-2xl text-base transition-all shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
                            {loading ? <><Loader2 size={18} className="animate-spin text-[#7C3AED]" /> Verifying...</> : "Verify & Login →"}
                        </button>
                    </div>
                )}

                {/* ══ PASSWORD MODE ══ */}
                {mode === "password" && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
                        <h1 className="text-2xl font-extrabold text-white mb-1">Sign In</h1>
                        <p className="text-violet-200 text-sm mb-5">Login with email &amp; password</p>

                        {/* Email */}
                        <div className="flex items-center h-14 bg-white/15 border border-white/25 rounded-2xl overflow-hidden focus-within:border-white focus-within:bg-white/20 transition-all mb-3">
                            <div className="pl-4 pr-3 border-r border-white/25 h-full flex items-center flex-shrink-0">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                                </svg>
                            </div>
                            <input value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                                type="email" placeholder="Email address" autoComplete="email"
                                className="flex-1 h-full px-4 text-base text-white placeholder-white/40 bg-transparent focus:outline-none"
                                onKeyDown={e => e.key === "Enter" && handlePasswordLogin()}
                            />
                        </div>

                        {/* Password */}
                        <div className="flex items-center h-14 bg-white/15 border border-white/25 rounded-2xl overflow-hidden focus-within:border-white focus-within:bg-white/20 transition-all mb-1">
                            <div className="pl-4 pr-3 border-r border-white/25 h-full flex items-center flex-shrink-0">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            </div>
                            <input value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
                                type={showPass ? "text" : "password"} placeholder="Password" autoComplete="current-password"
                                className="flex-1 h-full px-4 text-base text-white placeholder-white/40 bg-transparent focus:outline-none"
                                onKeyDown={e => e.key === "Enter" && handlePasswordLogin()}
                            />
                            <button type="button" onClick={() => setShowPass(s => !s)} className="pr-4 text-white/50 hover:text-white transition">
                                {showPass ? <EyeOff size={17}/> : <Eye size={17}/>}
                            </button>
                        </div>

                        {error && <div className="flex items-center gap-2 bg-red-900/30 border border-red-400/30 text-red-300 rounded-xl px-3 py-2.5 text-xs mb-3 mt-2"><X size={12}/><span>{error}</span></div>}

                        <button onClick={handlePasswordLogin} disabled={loading || !email.trim() || !password}
                            className="w-full h-14 bg-white hover:bg-gray-50 disabled:opacity-50 text-[#7C3AED] font-extrabold rounded-2xl text-base transition-all shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-4 mb-4">
                            {loading ? <><Loader2 size={18} className="animate-spin text-[#7C3AED]" /> Signing in...</> : "Sign In →"}
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-1 h-px bg-white/20" />
                            <span className="text-xs text-white/50 whitespace-nowrap">or use OTP</span>
                            <div className="flex-1 h-px bg-white/20" />
                        </div>

                        <button onClick={() => switchMode("otp")}
                            className="w-full h-11 bg-white/15 border border-white/25 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold text-white hover:bg-white/25 transition">
                            Login with OTP instead
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
