"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, ChevronDown } from 'lucide-react';

export default function Homepage() {
    const router = useRouter();
    const [from, setFrom] = useState("");
    const [to,   setTo]   = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        try { const r = localStorage.getItem("user"); if (r) setUser(JSON.parse(r)); } catch {}
    }, []);

    const handleSearch = () => {
        const p = new URLSearchParams();
        if (from.trim()) p.set("from", from.trim());
        if (to.trim())   p.set("to",   to.trim());
        router.push(`/available-rides?${p.toString()}`);
    };

    return (
        <div className="flex flex-col bg-[#EDE9FE]" style={{ minHeight: 'calc(100vh - 56px)' }}>
            <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 pt-5 pb-24">

                {/* ── TOP BAR ── */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                            {user?.profilePhoto ? (
                                <img src={user.profilePhoto} className="w-full h-full object-cover rounded-full" alt="" />
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                                </svg>
                            )}
                        </div>
                        <button className="flex items-center gap-1">
                            <span className="text-base font-bold text-gray-900">
                                {user?.name?.split(" ")[0] || "TravelEasyHai"}
                            </span>
                            <ChevronDown size={15} className="text-gray-500" strokeWidth={2.5}/>
                        </button>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm relative">
                        <Bell size={18} className="text-[#7C3AED]" strokeWidth={2}/>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#EDE9FE]"/>
                    </button>
                </div>

                {/* ── HERO BANNER — grows to fill remaining space ── */}
                <div
                    className="relative overflow-hidden px-6 pt-7 mb-4 flex-1"
                    style={{
                        background: "linear-gradient(135deg,#5B21B6 0%,#7C3AED 55%,#8B5CF6 100%)",
                        minHeight: "180px",
                        borderRadius: "16px",
                    }}
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"/>

                    {/* Text — left half */}
                    <div className="relative z-10 max-w-[48%]">
                        <p className="text-white font-extrabold text-[20px] leading-snug">
                            Share Your Ride<br/>Save Up to 60%
                        </p>
                    </div>

                    {/* Flat white car SVG — right side */}
                    <svg
                        viewBox="0 0 320 160"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute right-0 bottom-0 w-[62%]"
                        style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.2))' }}
                    >
                        {/* Shadow under car */}
                        <ellipse cx="160" cy="150" rx="110" ry="7" fill="black" fillOpacity="0.15"/>
                        {/* Body */}
                        <rect x="20" y="88" width="280" height="50" rx="12" fill="white" fillOpacity="0.95"/>
                        {/* Cabin */}
                        <path d="M68 88 L90 44 Q102 28 122 26 L200 26 Q220 28 232 44 L254 88Z" fill="white"/>
                        {/* Windows */}
                        <rect x="96" y="34" width="54" height="38" rx="5" fill="#C4B5FD" fillOpacity="0.6"/>
                        <rect x="160" y="34" width="54" height="38" rx="5" fill="#C4B5FD" fillOpacity="0.6"/>
                        <line x1="156" y1="34" x2="156" y2="72" stroke="white" strokeWidth="2.5" strokeOpacity="0.5"/>
                        {/* Rear light */}
                        <rect x="24" y="96" width="12" height="9" rx="3" fill="#FCA5A5" fillOpacity="0.95"/>
                        {/* Front light */}
                        <rect x="284" y="96" width="12" height="9" rx="3" fill="#FDE68A" fillOpacity="0.95"/>
                        {/* Door line */}
                        <line x1="160" y1="88" x2="160" y2="138" stroke="#E5E7EB" strokeWidth="1" strokeOpacity="0.3"/>
                        {/* Rear wheel */}
                        <circle cx="90"  cy="136" r="20" fill="#5B21B6"/>
                        <circle cx="90"  cy="136" r="12" fill="#7C3AED" fillOpacity="0.45"/>
                        <circle cx="90"  cy="136" r="5"  fill="white" fillOpacity="0.55"/>
                        {/* Front wheel */}
                        <circle cx="232" cy="136" r="20" fill="#5B21B6"/>
                        <circle cx="232" cy="136" r="12" fill="#7C3AED" fillOpacity="0.45"/>
                        <circle cx="232" cy="136" r="5"  fill="white" fillOpacity="0.55"/>
                    </svg>
                </div>

                {/* ── SEARCH CARD ── */}
                <div className="bg-white shadow-sm mb-4 overflow-hidden flex-shrink-0" style={{ borderRadius: "16px" }}>

                    {/* FROM */}
                    <div className="flex items-center gap-4 px-5 pt-5 pb-4">
                        <div className="w-6 h-6 rounded-full border-2 border-[#7C3AED] bg-white flex items-center justify-center flex-shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]"/>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-400 mb-0.5">From</p>
                            <input
                                value={from}
                                onChange={e => setFrom(e.target.value)}
                                placeholder="Your Location"
                                className="w-full text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
                                onKeyDown={e => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                    </div>

                    {/* Dotted connector */}
                    <div className="flex items-center px-5">
                        <div className="w-6 flex justify-center flex-shrink-0">
                            <div className="flex flex-col gap-[3px]">
                                <span className="block w-[2px] h-[4px] bg-gray-300 rounded-full mx-auto"/>
                                <span className="block w-[2px] h-[4px] bg-gray-300 rounded-full mx-auto"/>
                                <span className="block w-[2px] h-[4px] bg-gray-300 rounded-full mx-auto"/>
                            </div>
                        </div>
                        <div className="flex-1 h-px bg-gray-100 ml-4"/>
                    </div>

                    {/* TO */}
                    <div className="flex items-center gap-4 px-5 pt-4 pb-5">
                        <div className="w-6 h-6 rounded-full bg-[#7C3AED] flex items-center justify-center flex-shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-white"/>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-400 mb-0.5">To</p>
                            <input
                                value={to}
                                onChange={e => setTo(e.target.value)}
                                placeholder="Destination"
                                className="w-full text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
                                onKeyDown={e => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                    </div>
                </div>

                {/* ── SEARCH BUTTON ── */}
                <button
                    onClick={handleSearch}
                    className="w-full bg-[#5B21B6] hover:bg-[#4C1D95] active:scale-[0.98] text-white font-bold text-base transition-all flex-shrink-0"
                    style={{ height: "56px", borderRadius: "16px" }}
                >
                    Search Rides
                </button>

            </div>
        </div>
    );
}
