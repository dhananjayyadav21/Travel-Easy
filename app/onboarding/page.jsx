"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SLIDES = [
    {
        title: "Travel Together\nSave More",
        desc: "Book a seat and share your ride with others.",
        illustration: "people",
    },
    {
        title: "Safe & Affordable\nRides",
        desc: "Verified providers, live GPS tracking, just ₹8/km.",
        illustration: "shield",
    },
    {
        title: "Book in\nSeconds",
        desc: "Find a ride, pick your seat, pay on arrival.",
        illustration: "booking",
    },
];

/* ── Illustrations ── */
function PeopleInCar() {
    return (
        <svg viewBox="0 0 320 220" fill="none" className="w-full max-w-xs mx-auto">
            {/* City skyline background */}
            <g fill="#C4B5FD" opacity="0.35">
                <rect x="0"   y="80"  width="30"  height="80"/>
                <rect x="8"   y="60"  width="10"  height="22"/>
                <rect x="34"  y="68"  width="22"  height="92"/>
                <rect x="60"  y="45"  width="18"  height="115"/>
                <rect x="63"  y="35"  width="6"   height="13"/>
                <rect x="82"  y="58"  width="20"  height="102"/>
                <rect x="106" y="30"  width="22"  height="130"/>
                <rect x="109" y="20"  width="7"   height="13"/>
                <rect x="132" y="50"  width="18"  height="110"/>
                <rect x="154" y="38"  width="20"  height="122"/>
                <rect x="178" y="55"  width="18"  height="105"/>
                <rect x="200" y="25"  width="22"  height="135"/>
                <rect x="203" y="15"  width="7"   height="13"/>
                <rect x="226" y="48"  width="20"  height="112"/>
                <rect x="250" y="35"  width="22"  height="125"/>
                <rect x="276" y="58"  width="22"  height="102"/>
                <rect x="302" y="45"  width="20"  height="115"/>
            </g>

            {/* Road */}
            <rect x="0" y="188" width="320" height="32" fill="#E0D9F5"/>
            <rect x="0" y="192" width="320" height="2"  fill="#C4B5FD" opacity="0.4"/>

            {/* Car shadow */}
            <ellipse cx="160" cy="200" rx="110" ry="9" fill="#A78BFA" opacity="0.2"/>

            {/* Car body */}
            <rect x="38"  y="140" width="244" height="58" rx="14" fill="#7C3AED"/>
            {/* Car cabin */}
            <path d="M75 140 L95 100 L225 100 L245 140Z" fill="#6D28D9"/>
            {/* Windshield */}
            <path d="M102 104 L90 140 L160 140 L160 104Z" fill="#A5F3FC" opacity="0.65"/>
            {/* Rear window */}
            <path d="M218 104 L230 140 L160 140 L160 104Z" fill="#A5F3FC" opacity="0.55"/>
            {/* Window divider */}
            <line x1="160" y1="102" x2="160" y2="140" stroke="#5B21B6" strokeWidth="3"/>
            {/* Door line */}
            <line x1="160" y1="140" x2="160" y2="192" stroke="#5B21B6" strokeWidth="2" opacity="0.4"/>

            {/* Head 1 (left) */}
            <circle cx="118" cy="118" r="16" fill="#FDE68A"/>
            <circle cx="118" cy="108" r="10" fill="#92400E" opacity="0.7"/>
            <path d="M108 126 Q118 132 128 126" stroke="#92400E" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <circle cx="113" cy="117" r="2.5" fill="#92400E"/>
            <circle cx="123" cy="117" r="2.5" fill="#92400E"/>

            {/* Head 2 (center) */}
            <circle cx="160" cy="116" r="17" fill="#FDA4AF"/>
            <path d="M151 106 Q160 100 169 106 Q172 115 160 118 Q148 115 151 106Z" fill="#9F1239" opacity="0.7"/>
            <path d="M150 125 Q160 131 170 125" stroke="#9F1239" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <circle cx="154" cy="115" r="2.5" fill="#9F1239"/>
            <circle cx="166" cy="115" r="2.5" fill="#9F1239"/>

            {/* Head 3 (driver, right) */}
            <circle cx="203" cy="117" r="16" fill="#86EFAC"/>
            <path d="M194 108 Q203 102 212 108 Q215 118 203 120 Q191 118 194 108Z" fill="#166534" opacity="0.7"/>
            <path d="M194 126 Q203 132 212 126" stroke="#166534" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <circle cx="197" cy="116" r="2.5" fill="#166534"/>
            <circle cx="209" cy="116" r="2.5" fill="#166534"/>
            {/* Steering wheel hint */}
            <circle cx="225" cy="138" r="11" stroke="#5B21B6" strokeWidth="3" fill="none"/>
            <line x1="225" y1="127" x2="225" y2="149" stroke="#5B21B6" strokeWidth="2"/>
            <line x1="214" y1="138" x2="236" y2="138" stroke="#5B21B6" strokeWidth="2"/>

            {/* Headlight */}
            <rect x="42"  y="158" width="22" height="12" rx="6" fill="#FEF08A" opacity="0.95"/>
            {/* Tail light */}
            <rect x="256" y="158" width="22" height="12" rx="6" fill="#FCA5A5" opacity="0.9"/>

            {/* Wheels */}
            <circle cx="96"  cy="192" r="22" fill="#1E1B4B"/>
            <circle cx="96"  cy="192" r="13" fill="#4C1D95"/>
            <circle cx="96"  cy="192" r="6"  fill="#C4B5FD" opacity="0.5"/>
            <circle cx="224" cy="192" r="22" fill="#1E1B4B"/>
            <circle cx="224" cy="192" r="13" fill="#4C1D95"/>
            <circle cx="224" cy="192" r="6"  fill="#C4B5FD" opacity="0.5"/>
        </svg>
    );
}

