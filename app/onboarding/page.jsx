"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SLIDES = [
    {
        title: "Travel Together\nSave More",
        desc: "Book a seat and share your ride with others.",
        bg: "from-violet-100 to-purple-50",
        illustration: "people",
    },
    {
        title: "Safe & Affordable\nRides",
        desc: "Verified providers, live GPS tracking, just ₹8/km.",
        bg: "from-sky-50 to-violet-50",
        illustration: "shield",
    },
    {
        title: "Book in\nSeconds",
        desc: "Find a ride, pick your seat, pay on arrival.",
        bg: "from-emerald-50 to-violet-50",
        illustration: "booking",
    },
];

export default function Onboarding() {
    const [slide, setSlide] = useState(0);
    const router = useRouter();

    const handleNext = () => {
        if (slide < SLIDES.length - 1) setSlide(slide + 1);
        else router.push("/login");
    };
    const handleSkip = () => router.push("/login");

    return (
        <div className="min-h-screen h-screen bg-[#F5F3FF] flex flex-col max-w-sm mx-auto relative overflow-hidden">

            {/* Back arrow */}
            {slide > 0 && (
                <button
                    onClick={() => setSlide(slide - 1)}
                    className="absolute top-5 left-5 w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center z-10"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5">
                        <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
                    </svg>
                </button>
            )}

            {/* Illustration area */}
            <div className={`flex-1 flex items-center justify-center bg-gradient-to-br ${SLIDES[slide].bg} relative overflow-hidden`}>
                <div className="absolute w-72 h-72 bg-violet-200/40 rounded-full" />

                {slide === 0 && (
                    <div className="relative z-10 p-8">
                        <svg width="260" height="200" viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0" y="30" width="30" height="80" fill="#DDD6FE" opacity="0.5"/>
                            <rect x="220" y="20" width="40" height="90" fill="#DDD6FE" opacity="0.5"/>
                            <rect x="230" y="10" width="12" height="15" fill="#DDD6FE" opacity="0.5"/>
                            <path d="M60 110 L80 60 L180 60 L200 110Z" fill="#6C2BD9"/>
                            <rect x="85" y="68" width="38" height="35" rx="4" fill="#C4B5FD" opacity="0.9"/>
                            <rect x="135" y="68" width="38" height="35" rx="4" fill="#C4B5FD" opacity="0.9"/>
                            <circle cx="104" cy="75" r="10" fill="#FCD34D"/>
                            <circle cx="154" cy="75" r="10" fill="#FB923C"/>
                            <circle cx="174" cy="75" r="10" fill="#86EFAC"/>
                            <rect x="20" y="110" width="220" height="60" rx="12" fill="#7C3AED"/>
                            <rect x="22" y="128" width="20" height="12" rx="4" fill="#FEF08A"/>
                            <rect x="218" y="128" width="20" height="12" rx="4" fill="#FEF08A"/>
                            <circle cx="70" cy="168" r="22" fill="#1F2937"/>
                            <circle cx="70" cy="168" r="12" fill="#6B7280"/>
                            <circle cx="190" cy="168" r="22" fill="#1F2937"/>
                            <circle cx="190" cy="168" r="12" fill="#6B7280"/>
                        </svg>
                    </div>
                )}

                {slide === 1 && (
                    <div className="relative z-10 p-8">
                        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="100" cy="100" r="80" fill="#EDE9FE"/>
                            <path d="M100 30 L160 60 L160 110 C160 145 130 168 100 180 C70 168 40 145 40 110 L40 60 Z" fill="#7C3AED" opacity="0.9"/>
                            <path d="M80 105 L93 118 L125 86" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                )}

                {slide === 2 && (
                    <div className="relative z-10 p-8">
                        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="30" y="40" width="140" height="120" rx="16" fill="#EDE9FE"/>
                            <rect x="50" y="70" width="100" height="12" rx="6" fill="#7C3AED" opacity="0.3"/>
                            <rect x="50" y="92" width="70" height="10" rx="5" fill="#7C3AED" opacity="0.2"/>
                            <rect x="50" y="112" width="85" height="10" rx="5" fill="#7C3AED" opacity="0.2"/>
                            <circle cx="150" cy="145" r="30" fill="#7C3AED"/>
                            <path d="M140 145 L148 153 L163 138" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                )}
            </div>

            {/* Text + controls */}
            <div className="bg-white rounded-t-3xl px-8 pt-8 pb-10 shadow-lg">
                <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-3 leading-tight whitespace-pre-line">
                    {SLIDES[slide].title}
                </h2>
                <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
                    {SLIDES[slide].desc}
                </p>

                {/* Pagination dots */}
                <div className="flex justify-center gap-2 mb-8">
                    {SLIDES.map((_, i) => (
                        <div
                            key={i}
                            className={`rounded-full transition-all duration-300 ${
                                i === slide ? "w-6 h-2.5 bg-[#7C3AED]" : "w-2.5 h-2.5 bg-gray-200"
                            }`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    className="w-full h-14 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-2xl text-base transition-all shadow-lg shadow-violet-200 hover:shadow-xl hover:-translate-y-0.5 mb-4"
                >
                    {slide < SLIDES.length - 1 ? "Next" : "Get Started"}
                </button>

                <button
                    onClick={handleSkip}
                    className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition py-1"
                >
                    Skip
                </button>
            </div>
        </div>
    );
}
