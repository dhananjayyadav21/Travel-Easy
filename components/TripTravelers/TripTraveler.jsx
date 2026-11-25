"use client";

import React, { useState, useEffect } from "react";
import { Loader2, AlertTriangle, Users } from "lucide-react";

const statusConfig = {
    Active: "bg-green-100 text-green-700 border border-green-200",
    Completed: "bg-slate-100 text-slate-600 border border-slate-200",
    Cancelled: "bg-red-100 text-red-600 border border-red-200",
};

const getInitials = (name = "") =>
    name
        .trim()
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() || "")
        .join("");

export default function TripBookingsTable({ tripId }) {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/bookingsfortrip?tripId=${tripId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message || "Failed to fetch bookings");
            setBookings(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [tripId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl border border-[#E9EBEF]">
                <Loader2 size={24} className="animate-spin text-[#FF6B35] mb-2" />
                <p className="text-sm text-[#737985]">Loading passengers…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl border border-[#E9EBEF]">
                <AlertTriangle size={24} className="text-[#E5484D] mb-2" />
                <p className="text-sm text-[#737985]">{error}</p>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl border border-[#E9EBEF]">
                <div className="w-12 h-12 bg-[#F8F9FB] rounded-full flex items-center justify-center mb-3">
                    <Users size={22} className="text-[#737985]" />
                </div>
                <p className="text-sm font-semibold text-[#171A21]">No bookings yet</p>
                <p className="text-xs text-[#737985] mt-1">Travelers will appear here once they book</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {bookings.map((b) => {
                const initials = getInitials(b.travelerName);
                const statusClass = statusConfig[b.status] || "bg-slate-100 text-slate-600 border border-slate-200";
                const fare = b.totalPrice
                    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(b.totalPrice)
                    : "—";

                return (
                    <div
                        key={b._id}
                        className="bg-white rounded-xl border border-[#E9EBEF] p-4 flex items-center gap-4"
                    >
                        {/* Avatar */}
                        <div className="w-11 h-11 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-white">{initials || "?"}</span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <p className="font-semibold text-[#171A21] truncate">{b.travelerName}</p>
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${statusClass}`}>
                                    {b.status}
                                </span>
                            </div>
                            <p className="text-xs text-[#737985] mt-0.5">{b.travelerNumber}</p>
                            <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-xs text-[#737985]">
                                    {b.numberOfSeats} seat{b.numberOfSeats !== 1 ? "s" : ""}
                                </span>
                                <span className="text-xs font-bold text-[#FF6B35]">{fare}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
