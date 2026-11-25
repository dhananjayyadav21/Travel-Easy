"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Star, Clock, MapPin } from "lucide-react";

const formatTime = (timeStr) => {
    if (!timeStr) return "—";
    return timeStr;
};

const formatDate = (dateString) => {
    try {
        if (!dateString) return "—";
        const d = new Date(dateString);
        const today = new Date();
        const diff = Math.round((d - today) / (1000 * 60 * 60 * 24));
        if (diff === 0) return "Today";
        if (diff === 1) return "Tomorrow";
        return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    } catch {
        return dateString || "—";
    }
};

export default function TripCard({ booking }) {
    const { trip } = booking;
    const router = useRouter();

    const seatsLeft = (trip.seats || 0) - (trip.bookedseats || 0);
    const pricePerKm = parseInt(process.env.NEXT_PUBLIC_PRICE_PER_KM_SINGLESEAT || "8");
    const totalPrice = parseInt(trip.kilometer || 0) * pricePerKm;
    const driverName = trip.provider?.name || trip.providerName || "Driver";
    const driverInitial = driverName.charAt(0).toUpperCase();
    const driverPhoto = trip.provider?.profilePhoto || null;
    const rating = trip.provider?.avgRating ? trip.provider.avgRating.toFixed(1) : "4.8";
    const ratingCount = trip.provider?.totalRatings || 0;

    const handleCardClick = () => {
        localStorage.setItem("selectedTrip", JSON.stringify(trip));
        router.push(`/booktrips/${trip._id}`);
    };

    if (seatsLeft === 0) return null;

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
        >
            <div className="flex items-stretch p-3 gap-3">

                {/* ── Car image ── */}
                <div className="w-28 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden self-stretch min-h-[90px]">
                    <img
                        src="/images/car.png"
                        alt={trip.vehicle || "Car"}
                        className="w-full h-full object-contain p-2"
                        onError={e => {
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.5" opacity="0.4"><rect x="2" y="8" width="20" height="10" rx="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M2 11l3-5h14l3 5"/></svg>`;
                        }}
                    />
                </div>

                {/* ── Info ── */}
                <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between">

                    {/* Top: seats badge + route */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                        {/* Route */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                                <p className="text-sm font-bold text-gray-900 truncate">{trip.source || "—"}</p>
                            </div>
                            <div className="ml-[3px] w-px h-3.5 bg-gray-200 my-0.5" />
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-[#7C3AED] flex-shrink-0" />
                                <p className="text-sm font-bold text-gray-900 truncate">{trip.destination || "—"}</p>
                            </div>
                        </div>
                        {/* Seats badge */}
                        <span className="bg-[#7C3AED] text-white text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                            {seatsLeft} Seats
                        </span>
                    </div>

                    {/* Price */}
                    <div className="mb-1">
                        <span className="text-[22px] font-extrabold text-[#7C3AED] leading-none">₹{totalPrice.toLocaleString("en-IN")}</span>
                        <span className="text-xs text-gray-400 ml-0.5">/seat</span>
                    </div>

                    {/* Time + date */}
                    <div className="flex items-center gap-1.5 mb-2">
                        <Clock size={11} className="text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-500">
                            {formatTime(trip.time)} • {formatDate(trip.date)}
                        </span>
                        {trip.kilometer && (
                            <span className="text-xs text-gray-400">• {trip.kilometer} km</span>
                        )}
                    </div>

                    {/* Driver row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 shadow-sm">
                                {driverPhoto ? (
                                    <img src={driverPhoto} alt={driverName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-white text-[9px] font-extrabold">
                                        {driverInitial}
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-gray-500 truncate max-w-[90px]">{driverName}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                            <Star size={11} className="text-amber-400 fill-amber-400" />
                            <span className="text-xs font-bold text-gray-700">{rating}</span>
                            {ratingCount > 0 && (
                                <span className="text-[10px] text-gray-400">({ratingCount > 999 ? (ratingCount / 1000).toFixed(1) + "k" : ratingCount})</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer: date + meet place */}
            {trip.meetPlace && (
                <div className="border-t border-gray-100 px-3 py-2 flex items-center gap-1.5 bg-gray-50/50">
                    <MapPin size={10} className="text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-400 truncate">{trip.meetPlace}</span>
                </div>
            )}
        </div>
    );
}
