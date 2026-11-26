"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AlertTriangle, ArrowRight, RefreshCw, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import TravelerBottomNav from "@/components/TravelerBottomNav";
import ProtectedRoute from "@/utils/ProtectedRoute";
import TripCard from "@/components/BookTrips/BookingTripCard";

const TAB_LABELS = ["Upcoming", "Completed", "Cancelled"];

const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse shadow-sm">
        <div className="flex justify-between gap-3 mb-4">
            <div className="space-y-2.5 flex-1">
                <div className="h-4 w-40 bg-gray-100 rounded" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
                <div className="h-3 w-28 bg-gray-100 rounded" />
            </div>
            <div className="h-6 w-16 bg-violet-100 rounded-full" />
        </div>
        <div className="h-10 bg-violet-50 rounded-xl" />
    </div>
);

const TravelerTripsPage = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("Upcoming");
    const [allTrips, setAllTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelMsg, setCancelMsg] = useState({ id: null, type: "", text: "" });

    const fetchTrips = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`/api/bookings`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) setAllTrips(data.data);
            else throw new Error(data.error || "Failed to fetch trips");
        } catch (err) {
            setError("Could not load your trips. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchTrips(); }, [fetchTrips]);

    const cancelTrip = async (bookingId) => {
        setCancelMsg({ id: bookingId, type: "loading", text: "Cancelling..." });
        try {
            const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) {
                setCancelMsg({ id: bookingId, type: "error", text: "Failed to cancel. Please try again." });
            } else {
                setCancelMsg({ id: bookingId, type: "success", text: "Ride cancelled successfully." });
                setAllTrips(prev => prev.map(t => t._id === bookingId ? { ...t, status: "Cancelled" } : t));
                setTimeout(() => setCancelMsg({ id: null, type: "", text: "" }), 3000);
            }
        } catch {
            setCancelMsg({ id: bookingId, type: "error", text: "Network error. Please try again." });
        }
    };

    const groupedTrips = useMemo(() => allTrips.reduce((acc, t) => {
        const label = t.status === "Active" ? "Upcoming" : t.status;
        acc[label] = acc[label] || [];
        acc[label].push(t);
        return acc;
    }, { Upcoming: [], Completed: [], Cancelled: [] }), [allTrips]);

    const tripsToDisplay = groupedTrips[activeTab] || [];

    return (
        <ProtectedRoute>
            <div className="min-h-screen md:min-h-[calc(100vh-56px)] bg-[#F5F3FF]">

                {/* ── Header ── */}
                <div className="bg-white sticky top-0 md:top-14 z-20" style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4">

                        {/* Title row */}
                        <div className="flex items-center gap-3 py-4">
                            <button
                                onClick={() => router.back()}
                                className="w-8 h-8 flex items-center justify-center"
                            >
                                <ArrowLeft size={20} className="text-gray-800" />
                            </button>
                            <h1 className="text-lg font-extrabold text-gray-900 flex-1">My Bookings</h1>
                            <button
                                onClick={fetchTrips}
                                disabled={isLoading}
                                className="w-8 h-8 flex items-center justify-center"
                            >
                                <RefreshCw size={16} className={`text-gray-400 ${isLoading ? "animate-spin" : ""}`} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex -mb-px">
                            {TAB_LABELS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 pb-3 text-sm font-semibold transition-all border-b-2 ${
                                        activeTab === tab
                                            ? "border-[#7C3AED] text-[#7C3AED]"
                                            : "border-transparent text-gray-400"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 py-4 space-y-3 pb-24">

                    {cancelMsg.text && (
                        <div className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-medium ${
                            cancelMsg.type === "success" ? "bg-green-50 border-green-200 text-green-700"
                            : cancelMsg.type === "error"   ? "bg-red-50 border-red-200 text-red-700"
                            : "bg-violet-50 border-violet-200 text-violet-600"
                        }`}>
                            {cancelMsg.type === "success" ? "✓" : cancelMsg.type === "error" ? "✗" : "⋯"} {cancelMsg.text}
                        </div>
                    )}

                    {isLoading && [1, 2, 3].map(i => <SkeletonCard key={i} />)}

                    {!isLoading && error && (
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                            <button
                                onClick={fetchTrips}
                                className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline flex-shrink-0 ml-3"
                            >
                                <RefreshCw size={12} /> Retry
                            </button>
                        </div>
                    )}

                    {!isLoading && !error && tripsToDisplay.map(trip => (
                        <TripCard key={trip.id} trip={trip} onCancelTrip={cancelTrip} />
                    ))}

                    {!isLoading && !error && tripsToDisplay.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl border border-violet-100 flex items-center justify-center mb-4 shadow-sm">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5" opacity="0.5">
                                    <rect x="2" y="8" width="20" height="10" rx="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M2 11l3-5h14l3 5"/>
                                </svg>
                            </div>
                            <p className="text-sm font-bold text-gray-700 mb-1">No {activeTab.toLowerCase()} trips</p>
                            <p className="text-xs text-gray-400 mb-5">
                                {activeTab === "Upcoming"
                                    ? "Book a ride to get started"
                                    : `Your ${activeTab.toLowerCase()} trips will appear here`}
                            </p>
                            {activeTab === "Upcoming" && (
                                <button
                                    onClick={() => router.push("/traveler-dashboard")}
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-violet-200"
                                >
                                    Find a Ride <ArrowRight size={13} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <TravelerBottomNav />
            </div>
        </ProtectedRoute>
    );
};

export default TravelerTripsPage;