function ShieldIllustration() {
    return (
        <svg viewBox="0 0 280 220" fill="none" className="w-full max-w-xs mx-auto">
            <g fill="#C4B5FD" opacity="0.3">
                <rect x="10"  y="90"  width="24" height="90"/>
                <rect x="40"  y="65"  width="20" height="115"/>
                <rect x="66"  y="45"  width="18" height="135"/>
                <rect x="90"  y="70"  width="22" height="110"/>
                <rect x="168" y="70"  width="22" height="110"/>
                <rect x="196" y="45"  width="18" height="135"/>
                <rect x="220" y="65"  width="20" height="115"/>
                <rect x="246" y="90"  width="24" height="90"/>
            </g>
            <ellipse cx="140" cy="210" rx="80" ry="8" fill="#A78BFA" opacity="0.15"/>
            <circle cx="140" cy="110" r="85" fill="#EDE9FE"/>
            <path d="M140 42 L195 68 L195 118 C195 152 168 174 140 184 C112 174 85 152 85 118 L85 68 Z" fill="#7C3AED"/>
            <path d="M118 115 L132 129 L163 98" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="140" cy="110" r="85" stroke="#DDD6FE" strokeWidth="1.5" fill="none" opacity="0.5"/>
        </svg>
    );
}

function BookingIllustration() {
    return (
        <svg viewBox="0 0 280 220" fill="none" className="w-full max-w-xs mx-auto">
            <g fill="#C4B5FD" opacity="0.3">
                <rect x="10"  y="90"  width="24" height="90"/>
                <rect x="40"  y="65"  width="20" height="115"/>
                <rect x="66"  y="45"  width="18" height="135"/>
                <rect x="196" y="45"  width="18" height="135"/>
                <rect x="220" y="65"  width="20" height="115"/>
                <rect x="246" y="90"  width="24" height="90"/>
            </g>
            <rect x="55"  y="55"  width="170" height="135" rx="20" fill="#EDE9FE" opacity="0.6"/>
            <rect x="40"  y="40"  width="170" height="135" rx="20" fill="white" stroke="#DDD6FE" strokeWidth="1.5"/>
            <rect x="60"  y="68"  width="130" height="14" rx="7" fill="#7C3AED" opacity="0.25"/>
            <rect x="60"  y="92"  width="90"  height="10" rx="5" fill="#A78BFA" opacity="0.3"/>
            <rect x="60"  y="112" width="110" height="10" rx="5" fill="#A78BFA" opacity="0.2"/>
            <rect x="60"  y="132" width="75"  height="10" rx="5" fill="#A78BFA" opacity="0.2"/>
            <circle cx="175" cy="155" r="34" fill="#7C3AED" opacity="0.95"/>
            <path d="M163 155 L172 164 L189 147" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

export default function Onboarding() {
    const [slide, setSlide] = useState(0);
    const router = useRouter();

    const finish = () => {
        localStorage.setItem("onboardingSeen", "true");
        router.push("/login");
    };
    const handleNext = () => {
        if (slide < SLIDES.length - 1) setSlide(slide + 1);
        else finish();
    };
    const handleSkip = () => finish();

    const ILLUS = [PeopleInCar, ShieldIllustration, BookingIllustration];
    const Illustration = ILLUS[slide];

    return (
        <div className="fixed inset-0 flex flex-col" style={{ zIndex: 9999, background: "linear-gradient(180deg, #EDE9FE 0%, #F5F3FF 55%, #ffffff 100%)" }}>
        <div className="relative flex flex-col w-full h-full overflow-hidden">

            {/* ── ILLUSTRATION AREA ── */}
            <div className="flex-1 relative flex items-end justify-center">

                {/* Back arrow */}
                {slide > 0 && (
                    <button
                        onClick={() => setSlide(slide - 1)}
                        className="absolute top-5 left-5 w-9 h-9 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center z-10"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5">
                            <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
                        </svg>
                    </button>
                )}

                {/* Illustration */}
                <div className="w-full max-w-sm mx-auto px-6 pb-0">
                    <Illustration />
                </div>

                {/* Fade from illustration into white bottom */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                    style={{ background: "linear-gradient(to bottom, transparent, #ffffff)" }}
                />
            </div>

            {/* ── BOTTOM CONTENT ── */}
            <div className="bg-white px-8 pt-4 pb-8 flex flex-col gap-5" style={{ minHeight: "40%" }}>
                {/* Title */}
                <h2 className="text-[28px] font-black text-gray-900 leading-tight text-center whitespace-pre-line">
                    {SLIDES[slide].title}
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-500 text-center leading-relaxed -mt-1">
                    {SLIDES[slide].desc}
                </p>

                {/* Dots */}
                <div className="flex justify-center gap-2">
                    {SLIDES.map((_, i) => (
                        <div
                            key={i}
                            className="rounded-full transition-all duration-300"
                            style={{
                                width:  i === slide ? 24 : 8,
                                height: 8,
                                background: i === slide ? "#7C3AED" : "#DDD6FE",
                            }}
                        />
                    ))}
                </div>

                {/* Next button */}
                <button
                    onClick={handleNext}
                    className="w-full max-w-xs mx-auto h-10 bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-[0.98] text-white font-extrabold rounded-lg text-base transition-all shadow-lg shadow-violet-200"
                >
                    {slide < SLIDES.length - 1 ? "Next" : "Get Started"}
                </button>

                {/* Skip */}
                <button
                    onClick={handleSkip}
                    className="text-center text-sm text-gray-400 hover:text-gray-600 transition -mt-1"
                >
                    Skip
                </button>
            </div>
        </div>
        </div>
    );
}
