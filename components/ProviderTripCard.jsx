"use client";
import Link from "next/link";
import { Calendar, Clock, Car, TrendingUp, ArrowRight } from "lucide-react";

const getStatusConfig = (status) => {
    const s = String(status).toLowerCase();
    switch (s) {
        case "active":
        case "confirmed":
            return { pill: "bg-green-50 text-green-700 border border-green-200", strip: "bg-gradient-to-r from-green-400 to-emerald-500", label: "Active" };
        case "completed":
        case "finished":
            return { pill: "bg-violet-50 text-violet-700 border border-violet-200", strip: "bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6]", label: "Completed" };
        case "cancelled":
        case "expired":
            return { pill: "bg-red-50 text-red-600 border border-red-200", strip: "bg-gradient-to-r from-red-400 to-rose-500", label: "Cancelled" };
        default:
            return { pill: "bg-gray-100 text-gray-500 border border-gray-200", strip: "bg-gray-300", label: "Draft" };
    }
};

const formatDate = (dateString) => {
    try {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    } catch {
        return dateString || "N/A";
    }
};

export default function TripCard({ trip }) {
    const cfg = getStatusConfig(trip.status);
    const pricePerKm = parseInt(process.env.NEXT_PUBLIC_PRICE_PER_KM_SINGLESEAT || "8");
    const pricePerSeat = trip.kilometer ? parseInt(trip.kilometer) * pricePerKm : null;
    const estimatedEarnings = pricePerSeat ? pricePerSeat * (trip.bookedseats || 0) : 0;
    const seatsTotal = trip.seats || 0;
    const seatsBooked = trip.bookedseats || 0;
    const seatsProgress = seatsTotal > 0 ? Math.round((seatsBooked / seatsTotal) * 100) : 0;
    const detailsLink = `/providertrips/${trip._id}`;

    const stripColor = trip.status?.toLowerCase() === "active" || trip.status?.toLowerCase() === "confirmed"
        ? "bg-green-500"
        : trip.status?.toLowerCase() === "completed" || trip.status?.toLowerCase() === "finished"
        ? "bg-[#7C3AED]"
        : "bg-red-400";

    return (
        <Link
            href={detailsLink}
            className="group block bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex"
        >
            {/* Left colored strip */}
            <div className={`w-1 flex-shrink-0 ${stripColor}`} />

            <div className="flex-1 p-4">
                {/* Route + status/earnings */}
                <div className="flex items-stretch justify-between gap-3">
                    {/* Vehicle icon + route */}
                    <div className="flex items-stretch gap-3 flex-1 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0 self-center">
                            <Car size={20} className="text-[#7C3AED]" />
                        </div>
                        <div className="flex-1 min-w-0 py-0.5">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                                <p className="text-sm font-bold text-gray-900 truncate">{trip.source || "—"}</p>
                            </div>
                            <div className="ml-[3px] w-px h-3 bg-gray-200" />
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 rounded-full bg-[#7C3AED] flex-shrink-0" />
                                <p className="text-sm font-bold text-gray-900 truncate">{trip.destination || "—"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Status + earnings */}
                    <div className="flex flex-col items-end justify-between flex-shrink-0 gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${cfg.pill}`}>
                            {cfg.label}
                        </span>
                        <div className="bg-violet-50 border border-violet-100 rounded-xl px-2.5 py-1.5 text-right">
                            <div className="flex items-center gap-1 justify-end">
                                <TrendingUp size={9} className="text-[#7C3AED]" />
                                <p className="text-sm font-extrabold text-[#7C3AED] leading-none">₹{estimatedEarnings.toLocaleString("en-IN")}</p>
                            </div>
                            <p className="text-[9px] text-gray-400 mt-0.5">earned</p>
                        </div>
                    </div>
                </div>

                {/* Info chips */}
                <div className="flex items-center gap-1.5 flex-wrap mt-3">
                    <span className="inline-flex items-center gap-1 bg-violet-50 border border-violet-100 rounded-lg px-2 py-1 text-xs text-violet-600">
                        <Calendar size={10} /> {formatDate(trip.date)}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-xs text-gray-500">
                        <Clock size={10} className="text-violet-400" /> {trip.time || "—"}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-xs text-gray-500">
                        <Car size={10} className="text-violet-400" /> {trip.vehicle || "Car"}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-violet-50 border border-violet-100 rounded-lg px-2 py-1 text-xs font-semibold text-violet-700 ml-auto">
                        {seatsBooked}/{seatsTotal} seats
                    </span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6]"
                        style={{ width: `${seatsProgress}%` }}
                    />
                </div>

                {/* Footer */}
                <div className="mt-3 pt-2.5 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs text-gray-400">{trip.kilometer} km · ₹{pricePerKm}/km</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#7C3AED] group-hover:text-[#6D28D9] transition-colors">
                        View Details <ArrowRight size={11} />
                    </span>
                </div>
            </div>
        </Link>
    );
}
