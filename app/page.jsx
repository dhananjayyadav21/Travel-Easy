"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            const token = localStorage.getItem("token");
            const user = (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })();

            if (token && user) {
                if (user.role === "provider") router.replace("/provider-dashboard");
                else if (user.role === "admin") router.replace("/admin");
                else router.replace("/traveler-dashboard");
            } else {
                const seen = localStorage.getItem("onboardingSeen");
                router.replace(seen ? "/login" : "/onboarding");
            }
        }, 2800);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div
            className="fixed inset-0 flex flex-col items-center justify-between"
            style={{
                background: "linear-gradient(180deg, #4A1DB0 0%, #6B2FD9 40%, #7B3AED 100%)",
                zIndex: 9999,
            }}
        >
            {/* ── LOGO + NAME + TAGLINE ── */}
            <div className="flex flex-col items-center pt-24 gap-5">
                {/* App icon */}
                <div
                    className="w-24 h-24 rounded-3xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.18)", border: "2px solid rgba(255,255,255,0.28)" }}
                >
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                        {/* Arch over people */}
                        <path
                            d="M8 38 C8 18 48 18 48 38"
                            stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"
                        />
                        {/* Left person */}
                        <circle cx="17" cy="26" r="5" fill="white" opacity="0.85"/>
                        <path d="M11 38 C11 31 23 31 23 38" fill="white" opacity="0.7"/>
                        {/* Right person */}
                        <circle cx="39" cy="26" r="5" fill="white" opacity="0.85"/>
                        <path d="M33 38 C33 31 45 31 45 38" fill="white" opacity="0.7"/>
                        {/* Center person */}
                        <circle cx="28" cy="22" r="6" fill="white"/>
                        <path d="M21 38 C21 30 35 30 35 38" fill="white" opacity="0.9"/>
                        {/* Car bottom */}
                        <rect x="12" y="38" width="32" height="10" rx="5" fill="white" opacity="0.9"/>
                        <circle cx="19" cy="48" r="3.5" fill="white" opacity="0.7"/>
                        <circle cx="37" cy="48" r="3.5" fill="white" opacity="0.7"/>
                    </svg>
                </div>

                {/* App name */}
                <div className="text-center">
                    <h1 className="text-[36px] font-black text-white tracking-tight leading-none">
                        TravelEasy<span style={{ color: "#C4B5FD" }}>Hai</span>
                    </h1>
                    <p className="text-base font-medium mt-2" style={{ color: "#C4B5FD" }}>
                        Share Ride. Save More.
                    </p>
                </div>
            </div>

            {/* ── CAR (centered, prominent) ── */}
            <div className="flex items-center justify-center">
                <svg width="280" height="140" viewBox="0 0 280 140" fill="none">
                    {/* Shadow */}
                    <ellipse cx="140" cy="130" rx="100" ry="8" fill="rgba(0,0,0,0.25)"/>
                    {/* Car body */}
                    <rect x="20" y="70" width="240" height="52" rx="14" fill="white" opacity="0.97"/>
                    {/* Cabin roof */}
                    <path d="M62 70 L82 28 L198 28 L218 70Z" fill="white" opacity="0.95"/>
                    {/* Windshield */}
                    <path d="M90 32 L78 70 L132 70 L132 32Z" fill="#C4B5FD" opacity="0.75"/>
                    {/* Rear window */}
                    <path d="M190 32 L202 70 L148 70 L148 32Z" fill="#C4B5FD" opacity="0.75"/>
                    {/* Middle window divider line */}
                    <line x1="140" y1="30" x2="140" y2="70" stroke="white" strokeWidth="3" opacity="0.5"/>
                    {/* Headlights */}
                    <rect x="24" y="88" width="28" height="14" rx="7" fill="#FDE68A" opacity="0.95"/>
                    {/* Tail lights */}
                    <rect x="228" y="88" width="28" height="14" rx="7" fill="#FCA5A5" opacity="0.9"/>
                    {/* Door line */}
                    <line x1="140" y1="70" x2="140" y2="116" stroke="#E9D5FF" strokeWidth="2" opacity="0.4"/>
                    {/* Wheels */}
                    <circle cx="72"  cy="122" r="22" fill="#1E1B4B"/>
                    <circle cx="72"  cy="122" r="13" fill="#6D28D9"/>
                    <circle cx="72"  cy="122" r="6"  fill="white" opacity="0.4"/>
                    <circle cx="208" cy="122" r="22" fill="#1E1B4B"/>
                    <circle cx="208" cy="122" r="13" fill="#6D28D9"/>
                    <circle cx="208" cy="122" r="6"  fill="white" opacity="0.4"/>
                </svg>
            </div>

            {/* ── CITY SILHOUETTE + SPINNER ── */}
            <div className="w-full">
                {/* City skyline */}
                <svg viewBox="0 0 400 80" className="w-full" style={{ display: "block", marginBottom: -2 }} preserveAspectRatio="none">
                    <g fill="rgba(255,255,255,0.07)">
                        <rect x="0"   y="35" width="22"  height="45"/>
                        <rect x="7"   y="22" width="8"   height="16"/>
                        <rect x="26"  y="28" width="18"  height="52"/>
                        <rect x="48"  y="15" width="16"  height="65"/>
                        <rect x="51"  y="8"  width="6"   height="10"/>
                        <rect x="68"  y="30" width="22"  height="50"/>
                        <rect x="94"  y="10" width="20"  height="70"/>
                        <rect x="97"  y="4"  width="5"   height="8"/>
                        <rect x="118" y="38" width="16"  height="42"/>
                        <rect x="138" y="20" width="22"  height="60"/>
                        <rect x="164" y="32" width="18"  height="48"/>
                        <rect x="186" y="8"  width="20"  height="72"/>
                        <rect x="190" y="2"  width="6"   height="8"/>
                        <rect x="210" y="25" width="18"  height="55"/>
                        <rect x="232" y="12" width="24"  height="68"/>
                        <rect x="260" y="38" width="16"  height="42"/>
                        <rect x="280" y="18" width="22"  height="62"/>
                        <rect x="306" y="30" width="20"  height="50"/>
                        <rect x="330" y="10" width="18"  height="70"/>
                        <rect x="333" y="4"  width="5"   height="8"/>
                        <rect x="352" y="28" width="22"  height="52"/>
                        <rect x="378" y="20" width="22"  height="60"/>
                    </g>
                    {/* Road strip */}
                    <rect x="0" y="74" width="400" height="6" fill="rgba(255,255,255,0.05)"/>
                </svg>

                {/* Circular spinner */}
                <div className="flex justify-center pb-10 pt-4" style={{ background: "rgba(0,0,0,0)" }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" className="animate-spin" style={{ animationDuration: "1s" }}>
                        <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
                        <path
                            d="M16 4 A12 12 0 0 1 28 16"
                            fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}
