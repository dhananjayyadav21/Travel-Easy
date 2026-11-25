"use client";
import React, { useState, useEffect } from "react";
import {
    MapPin, Clock, Users, ChevronLeft,
    ChevronRight, Star, User, ArrowRight, XCircle, Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import InlineAlert from "@/components/InlineAlert";
import ProtectedRoute from "@/utils/ProtectedRoute";

const PRICE_PER_KM  = process.env.NEXT_PUBLIC_PRICE_PER_KM_SINGLESEAT || "8";
const PLATFORM_FEE  = 15;

const getInitials = (n) => n ? n.split(" ").map(x => x[0]).join("").toUpperCase().slice(0, 2) : "P";

/* ── SVG Seat (cushioned shape) ── */
function SvgSeat({ x, y, w, h, state, label, onClick, isDriver }) {
    const fill   = isDriver ? "#CBD5E1"
                 : state === "selected" ? "#5B21B6"
                 : state === "booked"   ? "#CBD5E1"
                 : "#4CAF50";
    const shadow = isDriver || state === "booked" ? "none"
                 : state === "selected" ? "#3730A3"
                 : "#2E7D32";
    const textC  = isDriver || state === "booked" ? "#94A3B8" : "#fff";
    const cursor = isDriver || state === "booked" ? "default" : "pointer";
    const hr = Math.round(w * 0.18); // headrest width margin
    const hh = Math.round(h * 0.22); // headrest height

    return (
        <g onClick={onClick} style={{ cursor }} className="transition-all">
            {/* Headrest */}
            <rect x={x + hr} y={y} width={w - hr * 2} height={hh + 4} rx={6} fill={fill} opacity={0.85} />
            {/* Main cushion */}
            <rect x={x} y={y + hh} width={w} height={h - hh} rx={10} fill={fill} />
            {/* Inner cushion highlight */}
            <rect x={x + 5} y={y + hh + 5} width={w - 10} height={h - hh - 10} rx={6}
                fill="white" opacity={isDriver || state === "booked" ? 0.08 : 0.15} />
            {/* Label */}
            {!isDriver && (
                <text x={x + w / 2} y={y + hh + (h - hh) / 2 + 4}
                    textAnchor="middle" fontSize="10" fontWeight="700"
                    fill={textC} style={{ userSelect: "none" }}>
                    {label}
                </text>
            )}
            {isDriver && (
                <>
                    <text x={x + w / 2} y={y + hh + (h - hh) / 2 - 2}
                        textAnchor="middle" fontSize="8" fontWeight="600"
                        fill={textC} style={{ userSelect: "none" }}>Driver</text>
                </>
            )}
        </g>
    );
}

/* ── Top-down car illustration with clickable seats ── */
function SeatDiagram({ totalSeats, bookedCount, selectedSeats, onToggle }) {
    const all = Array.from({ length: totalSeats }, (_, i) => ({
        label:      `Seat ${i + 1}`,
        isBooked:   i < bookedCount,
        isSelected: selectedSeats.includes(`Seat ${i + 1}`),
        num:        i + 1,
    }));

    const front    = all[0];          // front passenger
    const backAll  = all.slice(1);    // remaining seats
    // Split back seats into rows of max 3
    const backRows = [];
    for (let i = 0; i < backAll.length; i += 3)
        backRows.push(backAll.slice(i, i + 3));

    const seatState = (s) =>
        s.isBooked ? "booked" : s.isSelected ? "selected" : "available";

    // Dimensions
    const W   = 220;
    const sw  = 60, sh = 62;          // seat width/height
    const gap = 8;                     // gap between seats
    const bx  = 18, by = 52;          // body x/y start
    const bw  = W - 36;               // body width
    // Body height: enough for all rows + padding
    const rowsNeeded = 1 + backRows.length; // front row + back rows
    const bh = 32 + rowsNeeded * (sh + 14) + 32;
    const H   = by + bh + 50;         // total SVG height

    // Front row y
    const fy = by + 32;
    // Back rows y: starts after front row + gap
    const br0_y = fy + sh + 20;

    // Centre-align a row of N seats
    const rowX = (count) => {
        const total = count * sw + (count - 1) * gap;
        return (W - total) / 2;
    };

    return (
        <div className="flex flex-col items-center justify-center select-none h-full w-full">
            <svg width={W} viewBox={`0 0 ${W} ${H}`} style={{ height: "100%", maxHeight: "100%", maxWidth: "100%" }} preserveAspectRatio="xMidYMid meet">
                {/* ── CAR BODY ── */}
                {/* Hood */}
                <path d={`M ${bx+28},${by} Q ${W/2},${by-40} ${bx+bw-28},${by} L ${bx+bw},${by+10} Q ${W/2},${by-8} ${bx},${by+10} Z`} fill="#B8C0D8"/>
                {/* Windshield */}
                <path d={`M ${bx+36},${by+2} Q ${W/2},${by-4} ${bx+bw-36},${by+2} L ${bx+bw-18},${by+32} Q ${W/2},${by+18} ${bx+18},${by+32} Z`} fill="#C8D8F0" opacity="0.75"/>
                {/* Body */}
                <rect x={bx} y={by} width={bw} height={bh} rx={26} fill="#C8CCDF"/>
                {/* Interior */}
                <rect x={bx+10} y={by+14} width={bw-20} height={bh-28} rx={18} fill="#ECEFFE"/>
                {/* Rear window */}
                <path d={`M ${bx+22},${by+bh-34} Q ${W/2},${by+bh-14} ${bx+bw-22},${by+bh-34} L ${bx+bw-12},${by+bh-10} Q ${W/2},${by+bh+2} ${bx+12},${by+bh-10} Z`} fill="#C8D8F0" opacity="0.75"/>
                {/* Trunk */}
                <path d={`M ${bx+12},${by+bh-10} Q ${W/2},${by+bh+34} ${bx+bw-12},${by+bh-10} L ${bx+bw},${by+bh} Q ${W/2},${by+bh+46} ${bx},${by+bh} Z`} fill="#B8C0D8"/>
                {/* Mirrors */}
                <path d={`M ${bx},${by+48} L ${bx-13},${by+54} L ${bx-9},${by+70} L ${bx},${by+68} Z`} fill="#A8B0C8"/>
                <path d={`M ${bx+bw},${by+48} L ${bx+bw+13},${by+54} L ${bx+bw+9},${by+70} L ${bx+bw},${by+68} Z`} fill="#A8B0C8"/>
                {/* Center console */}
                <rect x={W/2-9} y={fy} width={18} height={sh+10} rx={5} fill="#B8C0D8" opacity="0.5"/>

                {/* ── DRIVER SEAT ── */}
                <SvgSeat x={bx+16} y={fy} w={sw} h={sh} state="booked" isDriver label="" onClick={() => {}}/>

                {/* ── FRONT PASSENGER ── */}
                {front && (
                    <SvgSeat
                        x={bx+bw-sw-16} y={fy} w={sw} h={sh}
                        state={seatState(front)} label="S1"
                        onClick={() => !front.isBooked && onToggle(front.label)}
                    />
                )}

                {/* ── BACK ROWS ── */}
                {backRows.map((row, ri) => {
                    const rx0 = rowX(row.length);
                    const ry  = br0_y + ri * (sh + 10);
                    return row.map((s, ci) => (
                        <SvgSeat
                            key={s.label}
                            x={rx0 + ci * (sw + gap)} y={ry} w={sw} h={sh}
                            state={seatState(s)} label={`S${s.num}`}
                            onClick={() => !s.isBooked && onToggle(s.label)}
                        />
                    ));
                })}
            </svg>

        </div>
    );
}

export default function BookTripPage() {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [tripData, setTripData]       = useState(null);
    const [tripId, setTripId]           = useState(null);
    const [source, setSource]           = useState("");
    const [destination, setDest]        = useState("");
    const [contact, setContact]         = useState("");
    const [kilometers, setKm]           = useState(0);
    const [date, setDate]               = useState("");
    const [time, setTime]               = useState("");
    const [meetPlace, setMeetPlace]     = useState("");
    const [vehicle, setVehicle]         = useState("");
    const [totalSeats, setTotalSeats]   = useState(0);
    const [bookedCount, setBookedCount] = useState(0);
    const [selectedSeats, setSel]       = useState([]);
    const [travelerName, setName]       = useState("");
    const [travelerNumber, setPhone]    = useState("");
    const [paymentMethod, setPay]       = useState("upi");
    const [submitting, setSubmitting]   = useState(false);
    const [bookingId, setBookingId]     = useState(null);
    const [bookError, setBookError]     = useState("");

    const seatCount   = selectedSeats.length;
    const pricePerSeat = parseFloat(kilometers) * parseFloat(PRICE_PER_KM);
    const totalFare   = pricePerSeat * seatCount;
    const grandTotal  = totalFare + (seatCount > 0 ? PLATFORM_FEE : 0);

    const formattedDate = date
        ? new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
        : "—";

    useEffect(() => {
        try {
            const t = JSON.parse(localStorage.getItem("selectedTrip") || "{}");
            if (!t._id) { router.push("/"); return; }
            setTripData(t);
            setTripId(t._id);
            setSource(t.source || "");
            setDest(t.destination || "");
            setKm(t.kilometer || 0);
            setDate(t.date || "");
            setTime(t.time || "");
            setContact(t.contact || "");
            setMeetPlace(t.meetPlace || "");
            setVehicle(t.vehicle || "");
            const total  = parseInt(t.seats) || 0;
            const booked = parseInt(t.bookedseats) || 0;
            setTotalSeats(total);
            setBookedCount(booked);
            // Pre-fill from localStorage first (instant)
            try {
                const u = JSON.parse(localStorage.getItem("user") || "{}");
                if (u.name)  setName(u.name);
                if (u.phone) setPhone(u.phone);
            } catch {}
            // Fetch latest profile to get phone if not in localStorage
            (async () => {
                try {
                    const token = localStorage.getItem("token");
                    const r = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
                    if (r.ok) {
                        const { user: u } = await r.json();
                        if (u.name)  setName(u.name);
                        if (u.phone) setPhone(u.phone);
                        const stored = JSON.parse(localStorage.getItem("user") || "{}");
                        localStorage.setItem("user", JSON.stringify({ ...stored, ...u }));
                    }
                } catch {}
            })();
        } catch { router.push("/"); }
    }, [router]);

    const toggleSeat = (label) =>
        setSel(prev => prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]);

    const submit = async () => {
        setBookError("");
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/bookTrip", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    trip: tripId, source, destination: destination, contact,
                    travelerName, travelerNumber,
                    seatsBooked: selectedSeats, numberOfSeats: seatCount,
                    kilometers, date, totalPrice: grandTotal,
                    ratePerKm: PRICE_PER_KM, paymentMethod,
                }),
            });
            const data = await res.json();
            if (res.ok) { setBookingId(data.booking?._id || null); setStep(4); }
            else setBookError(data.error || data.message || "Booking failed. Please try again.");
        } catch { setBookError("Network error. Please check your connection and try again."); }
        finally { setSubmitting(false); }
    };

    const STEP_TITLES = ["", "Select Seats", "Booking Summary", "Payment", ""];

    return (
        <ProtectedRoute>
        {/* Full-viewport, no scroll */}
        <div className="h-[calc(100vh-56px)] flex flex-col bg-[#F5F3FF] overflow-hidden">

            {/* ── STICKY HEADER ── */}
            {step < 4 && (
                <div className="bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
                    <div className="w-full md:w-3/5 lg:w-2/5 mx-auto flex items-center gap-3 px-4 py-3">
                        <button
                            onClick={() => step > 1 ? setStep(step - 1) : router.back()}
                            className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition flex-shrink-0"
                        >
                            <ChevronLeft size={18} className="text-gray-700" />
                        </button>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">{STEP_TITLES[step]}</p>
                            <div className="flex gap-1.5 mt-1">
                                {[1,2,3].map(s => (
                                    <div key={s} className={`h-1 rounded-full transition-all duration-300 ${s <= step ? "bg-[#7C3AED] w-6" : "bg-gray-200 w-4"}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ════ STEP 1 — SELECT SEATS ════ */}
            {step === 1 && (
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* All content constrained to phone width */}
                    <div className="w-full max-w-md mx-auto flex flex-col flex-1 overflow-hidden min-h-0 px-4">

                        {/* Route pill */}
                        <div className="flex-shrink-0 bg-white rounded-xl shadow-sm px-4 py-2.5 flex items-center gap-2 mt-3 mb-2">
                            <MapPin size={12} className="text-green-500 flex-shrink-0" />
                            <span className="text-sm font-bold text-gray-800 truncate">{source}</span>
                            <ArrowRight size={13} className="text-gray-400 flex-shrink-0" />
                            <MapPin size={12} className="text-[#7C3AED] flex-shrink-0" />
                            <span className="text-sm font-bold text-gray-800 truncate">{destination}</span>
                            <span className="ml-auto text-xs text-gray-400 font-medium whitespace-nowrap">{time}</span>
                        </div>

                        {/* Car diagram — directly on page bg */}
                        <div className="flex-1 flex items-center justify-center overflow-hidden min-h-0 py-4">
                            {totalSeats > 0 ? (
                                <SeatDiagram
                                    totalSeats={totalSeats}
                                    bookedCount={bookedCount}
                                    selectedSeats={selectedSeats}
                                    onToggle={toggleSeat}
                                />
                            ) : (
                                <p className="text-sm text-red-500 font-medium">This ride is fully booked.</p>
                            )}
                        </div>

                        {/* Legend */}
                        <div className="flex-shrink-0 flex items-center justify-center gap-5 pb-3">
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                                <span className="w-3 h-3 rounded-sm bg-[#22C55E]" /> Available
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                                <span className="w-3 h-3 rounded-sm bg-[#CBD5E1]" /> Booked
                            </span>
                        </div>

                        {/* CTA */}
                        <div className="flex-shrink-0 pb-4 text-center">
                            {bookError && <div className="mb-3 text-left"><InlineAlert message={bookError} onDismiss={() => setBookError("")} /></div>}
                            {seatCount > 0 && (
                                <div className="mb-3">
                                    <p className="text-sm font-bold text-gray-700">
                                        {seatCount} Seat{seatCount > 1 ? "s" : ""} Selected
                                    </p>
                                    <p className="text-2xl font-extrabold text-[#6C2BD9]">
                                        ₹{grandTotal.toLocaleString("en-IN")}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        ₹{totalFare.toLocaleString("en-IN")} to driver + ₹{PLATFORM_FEE} platform fee
                                    </p>
                                </div>
                            )}
                            <button
                                onClick={() => {
                                    if (!seatCount) { setBookError("Select at least one seat to continue."); return; }
                                    setBookError("");
                                    setStep(2);
                                }}
                                disabled={totalSeats === 0}
                                className="w-full py-3 bg-[#6C2BD9] hover:bg-[#5B21B6] disabled:opacity-40 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-violet-300/40 active:scale-[0.98]"
                            >
                                Confirm Seats
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ════ STEP 2 — BOOKING SUMMARY ════ */}
            {step === 2 && (
                <div className="flex-1 flex flex-col overflow-hidden bg-white">
                    <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-5 pt-4 pb-5 min-h-0">

                        {/* Car image — flex-1 so it fills available space */}
                        <div className="flex-1 flex items-center justify-center min-h-0">
                            <img
                                src="/images/car.png" alt="Car"
                                className="max-h-full w-auto object-contain"
                                style={{ maxHeight: "100%" }}
                                onError={e => {
                                    e.target.style.display = "none";
                                    e.target.parentElement.innerHTML = `<svg viewBox="0 0 260 100" width="240" fill="none"><rect x="18" y="45" width="224" height="40" rx="10" fill="#7C3AED" fill-opacity=".12"/><path d="M55 45 L72 18 Q84 8 100 7 L168 7 Q184 8 194 18 L208 45Z" fill="#7C3AED" fill-opacity=".12"/><circle cx="78" cy="85" r="13" fill="#7C3AED"/><circle cx="186" cy="85" r="13" fill="#7C3AED"/></svg>`;
                                }}
                            />
                        </div>

                        {/* Vehicle name */}
                        <div className="flex-shrink-0 mt-2 mb-3">
                            <p className="text-xl font-extrabold text-gray-900">{vehicle || "Car"}</p>
                        </div>

                        {/* Route + seats */}
                        <div className="flex-shrink-0 space-y-2 mb-6">
                            <div className="flex items-center gap-2">
                                <Clock size={15} className="text-[#7C3AED] flex-shrink-0" />
                                <span className="text-sm font-semibold text-gray-800">{source}</span>
                                <ArrowRight size={13} className="text-gray-400" />
                                <span className="text-sm font-semibold text-gray-800">{destination}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={15} className="text-[#7C3AED] flex-shrink-0" />
                                <span className="text-sm text-gray-500">
                                    {seatCount} Seat{seatCount > 1 ? "s" : ""} · {time}{kilometers ? ` · ${kilometers} km` : ""}
                                </span>
                            </div>
                            {meetPlace && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={15} className="text-[#7C3AED] flex-shrink-0" />
                                    <span className="text-sm text-gray-500">Meet at <span className="font-semibold text-gray-800">{meetPlace}</span></span>
                                </div>
                            )}
                        </div>

                        {/* Fare rows */}
                        <div className="flex-shrink-0">
                            {/* Fare breakdown header */}
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Price Breakdown</p>

                            <div className="flex justify-between py-2 items-start">
                                <div>
                                    <span className="text-sm text-gray-700 font-medium">Ride Fare</span>
                                    <span className="block text-xs text-gray-400">{seatCount} seat{seatCount > 1 ? "s" : ""} × {kilometers} km × ₹{PRICE_PER_KM}/km → Driver</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-800">₹{totalFare.toLocaleString("en-IN")}</span>
                            </div>

                            <div className="flex justify-between py-2 items-start">
                                <div>
                                    <span className="text-sm text-gray-700 font-medium">Platform Fee</span>
                                    <span className="block text-xs text-gray-400">One-time fee → TravelEasyHai</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-800">₹{PLATFORM_FEE}</span>
                            </div>

                            {/* Driver gets / Platform gets info bar */}
                            <div className="mt-1 mb-3 bg-violet-50 border border-violet-100 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3">
                                <div className="text-center flex-1">
                                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Driver gets</p>
                                    <p className="text-sm font-extrabold text-gray-900">₹{totalFare.toLocaleString("en-IN")}</p>
                                </div>
                                <div className="w-px h-8 bg-violet-200" />
                                <div className="text-center flex-1">
                                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Platform gets</p>
                                    <p className="text-sm font-extrabold text-gray-900">₹{PLATFORM_FEE}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-3 flex justify-between items-center mb-6">
                                <span className="text-base font-bold text-gray-900">Total</span>
                                <span className="text-base font-extrabold text-[#6C2BD9]">₹{grandTotal.toLocaleString("en-IN")}</span>
                            </div>

                            <button
                                onClick={() => setStep(3)}
                                className="w-full py-4 bg-[#6C2BD9] hover:bg-[#5B21B6] text-white font-bold rounded-full text-base transition-all shadow-lg shadow-violet-300/40 active:scale-[0.98]"
                            >
                                Proceed to Pay
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ════ STEP 3 — PAYMENT ════ */}
            {step === 3 && (
                <div className="flex-1 flex flex-col overflow-hidden bg-white">
                    <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-5 pt-6 pb-5 min-h-0">

                        {/* Payment options */}
                        <div className="flex-shrink-0 flex flex-col gap-2">
                            {[
                                { id: "upi",        label: "UPI (PhonePe, GPay)", icon: (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#6C2BD9" fillOpacity=".1"/><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#6C2BD9" fontWeight="bold">U</text></svg>
                                ), available: true  },
                                { id: "card",       label: "Cards", icon: (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#6C2BD9" fillOpacity=".1"/><rect x="4" y="8" width="16" height="11" rx="2" stroke="#6C2BD9" strokeWidth="1.5"/><path d="M4 11h16" stroke="#6C2BD9" strokeWidth="1.5"/></svg>
                                ), available: false },
                                { id: "wallet",     label: "Wallet (Paytm)", icon: (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#6C2BD9" fillOpacity=".1"/><rect x="3" y="7" width="18" height="12" rx="2" stroke="#6C2BD9" strokeWidth="1.5"/><circle cx="17" cy="13" r="1.5" fill="#6C2BD9"/></svg>
                                ), available: false },
                                { id: "netbanking", label: "Net Banking", icon: (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#6C2BD9" fillOpacity=".1"/><path d="M4 10l8-5 8 5" stroke="#6C2BD9" strokeWidth="1.5"/><rect x="6" y="10" width="3" height="6" fill="#6C2BD9" fillOpacity=".5"/><rect x="10.5" y="10" width="3" height="6" fill="#6C2BD9" fillOpacity=".5"/><rect x="15" y="10" width="3" height="6" fill="#6C2BD9" fillOpacity=".5"/><path d="M4 16h16" stroke="#6C2BD9" strokeWidth="1.5"/></svg>
                                ), available: false },
                            ].map((opt) => (
                                <div
                                    key={opt.id}
                                    onClick={() => opt.available && setPay(opt.id)}
                                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                                        paymentMethod === opt.id && opt.available
                                            ? "bg-violet-50 border border-violet-200"
                                            : "border border-transparent"
                                    } ${!opt.available ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}`}
                                >
                                    {/* Radio */}
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                        paymentMethod === opt.id && opt.available ? "border-[#6C2BD9]" : "border-gray-300"
                                    }`}>
                                        {paymentMethod === opt.id && opt.available && (
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#6C2BD9]" />
                                        )}
                                    </div>
                                    {/* Icon */}
                                    <div className="flex-shrink-0">{opt.icon}</div>
                                    {/* Label */}
                                    <span className={`flex-1 text-sm font-semibold ${opt.available ? "text-gray-900" : "text-gray-400"}`}>
                                        {opt.label}
                                    </span>
                                    {!opt.available && (
                                        <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">Soon</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Pay button + secure */}
                        <div className="flex-shrink-0 pt-4">
                            {bookError && <div className="mb-3"><InlineAlert message={bookError} onDismiss={() => setBookError("")} /></div>}
                            <button
                                onClick={submit}
                                disabled={submitting}
                                className="w-full py-4 bg-[#6C2BD9] hover:bg-[#5B21B6] disabled:opacity-60 text-white font-bold rounded-full text-base transition-all shadow-lg shadow-violet-300/40 active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {submitting
                                    ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Booking...</>
                                    : `Pay ₹${grandTotal.toLocaleString("en-IN")}`}
                            </button>
                            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-400">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                Secure Payment
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ════ STEP 4 — CONFIRMED ════ */}
            {step === 4 && (
                <div className="flex-1 flex flex-col bg-white overflow-hidden">
                    {/* Back arrow */}
                    <div className="px-5 pt-4 flex-shrink-0">
                        <button onClick={() => router.push("/travelertrips")} className="p-1">
                            <ChevronLeft size={22} className="text-gray-700" />
                        </button>
                    </div>

                    {/* Center content */}
                    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center relative overflow-hidden">

                        {/* Confetti — colorful tiny rectangles scattered */}
                        {[
                            { c:"#FF6B6B", top:"10%", left:"10%", w:8,  h:5,  r:30,  delay:0    },
                            { c:"#FFD93D", top:"8%",  left:"30%", w:5,  h:9,  r:60,  delay:0.1  },
                            { c:"#6BCB77", top:"12%", left:"55%", w:7,  h:4,  r:20,  delay:0.05 },
                            { c:"#4D96FF", top:"7%",  left:"75%", w:9,  h:5,  r:45,  delay:0.15 },
                            { c:"#FF6B6B", top:"15%", left:"88%", w:5,  h:8,  r:70,  delay:0.08 },
                            { c:"#FFD93D", top:"22%", left:"5%",  w:6,  h:6,  r:0,   delay:0.2  },
                            { c:"#9B5DE5", top:"25%", left:"92%", w:8,  h:4,  r:50,  delay:0.12 },
                            { c:"#00BBF9", top:"68%", left:"4%",  w:7,  h:5,  r:35,  delay:0.18 },
                            { c:"#FF6B6B", top:"72%", left:"88%", w:5,  h:9,  r:55,  delay:0.06 },
                            { c:"#6BCB77", top:"78%", left:"20%", w:9,  h:4,  r:25,  delay:0.14 },
                            { c:"#FFD93D", top:"75%", left:"70%", w:6,  h:7,  r:65,  delay:0.09 },
                            { c:"#4D96FF", top:"82%", left:"45%", w:8,  h:5,  r:40,  delay:0.16 },
                            { c:"#9B5DE5", top:"18%", left:"45%", w:5,  h:8,  r:15,  delay:0.07 },
                            { c:"#00BBF9", top:"30%", left:"80%", w:7,  h:4,  r:80,  delay:0.11 },
                        ].map((d, i) => (
                            <div key={i} className="absolute animate-bounce" style={{
                                top: d.top, left: d.left,
                                width: d.w, height: d.h,
                                backgroundColor: d.c,
                                borderRadius: 2,
                                transform: `rotate(${d.r}deg)`,
                                animationDelay: `${d.delay}s`,
                                animationDuration: "1.6s",
                            }} />
                        ))}

                        {/* Green checkmark circle */}
                        <div className="w-28 h-28 rounded-full bg-green-500 flex items-center justify-center mb-7 shadow-xl shadow-green-200/60 relative z-10">
                            <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
                                <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>

                        {/* Text */}
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-3 relative z-10">
                            Booking Confirmed!
                        </h2>
                        <p className="text-sm text-gray-500 mb-1 relative z-10">Your booking ID is</p>
                        <p className="text-lg font-extrabold text-gray-900 mb-10 relative z-10">
                            #{bookingId
                                ? bookingId.toString().slice(-10).toUpperCase()
                                : `TH${Date.now().toString().slice(-8)}`}
                        </p>

                        {/* Buttons */}
                        <div className="w-full max-w-xs relative z-10 flex flex-col gap-3">
                            <button
                                onClick={() => router.push("/travelertrips")}
                                className="w-full py-4 bg-[#6C2BD9] hover:bg-[#5B21B6] text-white font-bold rounded-full text-base transition-all shadow-lg shadow-violet-300/40 active:scale-[0.98]"
                            >
                                View Booking
                            </button>
                            <button
                                onClick={() => router.push("/traveler-dashboard")}
                                className="w-full py-3 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </ProtectedRoute>
    );
}
