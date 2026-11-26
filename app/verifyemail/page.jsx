"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { MailCheck, Loader2, CheckCircle, XCircle, Info } from "lucide-react";

function VerifyEmailForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const length = 6;
    const [code, setCode] = useState(Array(length).fill(""));
    const inputsRef = useRef([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
        return () => clearInterval(t);
    }, [resendCooldown]);

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    function handleChange(e, idx) {
        const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
        const next = [...code];
        next[idx] = val;
        setCode(next);
        if (idx < length - 1 && val) inputsRef.current[idx + 1]?.focus();
    }

    function handleKeyDown(e, idx) {
        if (e.key === "Backspace" && !code[idx] && idx > 0) inputsRef.current[idx - 1]?.focus();
        if (e.key === "ArrowLeft" && idx > 0) inputsRef.current[idx - 1]?.focus();
        if (e.key === "ArrowRight" && idx < length - 1) inputsRef.current[idx + 1]?.focus();
    }

    function handlePaste(e) {
        const pasted = (e.clipboardData || window.clipboardData)
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, length);
        if (!pasted) return;
        setCode(pasted.split("").concat(Array(length).fill("")).slice(0, length));
        const firstEmpty = pasted.length >= length ? length - 1 : pasted.length;
        inputsRef.current[firstEmpty]?.focus();
    }

    async function handleVerify(e) {
        e.preventDefault();
        setMessage(null);
        if (!email) return setMessage({ type: "error", text: "Email is missing." });

        const joined = code.join("");
        if (joined.length !== length)
            return setMessage({ type: "error", text: "Please enter the full 6-digit verification code." });

        setLoading(true);
        try {
            const res = await fetch("/api/auth/verifyemail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: joined }),
            });
            const data = await res.json();

            if (data.success) {
                setMessage({ type: "success", text: data.message });
                setTimeout(() => router.push("/login"), 2000);
            } else {
                setMessage({ type: "error", text: data.message });
            }
        } catch {
            setMessage({ type: "error", text: "Verification failed. Please try again." });
        } finally {
            setLoading(false);
        }
    }

    async function handleResend() {
        if (resendCooldown > 0 || !email) return;
        setMessage(null);
        try {
            await fetch("/api/auth/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            setResendCooldown(60);
            setMessage({ type: "info", text: "Verification code resent to your email." });
        } catch {
            setMessage({ type: "error", text: "Failed to resend. Please try again." });
        }
    }

    const msgStyles = {
        success: "bg-green-50 border border-green-100 text-green-700",
        error: "bg-red-50 border border-red-100 text-red-600",
        info: "bg-sky-50 border border-sky-100 text-sky-700",
    };
    const MsgIcon = { success: CheckCircle, error: XCircle, info: Info };

    return (
        <div className="min-h-[calc(100vh-56px)] bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg border border-gray-100 rounded-2xl p-8 text-center">

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-50 rounded-xl mb-5">
                    <MailCheck size={22} className="text-sky-600" />
                </div>

                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Verify your email</h2>
                <p className="text-sm text-gray-500 mb-1">We sent a 6-digit code to</p>
                <p className="text-sm font-medium text-gray-900 mb-7">{email || "your email"}</p>

                {/* OTP inputs */}
                <form onSubmit={handleVerify} onPaste={handlePaste}>
                    <div className="flex justify-center gap-1.5 sm:gap-2 mb-5">
                        {code.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={(el) => (inputsRef.current[idx] = el)}
                                value={digit}
                                onChange={(e) => handleChange(e, idx)}
                                onKeyDown={(e) => handleKeyDown(e, idx)}
                                className={`w-10 h-11 sm:w-11 sm:h-12 text-center text-base sm:text-lg font-semibold border rounded-lg focus:outline-none transition-colors bg-white flex-shrink-0
                                    ${digit
                                        ? "border-sky-400 bg-sky-50 text-sky-700"
                                        : "border-gray-200 text-gray-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
                                    }`}
                                inputMode="numeric"
                                autoComplete="one-time-code"
                            />
                        ))}
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 mb-4 text-xs text-left ${msgStyles[message.type]}`}>
                            {MsgIcon[message.type] && (() => {
                                const Icon = MsgIcon[message.type];
                                return <Icon size={13} className="flex-shrink-0" />;
                            })()}
                            <span>{message.text}</span>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || code.join("").length !== length}
                        className="w-full h-10 flex justify-center items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? <><Loader2 size={15} className="animate-spin" /> Verifying...</>
                            : "Verify Email"
                        }
                    </button>
                </form>

                {/* Resend */}
                <p className="mt-5 text-xs text-gray-500">
                    {resendCooldown > 0
                        ? <>Resend in <span className="font-medium text-gray-700">{resendCooldown}s</span></>
                        : <>
                            Didn&apos;t receive it?{" "}
                            <button
                                onClick={handleResend}
                                className="text-sky-600 hover:underline font-medium"
                            >
                                Resend
                            </button>
                          </>
                    }
                </p>

                <p className="mt-3 text-xs text-gray-400">
                    Back to{" "}
                    <Link href="/login" className="text-sky-600 hover:underline font-medium">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-white px-4">
            <div className="w-8 h-8 border-2 border-t-transparent border-sky-600 rounded-full animate-spin" />
        </div>
    );
}

export default function VerifyEmail() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <VerifyEmailForm />
        </Suspense>
    );
}
