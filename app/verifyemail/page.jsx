"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function VerifyEmail() {
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
        // focus first input on mount
        inputsRef.current[0]?.focus();
    }, []);

    function handleChange(e, idx) {
        const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
        if (!val) {
            setCode((c) => {
                const next = [...c];
                next[idx] = "";
                return next;
            });
            return;
        }
        setCode((c) => {
            const next = [...c];
            next[idx] = val;
            return next;
        });
        // move focus
        if (idx < length - 1) inputsRef.current[idx + 1]?.focus();
    }

    function handleKeyDown(e, idx) {
        if (e.key === "Backspace" && !code[idx] && idx > 0) {
            inputsRef.current[idx - 1]?.focus();
        }
        if (e.key === "ArrowLeft" && idx > 0) inputsRef.current[idx - 1]?.focus();
        if (e.key === "ArrowRight" && idx < length - 1) inputsRef.current[idx + 1]?.focus();
    }

    function handlePaste(e) {
        const pasted = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "").slice(0, length);
        if (!pasted) return;
        const arr = pasted.split("").concat(Array(length).fill(""));
        setCode(arr.slice(0, length));
        // focus next empty
        const firstEmpty = pasted.length >= length ? length - 1 : pasted.length;
        inputsRef.current[firstEmpty]?.focus();
    }

    async function handleVerify(e) {
        e.preventDefault();
        setMessage(null);
        const joined = code.join("");
        if (joined.length !== length) return setMessage({ type: "error", text: "Please enter the full verification code." });
        setLoading(true);
        try {
            // simulate API call
            await new Promise((r) => setTimeout(r, 900));
            // for demo, accept code '123456'
            if (joined === "123456") {
                setMessage({ type: "success", text: "Email verified successfully!" });
                // redirect or do further actions here
            } else {
                setMessage({ type: "error", text: "Invalid verification code. Please try again." });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Verification failed. Please try again." });
        } finally {
            setLoading(false);
        }
    }

    function handleResend() {
        if (resendCooldown > 0) return;
        setMessage({ type: "info", text: "Verification code resent to your email." });
        setResendCooldown(30);
        // call API to resend here
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-red-50 px-4 py-12">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
                <p className="text-gray-700 mb-6">We have sent a verification code to your email. Enter the 6-digit code below to verify your account.</p>

                <form onSubmit={handleVerify} onPaste={handlePaste} className="space-y-4">
                    <div className="flex justify-center gap-2">
                        {code.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={(el) => (inputsRef.current[idx] = el)}
                                value={digit}
                                onChange={(e) => handleChange(e, idx)}
                                onKeyDown={(e) => handleKeyDown(e, idx)}
                                className="w-10 h-12 text-center border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-black/30"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                            />
                        ))}
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-900 disabled:opacity-60">
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>
                </form>

                {message && (
                    <div className={`mt-4 p-2 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                        {message.text}
                    </div>
                )}

                <div className="mt-4 text-sm text-gray-600">
                    Didn't receive the code?{' '}
                    <button onClick={handleResend} disabled={resendCooldown > 0} className="text-black font-medium hover:underline">
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend'}
                    </button>
                </div>

                <p className="mt-4 text-sm text-gray-600">Back to <Link href="/login" className="text-black hover:underline">Login</Link></p>
            </div>
        </div>
    );
}
