"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, XCircle, Loader2, ReceiptText, Car, Hash, ChevronRight, MapPin } from "lucide-react";
import RateTripModal from "@/components/RateTripModal";

const STATUS_CONFIG = {
    Active:    { label: "On Going",  bg: "bg-green-100",  text: "text-green-700"  },
    Completed: { label: "Completed", bg: "bg-violet-100", text: "text-violet-700" },
    Cancelled: { label: "Cancelled", bg: "bg-red-100",    text: "text-red-600"    },
};

const ReceiptRow = ({ label, value, highlight }) => (
    <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{label}</span>
        <span className={highlight ? "font-extrabold text-[#7C3AED] text-base" : "text-sm font-semibold text-gray-800"}>{value}</span>
    </div>
);

export default function TripCard({ trip, onCancelTrip }) {
    const [isCancelling, setIsCancelling]   = useState(false);
    const [showReceipt, setShowReceipt]     = useState(false);
    const [showRateModal, setShowRateModal] = useState(false);
    const [hasRated, setHasRated]           = useState(trip.hasRated || false);

    const isActive    = trip.status === "Active";
    const isCompleted = trip.status === "Completed";
    const isCancelled = trip.status === "Cancelled";
    const cfg = STATUS_CONFIG[trip.status] || STATUS_CONFIG.Cancelled;

    const handleCancel = async () => {
        setIsCancelling(true);
        try { await onCancelTrip(trip.id); } catch { }
        finally { setIsCancelling(false); }
    };

    const formatDate = (d) => {
        if (!d) return "—";
        try {
            const date = new Date(d);
            const diff = Math.round((date - new Date()) / 86400000);
            if (diff === 0) return "Today";
            if (diff === -1) return "Yesterday";
            if (diff === 1) return "Tomorrow";
            return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        } catch { return d; }
    };

    return (
        <div className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-all ${isCancelled ? "opacity-70" : ""}`}
             style={{ border: '1px solid #f3f4f6' }}>
            <div className="p-4">

                {/* Row 1: Route + status */}
                <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <span className="text-base font-extrabold text-gray-900 truncate">{trip.source}</span>
                            <ArrowRight size={14} className="text-gray-400 flex-shrink-0" />
                            <span className="text-base font-extrabold text-gray-900 truncate">{trip.destination}</span>
                        </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${cfg.bg} ${cfg.text}`}>
                        {cfg.label}
                    </span>
                </div>

                {/* Date */}
                <p className="text-sm text-gray-600 mb-0.5">
                    {formatDate(trip.date)}{trip.time ? `, ${trip.time}` : ""}
                </p>

                {/* Seats · price */}
                <p className="text-sm text-gray-600 mb-4">
                    {trip.seats} Seat{trip.seats > 1 ? "s" : ""} · ₹{trip.price?.toLocaleString("en-IN")}
                </p>

                {/* Action buttons */}
                {isActive && (
                    <div className="flex gap-2">
                        <Link
                            href={`/tracking/${trip.tripId || trip.id}`}
                            className="h-11 bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#7C3AED] hover:text-[#6D28D9] font-bold rounded-xl text-sm transition-all flex items-center justify-center"
                            style={{ flex: "0 0 90%" }}
                        >
                            Track Ride
                        </Link>
                        <button
                            onClick={handleCancel}
                            disabled={isCancelling}
                            className="h-11 bg-red-50 text-red-400 rounded-xl hover:bg-red-100 transition disabled:opacity-60 flex items-center justify-center"
                            style={{ flex: "0 0 calc(10% - 8px)" }}
                        >
                            {isCancelling ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={16} />}
                        </button>
                    </div>
                )}

                {isCompleted && !hasRated && (
                    <button
                        onClick={() => setShowRateModal(true)}
                        className="w-full h-11 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-sm shadow-violet-200"
                    >
                        <Star size={13} className="fill-white" /> Rate Your Ride
                    </button>
                )}

                {isCompleted && hasRated && (
                    <div className="flex items-center justify-center gap-1 py-2.5 bg-amber-50 rounded-xl border border-amber-100">
                        {[1,2,3,4,5].map(s => <Star key={s} size={15} className="text-amber-400 fill-amber-400" />)}
                        <span className="text-xs text-gray-500 ml-1 font-medium">Rated</span>
                    </div>
                )}

                {isCancelled && (
                    <div className="flex items-center justify-center gap-2 py-2.5 bg-red-50 rounded-xl">
                        <XCircle size={13} className="text-red-400" />
                        <span className="text-xs font-bold text-red-400">Booking Cancelled</span>
                    </div>
                )}
            </div>

            {/* Receipt toggle — only for completed */}
            {isCompleted && (
                <div className="border-t border-gray-50 px-4 py-2 flex items-center justify-between bg-gray-50/50">
                    <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                        <Hash size={9} />{String(trip.id).slice(-8).toUpperCase()}
                    </span>
                    <button onClick={() => setShowReceipt(!showReceipt)} className="text-xs text-[#7C3AED] font-semibold hover:underline flex items-center gap-1">
                        <ReceiptText size={11} />
                        {showReceipt ? "Hide" : "Receipt"}
                        <ChevronRight size={11} className={`transition-transform ${showReceipt ? "rotate-90" : ""}`} />
                    </button>
                </div>
            )}

            {/* Receipt panel */}
            {isCompleted && showReceipt && (
                <div className="mx-4 mb-4 rounded-2xl border border-violet-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#2D1B69] to-[#7C3AED] px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-0.5">
                            <Car size={15} className="text-violet-300" />
                            <p className="text-white font-extrabold text-sm">Travel Easy Hai</p>
                        </div>
                        <p className="text-violet-200 text-xs font-medium tracking-widest">BOOKING RECEIPT</p>
                    </div>
                    <div className="relative bg-white">
                        <div className="absolute -left-2.5 top-0 w-5 h-5 bg-gray-100 rounded-full" />
                        <div className="absolute -right-2.5 top-0 w-5 h-5 bg-gray-100 rounded-full" />
                        <div className="border-t-2 border-dashed border-violet-100 mx-4" />
                    </div>
                    <div className="bg-white px-5 py-4 space-y-2.5">
                        <ReceiptRow label="From"  value={trip.source} />
                        <ReceiptRow label="To"    value={trip.destination} />
                        <ReceiptRow label="Date"  value={trip.date} />
                        {trip.contact && <ReceiptRow label="Provider Contact" value={trip.contact} />}
                        <div className="border-t border-dashed border-violet-100 pt-2.5 mt-2">
                            <ReceiptRow label="Total Fare" value={`₹${trip.price?.toLocaleString("en-IN")}`} highlight />
                        </div>
                        <p className="text-center text-xs text-gray-400 pt-1 border-t border-violet-50">
                            ID: ...{String(trip.id).slice(-8).toUpperCase()}
                        </p>
                    </div>
                </div>
            )}

            {showRateModal && (
                <RateTripModal bookingId={trip.id} onClose={() => setShowRateModal(false)} onSuccess={() => setHasRated(true)} />
            )}
        </div>
    );
}
