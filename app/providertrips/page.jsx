"use client";

import { useEffect, useState } from "react";
import TripCard from "@/components/ProviderTripCard";
import { AlertTriangle, BusFront, XCircle, Plus, RefreshCw, Clock, ArrowLeft } from "lucide-react";
import ProtectedRoute from "@/utils/ProtectedRoute";
import ProviderBottomNav from "@/components/ProviderBottomNav";
import Link from "next/link";

const tripStatuses = [
    { key: "Active", label: "Active", icon: BusFront },
    { key: "Completed", label: "Completed", icon: Clock },
    { key: "Cancelled", label: "Cancelled", icon: XCircle },
];

const useFetchProviderTrips = (status) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTrips = async (currentStatus) => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication required. Please sign in.");
                setIsLoading(false);
                return;
            }
            const res = await fetch(`/api/providertrips/my?status=${currentStatus}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const responseData = await res.json();
            if (!res.ok) throw new Error(responseData.message || `Failed to fetch ${currentStatus} trips.`);
            if (responseData.trips && Array.isArray(responseData.trips)) {
                localStorage.setItem("trips", JSON.stringify(responseData.trips));
                setData(responseData.trips);
            } else {
                setData([]);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || "An unknown error occurred while loading trips.");
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchTrips(status); }, [status]);
    const refetch = () => fetchTrips(status);
    return { data, isLoading, error, refetch };
};

const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-violet-50 p-4 animate-pulse">
        <div className="flex justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 flex-1">
                <div className="flex flex-col gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-violet-100" />
                    <div className="w-px h-4 bg-violet-50" />
                    <div className="w-2 h-2 rounded-full bg-violet-100" />
                </div>
                <div className="space-y-2 flex-1">
                    <div className="h-3.5 w-28 bg-gray-100 rounded" />
                    <div className="h-3 w-16 bg-gray-100 rounded" />
                    <div className="h-3.5 w-24 bg-gray-100 rounded" />
                </div>
            </div>
            <div className="text-right space-y-1.5">
                <div className="h-5 w-16 bg-violet-100 rounded-full ml-auto" />
                <div className="h-5 w-14 bg-gray-100 rounded ml-auto" />
            </div>
        </div>
        <div className="flex gap-3 pt-2 border-t border-gray-50">
            <div className="h-3 w-16 bg-gray-100 rounded" />
            <div className="h-3 w-14 bg-gray-100 rounded" />
            <div className="h-3 w-10 bg-violet-100 rounded ml-auto" />
        </div>
        <div className="mt-2 h-1 bg-violet-50 rounded-full" />
    </div>
);

import { useRouter } from "next/navigation";

export default function ProviderTrips() {
    const router = useRouter();
    const [activeStatus, setActiveStatus] = useState(tripStatuses[0].key);
    const { data: trips, isLoading, error, refetch } = useFetchProviderTrips(activeStatus);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#F5F3FF]">

                {/* ── Header ── */}
                <div className="bg-white sticky top-0 md:top-14 z-30 border-b border-gray-100 shadow-sm">
                    <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4">

                        {/* Title row */}
                        <div className="flex items-center justify-between py-3.5">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => router.back()}
                                    className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition"
                                >
                                    <ArrowLeft size={16} className="text-gray-600" />
                                </button>
                                <h1 className="text-base font-extrabold text-gray-900">My Rides</h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={refetch}
                                    disabled={isLoading}
                                    className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50"
                                >
                                    <RefreshCw size={14} className={`text-gray-500 ${isLoading ? "animate-spin" : ""}`} />
                                </button>
                                <Link
                                    href="/provider-dashboard/create"
                                    className="h-9 px-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm rounded-xl flex items-center gap-1.5 transition shadow-sm shadow-violet-200"
                                >
                                    <Plus size={14} /> New Ride
                                </Link>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex -mb-px">
                            {tripStatuses.map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveStatus(key)}
                                    className={`flex-1 pb-3 pt-1 text-sm font-semibold transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                                        activeStatus === key
                                            ? "border-[#7C3AED] text-[#7C3AED]"
                                            : "border-transparent text-gray-400 hover:text-gray-600"
                                    }`}
                                >
                                    {label}
                                    {!isLoading && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                                            activeStatus === key ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-500"
                                        }`}>
                                            {trips.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 py-4 space-y-3 pb-24">

                    {isLoading && (
                        <div className="space-y-3">
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                            <button
                                onClick={refetch}
                                className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline flex-shrink-0 ml-3"
                            >
                                <RefreshCw size={12} /> Retry
                            </button>
                        </div>
                    )}

                    {!isLoading && !error && trips.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mb-4">
                                <BusFront size={26} className="text-violet-500" />
                            </div>
                            <p className="text-sm font-bold text-gray-700 mb-1">No {activeStatus.toLowerCase()} rides</p>
                            <p className="text-xs text-gray-400 mb-5">
                                {activeStatus === "Active" ? "Post a ride to start earning" : `No ${activeStatus.toLowerCase()} rides found`}
                            </p>
                            {activeStatus === "Active" && (
                                <Link
                                    href="/provider-dashboard"
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-violet-200"
                                >
                                    <Plus size={13} /> Post Your First Ride
                                </Link>
                            )}
                        </div>
                    )}

                    {!isLoading && !error && trips.length > 0 && (
                        <>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">
                                {trips.length} {activeStatus.toLowerCase()} {trips.length === 1 ? "ride" : "rides"}
                            </p>
                            <div className="space-y-3">
                                {trips.map((trip) => (
                                    <TripCard key={trip._id} trip={trip} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <ProviderBottomNav />
        </ProtectedRoute>
    );
}
