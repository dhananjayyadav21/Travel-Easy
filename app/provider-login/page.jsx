"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X, Eye, EyeOff } from "lucide-react";

// â”€â”€ Driver character illustration â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function DriverIllustration() {
    return (
        <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-44 drop-shadow-2xl mx-auto">
            {/* Shadow */}
            <ellipse cx="100" cy="210" rx="52" ry="6" fill="black" fillOpacity="0.2"/>

            {/* Body / uniform */}
            <rect x="62" y="118" width="76" height="80" rx="10" fill="#4C1D95"/>
            <rect x="62" y="118" width="76" height="20" rx="4" fill="#5B21B6"/>

            {/* Collar/shirt detail */}
            <path d="M86 118 L100 132 L114 118" fill="white" fillOpacity="0.15"/>

            {/* ID badge */}
            <rect x="88" y="142" width="24" height="16" rx="3" fill="white" fillOpacity="0.2"/>
            <div/>

            {/* Arms */}
            <rect x="38" y="122" width="26" height="14" rx="7" fill="#4C1D95"/>
            <rect x="136" y="122" width="26" height="14" rx="7" fill="#4C1D95"/>

            {/* Hands */}
            <circle cx="44" cy="143" r="10" fill="#FCD34D"/>
            <circle cx="156" cy="143" r="10" fill="#FCD34D"/>

            {/* Legs */}
            <rect x="70" y="192" width="22" height="20" rx="6" fill="#3730A3"/>
            <rect x="108" y="192" width="22" height="20" rx="6" fill="#3730A3"/>

            {/* Shoes */}
            <ellipse cx="81" cy="210" rx="14" ry="6" fill="#1E1B4B"/>
            <ellipse cx="119" cy="210" rx="14" ry="6" fill="#1E1B4B"/>

            {/* Neck */}
            <rect x="90" y="102" width="20" height="20" rx="4" fill="#FCD34D"/>

            {/* Head */}
            <circle cx="100" cy="84" r="32" fill="#FCD34D"/>

            {/* Hair */}
            <path d="M68 76 Q70 52 100 50 Q130 52 132 76 Q128 60 100 58 Q72 60 68 76Z" fill="#7C3AED"/>

            {/* Eyes */}
            <circle cx="90" cy="82" r="4" fill="white"/>
            <circle cx="110" cy="82" r="4" fill="white"/>
            <circle cx="91" cy="83" r="2.5" fill="#1E1B4B"/>
            <circle cx="111" cy="83" r="2.5" fill="#1E1B4B"/>
            {/* Eye shine */}
            <circle cx="92" cy="82" r="1" fill="white"/>
            <circle cx="112" cy="82" r="1" fill="white"/>

            {/* Eyebrows */}
            <path d="M85 76 Q90 73 95 76" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M105 76 Q110 73 115 76" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round"/>

            {/* Smile */}
            <path d="M89 93 Q100 102 111 93" stroke="#C2410C" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

            {/* Cap */}
            <ellipse cx="100" cy="56" rx="34" ry="8" fill="#5B21B6"/>
            <rect x="68" y="48" width="64" height="10" rx="5" fill="#6D28D9"/>
            <rect x="92" y="43" width="16" height="8" rx="4" fill="#7C3AED"/>
            {/* Cap brim */}
            <path d="M68 56 Q60 58 58 62 Q68 60 68 56Z" fill="#4C1D95"/>
        </svg>
    );
}

