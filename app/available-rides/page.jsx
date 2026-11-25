"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, SlidersHorizontal, ChevronDown, Search, X } from "lucide-react";
import RoleRoute from "@/utils/RoleRoute";
import TravelerBottomNav from "@/components/TravelerBottomNav";

/* ── Trip card (inline, no booking context needed) ── */
import { Star, Clock, MapPin } from "lucide-react";

function RideCard({ trip }) {
    const router = useRouter();

    const seatsLeft = (trip.seats || 0) - (trip.bookedseats || 0);
    if (seatsLeft <= 0) return null;

    const pricePerKm = parseInt(process.env.NEXT_PUBLIC_PRICE_PER_KM_SINGLESEAT || "8");
    const totalPrice = parseInt(trip.kilometer || 0) * pricePerKm;
    const driverName = trip.providerName || trip.provider?.name || "Driver";
    const driverInitial = driverName.charAt(0).toUpperCase();
    const driverPhoto = trip.provider?.profilePhoto || null;
    const rating = trip.provider?.avgRating ? trip.provider.avgRating.toFixed(1) : "4.8";
    const ratingCount = trip.provider?.totalRatings || 0;

    const formatDate = (d) => {
        try {
            const date = new Date(d);
            const diff = Math.round((date - new Date()) / 86400000);
            if (diff === 0) return "Today";
            if (diff === 1) return "Tomorrow";
            return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        } catch { return d || "—"; }
    };

    const handleClick = () => {
        localStorage.setItem("selectedTrip", JSON.stringify(trip));
        router.push(`/booktrips/${trip._id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
        >
            <div className="flex items-stretch p-3 gap-3">
                {/* Car image */}
                <div className="w-28 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden self-stretch min-h-[90px]">
                    <img
                        src="/images/car.png"
                        alt="Car"
                        className="w-full h-full object-contain p-2"
                        onError={e => {
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.5" opacity="0.4"><rect x="2" y="8" width="20" height="10" rx="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M2 11l3-5h14l3 5"/></svg>`;
                        }}
                    />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between">
                    {/* Route + seats */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
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
                        <span className="bg-[#7C3AED] text-white text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                            {seatsLeft} Seats
                        </span>
                    </div>

                    {/* Price */}
                    <div className="mb-1">
                        <span className="text-[22px] font-extrabold text-[#7C3AED] leading-none">
                            ₹{totalPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-gray-400 ml-0.5">/seat</span>
                    </div>

                    {/* Time + date + km */}
                    <div className="flex items-center gap-1.5 mb-2">
                        <Clock size={11} className="text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-500">
                            {trip.time || "—"} • {formatDate(trip.date)}
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
                                <span className="text-[10px] text-gray-400">
                                    ({ratingCount > 999 ? (ratingCount / 1000).toFixed(1) + "k" : ratingCount})
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {trip.meetPlace && (
                <div className="border-t border-gray-100 px-3 py-2 flex items-center gap-1.5 bg-gray-50/50">
                    <MapPin size={10} className="text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-400 truncate">{trip.meetPlace}</span>
                </div>
            )}
        </div>
    );
}

/* ── Sort options ── */
const SORT_OPTIONS = [
    { label: "Earliest",   value: "earliest" },
    { label: "Cheapest",   value: "cheapest" },
    { label: "Most Seats", value: "seats"    },
];

function sortTrips(trips, sort) {
    const pricePerKm = parseInt(process.env.NEXT_PUBLIC_PRICE_PER_KM_SINGLESEAT || "8");
    const copy = [...trips];
    if (sort === "cheapest") {
        return copy.sort((a, b) => (a.kilometer || 0) * pricePerKm - (b.kilometer || 0) * pricePerKm);
    }
    if (sort === "seats") {
        return copy.sort((a, b) => ((b.seats || 0) - (b.bookedseats || 0)) - ((a.seats || 0) - (a.bookedseats || 0)));
    }
    // earliest — by date + time
    return copy.sort((a, b) => {
        const da = new Date(`${a.date || ""}T${a.time || "00:00"}`);
        const db = new Date(`${b.date || ""}T${b.time || "00:00"}`);
        return da - db;
    });
}

/* ── Main page content ── */
function AvailableRidesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initFrom = searchParams.get("from") || "";
    const initTo   = searchParams.get("to")   || "";

    const [from, setFrom]         = useState(initFrom);
    const [to, setTo]             = useState(initTo);
    const [trips, setTrips]       = useState([]);
    const [loading, setLoading]   = useState(true);
    const [sort, setSort]         = useState("earliest");
    const [showSort, setShowSort] = useState(false);
    const [token, setToken]       = useState(null);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    const fetchTrips = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch("/api/providertrips/all?status=Active", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setTrips(data.trips || []);
        } catch {
            setTrips([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchTrips(); }, [fetchTrips]);

    /* filter + sort */
    const filtered = sortTrips(
        trips.filter(t => {
            const srcMatch  = !from.trim() || (t.source      || "").toLowerCase().includes(from.trim().toLowerCase());
            const destMatch = !to.trim()   || (t.destination || "").toLowerCase().includes(to.trim().toLowerCase());
            return srcMatch && destMatch;
        }),
        sort
    );

    const handleSearch = () => fetchTrips();

    const activeSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label || "Earliest";

    return (
        <RoleRoute role="traveler">
            <div className="min-h-[calc(100vh-56px)] bg-[#F5F3FF]">

                {/* ── HEADER ── */}
                <div className="w-full bg-white border-b border-gray-100 sticky top-14 z-20 shadow-sm overflow-hidden">
                    <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 py-3 flex items-center gap-3">
                        <button
                            onClick={() => router.push("/traveler-dashboard")}
                            className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition flex-shrink-0"
                        >
                            <ArrowLeft size={16} className="text-gray-600" />
                        </button>
                        <h1 className="text-base font-extrabold text-gray-900 flex-1">Available Rides</h1>
                        {!loading && (
                            <span className="text-xs font-semibold text-[#7C3AED] bg-violet-50 border border-violet-100 px-2.5 py-1 rounded-full">
                                {filtered.length} found
                            </span>
                        )}
                    </div>

                    {/* Inline search bar */}
                    <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 pb-3 flex gap-2 w-full">
                        <div className="flex-1 min-w-0 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 h-10 focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                            <input
                                value={from}
                                onChange={e => setFrom(e.target.value)}
                                placeholder="From"
                                className="flex-1 bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none min-w-0"
                                onKeyDown={e => e.key === "Enter" && handleSearch()}
                            />
                            {from && (
                                <button onClick={() => setFrom("")} className="flex-shrink-0">
                                    <X size={12} className="text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                        <div className="flex-1 min-w-0 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 h-10 focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] flex-shrink-0" />
                            <input
                                value={to}
                                onChange={e => setTo(e.target.value)}
                                placeholder="To"
                                className="flex-1 bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none min-w-0"
                                onKeyDown={e => e.key === "Enter" && handleSearch()}
                            />
                            {to && (
                                <button onClick={() => setTo("")} className="flex-shrink-0">
                                    <X size={12} className="text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={handleSearch}
                            className="w-10 h-10 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl flex items-center justify-center transition flex-shrink-0 shadow-sm shadow-violet-200"
                        >
                            <Search size={15} className="text-white" />
                        </button>
                    </div>

                    {/* Sort bar */}
                    <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 pb-3 flex items-center justify-between">
                        <div className="relative">
                            <button
                                onClick={() => setShowSort(v => !v)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#7C3AED] transition"
                            >
                                Sort by: <span className="text-[#7C3AED]">{activeSortLabel}</span>
                                <ChevronDown size={13} className={`transition-transform ${showSort ? "rotate-180" : ""}`} />
                            </button>
                            {showSort && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-30 w-36">
                                    {SORT_OPTIONS.map(o => (
                                        <button
                                            key={o.value}
                                            onClick={() => { setSort(o.value); setShowSort(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-xs font-medium transition ${sort === o.value ? "bg-violet-50 text-[#7C3AED] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                        >
                                            {o.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#7C3AED] transition">
                            <SlidersHorizontal size={13} /> Filter
                        </button>
                    </div>
                </div>

                {/* ── RIDE LIST ── */}
                <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 pt-4 pb-24 flex flex-col gap-3">
                    {loading ? (
                        /* skeleton */
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3 flex gap-3 animate-pulse">
                                <div className="w-28 h-24 bg-gray-100 rounded-2xl flex-shrink-0" />
                                <div className="flex-1 flex flex-col gap-2 py-1">
                                    <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                                    <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                                    <div className="h-6 bg-violet-50 rounded-full w-24 mt-1" />
                                    <div className="h-3 bg-gray-100 rounded-full w-2/3" />
                                </div>
                            </div>
                        ))
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 rounded-full bg-violet-50 flex items-center justify-center mb-4">
                                <Search size={28} className="text-violet-300" />
                            </div>
                            <p className="text-gray-700 font-bold text-base mb-1">No rides found</p>
                            <p className="text-gray-400 text-sm mb-6">
                                {from || to ? "Try different locations or clear the filters." : "No active rides available right now."}
                            </p>
                            <button
                                onClick={() => { setFrom(""); setTo(""); }}
                                className="px-5 py-2.5 bg-[#7C3AED] text-white text-sm font-semibold rounded-xl shadow-sm shadow-violet-200 hover:bg-[#6D28D9] transition"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        filtered.map(trip => <RideCard key={trip._id} trip={trip} />)
                    )}
                </div>

                <TravelerBottomNav />
            </div>
        </RoleRoute>
    );
}

/* ── Wrap in Suspense for useSearchParams ── */
export default function AvailableRides() {
    return (
        <Suspense fallback={
            <div className="min-h-[calc(100vh-56px)] bg-[#F5F3FF] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <AvailableRidesContent />
        </Suspense>
    );
}