export default function DriverLogin() {
    const router = useRouter();

    // mode: "otp" | "password"
    const [mode, setMode]               = useState("otp");

    // OTP flow
    const [step, setStep]               = useState(1);
    const [phone, setPhone]             = useState("");
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
        setTimer(60);
        setCanResend(false);
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) { clearInterval(interval); setCanResend(true); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [step]);

    const saveAndRedirect = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("authChanged"));
        if (data.user.role === "admin") router.push("/admin");
        else if (data.user.role === "provider") router.push("/provider-dashboard");
        else router.push("/traveler-dashboard");
    };

    const handleContinue = async () => {
        setError("");
        const val = phone.trim();
        if (!val) return setError("Enter your mobile number or email");
        setLoading(true);
        try {
            const res = await fetch("/api/auth/send-login-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: val }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send OTP");
            setMaskedEmail(data.maskedEmail || "");
            setStep(2);
            setTimeout(() => otpRefs[0].current?.focus(), 100);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setError("");
        const otpStr = otp.join("");
        if (otpStr.length < 6) return setError("Enter the complete 6-digit OTP");
        setLoading(true);
        try {
            const res = await fetch("/api/auth/verify-login-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: phone.trim(), otp: otpStr }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Invalid OTP");
            saveAndRedirect(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // â”€â”€ Password login â”€â”€
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
            if (!res.ok) throw new Error(data.message || "Sign in failed");
            saveAndRedirect(data);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    const switchMode = (m) => { setMode(m); setError(""); setStep(1); setOtp(["","","","","",""]); };

    const handleOtpChange = (i, val) => {
        if (!/^\d*$/.test(val)) return;
        const newOtp = [...otp];
        newOtp[i] = val.slice(-1);
        setOtp(newOtp);
        if (val && i < 5) otpRefs[i + 1].current?.focus();
    };

    const handleOtpKeyDown = (i, e) => {
        if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs[i - 1].current?.focus();
    };

    const handleBack = () => {
        if (mode === "password") { switchMode("otp"); return; }
        if (step === 2)          { setStep(1); setError(""); setOtp(["","","","","",""]); return; }
        router.push("/login");
    };

    return (
        <div
            className="min-h-screen md:min-h-[calc(100vh-56px)] flex flex-col items-center justify-between relative overflow-hidden px-6 py-10"
            style={{ background: "linear-gradient(170deg, #1E0A44 0%, #4C1D95 35%, #7C3AED 70%, #8B5CF6 100%)" }}
        >
            {/* Background blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-400/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-800/20 rounded-full blur-3xl pointer-events-none" />

            {/* Sparkle dots */}
            {[[5,8],[92,12],[15,45],[88,38],[10,72],[90,70],[50,3],[75,55]].map(([l,t],i) => (
                <div key={i} className="absolute w-1.5 h-1.5 bg-white/20 rounded-full pointer-events-none" style={{left:`${l}%`,top:`${t}%`}} />
            ))}

            {/* Header */}
            <div className="relative z-10 w-full flex items-center justify-between max-w-sm md:max-w-md lg:max-w-lg">
                <button
                    onClick={handleBack}
                    className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center hover:bg-white/25 transition"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
                    </svg>
                </button>
                <span className="text-xs font-bold text-white/70 uppercase tracking-[3px]">Driver App</span>
                <div className="w-9" />
            </div>

            {/* Illustration */}
            <div className="relative z-10 mt-4">
                <DriverIllustration />
            </div>

            {/* Form card */}
            <div className="relative z-10 w-full max-w-sm md:max-w-md lg:max-w-lg">

                {/* â•â• OTP: STEP 1 â•â• */}
                {mode === "otp" && step === 1 && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
                        <h1 className="text-2xl font-extrabold text-white mb-1">Driver Sign In</h1>
                        <p className="text-violet-200 text-sm mb-6">Enter your mobile number</p>

                        {/* Phone input */}
                        <div className="flex items-center h-14 bg-white/15 border border-white/25 rounded-2xl overflow-hidden focus-within:border-white focus-within:bg-white/20 transition-all mb-4">
                            <div className="flex items-center gap-1.5 pl-4 pr-3 border-r border-white/25 h-full flex-shrink-0">
                                <span className="text-lg leading-none">ðŸ‡®ðŸ‡³</span>
                                <span className="text-sm font-bold text-white">+91</span>
                            </div>
                            <input
                                value={phone}
                                onChange={e => { setPhone(e.target.value); setError(""); }}
                                type="text"
                                inputMode="tel"
                                placeholder="98765 43210"
                                autoComplete="tel"
                                className="flex-1 h-full px-4 text-base text-white placeholder-white/40 bg-transparent focus:outline-none"
                                onKeyDown={e => e.key === "Enter" && handleContinue()}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 bg-red-900/30 border border-red-400/30 text-red-300 rounded-xl px-3 py-2.5 text-xs mb-4">
                                <X size={12} className="flex-shrink-0"/><span>{error}</span>
                            </div>
                        )}

                        <button
                            onClick={handleContinue}
                            disabled={loading || !phone.trim()}
                            className="w-full h-14 bg-white hover:bg-gray-50 disabled:opacity-50 text-[#7C3AED] font-extrabold rounded-xl text-base transition-all shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            {loading ? <><Loader2 size={18} className="animate-spin text-[#7C3AED]" /> Sending...</> : "Continue â†’"}
                        </button>

                        <div className="flex items-center gap-3 mt-5 mb-4">
                            <div className="flex-1 h-px bg-white/20" />
                            <span className="text-xs text-white/50 whitespace-nowrap">or</span>
                            <div className="flex-1 h-px bg-white/20" />
                        </div>

                        <button onClick={() => switchMode("password")}
                            className="w-full h-11 bg-white/15 border border-white/25 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-white hover:bg-white/25 transition mb-5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            Sign In with Password
                        </button>

                        <div className="text-center">
                            <p className="text-xs text-white/50">
                                Not a driver?{" "}
                                <Link href="/login" className="text-white font-semibold hover:underline">
                                    Passenger Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                )}

                {/* â•â• OTP: STEP 2 â•â• */}
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
                                <input
                                    key={i}
                                    ref={otpRefs[i]}
                                    value={digit}
                                    onChange={e => handleOtpChange(i, e.target.value)}
                                    onKeyDown={e => handleOtpKeyDown(i, e)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    className={`w-11 h-13 text-center text-xl font-extrabold rounded-xl focus:outline-none transition-all border-2 ${
                                        digit
                                            ? "bg-white text-[#7C3AED] border-white"
                                            : "bg-white/15 text-white border-white/30 focus:border-white focus:bg-white/20"
                                    }`}
                                    style={{ height: "52px" }}
                                />
                            ))}
                        </div>

                        <div className="mb-4">
                            {canResend ? (
                                <button
                                    onClick={() => { setOtp(["","","","","",""]); handleContinue(); }}
                                    className="text-sm text-white font-semibold hover:underline"
                                >
                                    Resend OTP
                                </button>
                            ) : (
                                <p className="text-sm text-white/70">
                                    Resend in <span className="text-white font-bold">00:{String(timer).padStart(2, "0")}</span>
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 bg-red-900/30 border border-red-400/30 text-red-300 rounded-xl px-3 py-2.5 text-xs mb-4">
                                <X size={12} className="flex-shrink-0"/><span>{error}</span>
                            </div>
                        )}

                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading || otp.join("").length < 6}
                            className="w-full h-14 bg-white hover:bg-gray-50 disabled:opacity-50 text-[#7C3AED] font-extrabold rounded-xl text-base transition-all shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            {loading ? <><Loader2 size={18} className="animate-spin text-[#7C3AED]" /> Verifying...</> : "Verify & Sign In â†’"}
                        </button>
                    </div>
                )}
                {/* â•â• PASSWORD MODE â•â• */}
                {mode === "password" && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
                        <h1 className="text-2xl font-extrabold text-white mb-1">Sign In</h1>
                        <p className="text-violet-200 text-sm mb-5">Sign in with email &amp; password</p>

                        <div className="flex items-center h-14 bg-white/15 border border-white/25 rounded-xl overflow-hidden focus-within:border-white focus-within:bg-white/20 transition-all mb-3">
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

                        <div className="flex items-center h-14 bg-white/15 border border-white/25 rounded-xl overflow-hidden focus-within:border-white focus-within:bg-white/20 transition-all mb-1">
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
                            className="w-full h-14 bg-white hover:bg-gray-50 disabled:opacity-50 text-[#7C3AED] font-extrabold rounded-xl text-base transition-all shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-4 mb-4">
                            {loading ? <><Loader2 size={18} className="animate-spin text-[#7C3AED]" /> Signing in...</> : "Sign In â†’"}
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-1 h-px bg-white/20" />
                            <span className="text-xs text-white/50 whitespace-nowrap">or use OTP</span>
                            <div className="flex-1 h-px bg-white/20" />
                        </div>

                        <button onClick={() => switchMode("otp")}
                            className="w-full h-11 bg-white/15 border border-white/25 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-white hover:bg-white/25 transition">
                            Sign In with OTP instead
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
