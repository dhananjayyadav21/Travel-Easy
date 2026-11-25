"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/utils/ProtectedRoute";
import TripTraveler from "@/components/TripTravelers/TripTraveler";
import toast from "react-hot-toast";
import {
    Calendar, Users, Clock, Ruler, IndianRupee, Car,
    AlertTriangle, Loader2, ArrowLeft, CheckCircle, XCircle, Navigation, Radio,
} from "lucide-react";

const formatCurrency = (amount) => {
    if (typeof amount !== "number" || isNaN(amount)) return "N/A";
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(amount);
};

const formatDate = (dateString) => {
    try {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
    } catch { return dateString || "N/A"; }
};

const statusConfig = {
    Active: { pill: "bg-green-100 text-green-700 border border-green-200", dot: "bg-green-500" },
    Completed: { pill: "bg-violet-100 text-violet-700 border border-violet-200", dot: "bg-violet-500" },
    Cancelled: { pill: "bg-red-100 text-red-600 border border-red-200", dot: "bg-red-500" },
};

export default function TripDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [trip, setTrip] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchTrip = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/providertrips/trip/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch trip");
            const pricePerKm = Number(process.env.NEXT_PUBLIC_PRICE_PER_KM_SINGLESEAT) || 8;
            setTrip({ ...data.trip, computedPrice: data.trip.kilometer * pricePerKm, pricePerKm });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchTrip();
    }, [fetchTrip]);

    const handleTripAction = async (action) => {
        if (!trip) return;
        const confirmed = confirm(`Are you sure you want to ${action} this trip?`);
        if (!confirmed) return;
        setIsProcessing(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/providertrips/${trip._id}/${action}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                setTrip((prev) => ({ ...prev, status: action === "complete" ? "Completed" : "Cancelled" }));
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const openNavigator = () => {
        router.push(`/navigate/${id}`);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-56px)] bg-[#F5F3FF]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center mb-4 shadow-lg shadow-violet-200 animate-pulse">
                    <Car size={24} className="text-white" />
                </div>
                <p className="text-sm text-gray-500">Loading trip details…</p>
            </div>
        );
    }

    if (error || !trip) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-56px)] bg-[#F5F3FF] p-6 text-center">
                <div className="bg-white rounded-3xl border border-violet-100 p-8 max-w-sm w-full shadow-xl shadow-violet-100">
                    <AlertTriangle size={36} className="text-red-500 mx-auto mb-3" />
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Trip Not Found</h2>
                    <p className="text-sm text-gray-500 mb-5">{error || "The requested trip could not be loaded."}</p>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold px-5 py-2.5 rounded-xl transition shadow-md shadow-violet-200 mx-auto"
                    >
                        <ArrowLeft size={16} /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    const { source, destination, date, time, seats, kilometer, vehicleType, vehicle, computedPrice, pricePerKm, status } = trip;
    const sc = statusConfig[status] || statusConfig.Active;

    return (
        <ProtectedRoute>
            <div className="min-h-[calc(100vh-56px)] bg-[#F5F3FF]">

                {/* ── WHITE STICKY HEADER ── */}
                <div className="bg-white sticky top-14 z-30 border-b border-gray-100 shadow-sm">
                    <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition"
                            >
                                <ArrowLeft size={16} className="text-gray-600" />
                            </button>
                            <h1 className="text-base font-extrabold text-gray-900">Trip Details</h1>
                        </div>
                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${sc.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${status === "Active" ? "animate-pulse" : ""}`} />
                            {status}
                        </span>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto px-4 pt-4 pb-10 space-y-3">

                {/* ── ROUTE CARD ── */}
                <div className="bg-white rounded-2xl shadow-sm p-4">
                    <div className="flex items-stretch gap-4">
                        <div className="flex flex-col items-center pt-1 flex-shrink-0">
                            <div className="w-3 h-3 rounded-full bg-green-500 ring-2 ring-green-200" />
                            <div className="w-px flex-1 border-l-2 border-dashed border-gray-200 my-1 min-h-[24px]" />
                            <div className="w-3 h-3 rounded-full bg-[#7C3AED] ring-2 ring-violet-200" />
                        </div>
                        <div className="flex flex-col justify-between gap-3 flex-1 min-w-0">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">From</p>
                                <p className="text-base font-extrabold text-gray-900 leading-tight">{source}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">To</p>
                                <p className="text-base font-extrabold text-gray-900 leading-tight">{destination}</p>
                            </div>
                        </div>
                        <div className="bg-violet-50 border border-violet-100 rounded-2xl px-3 py-3 text-center flex-shrink-0 min-w-[80px]">
                            <p className="text-sm font-extrabold text-gray-900">{kilometer} km</p>
                            <p className="text-xs text-gray-400 mt-0.5">₹{pricePerKm}/km</p>
                            <p className="text-sm font-extrabold text-[#7C3AED] mt-1">{formatCurrency(computedPrice)}</p>
                        </div>
                    </div>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-50">
                        {date && (
                            <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
                                <Calendar size={11} className="text-violet-500" /> {formatDate(date)}
                            </span>
                        )}
                        {time && (
                            <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
                                <Clock size={11} className="text-violet-500" /> {time}
                            </span>
                        )}
                        {seats && (
                            <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
                                <Users size={11} className="text-violet-500" /> {seats} seats
                            </span>
                        )}
                    </div>
                </div>

                {/* ── NAVIGATOR BUTTON ── */}
                {status === "Active" && (
                <div className="bg-white rounded-2xl shadow-sm p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                            <Navigation size={14} className="text-[#7C3AED]" />
                        </div>
                        <span className="text-sm font-bold text-gray-900">Navigator</span>
                        <span className="text-xs text-gray-400 ml-auto">{source?.split(",")[0]} → {destination?.split(",")[0]}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1.5">
                            <Clock size={13} className="text-violet-500" />
                            <span className="text-xs font-semibold text-gray-600">{time || "—"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Ruler size={13} className="text-violet-500" />
                            <span className="text-xs font-semibold text-gray-600">{kilometer} km</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Users size={13} className="text-violet-500" />
                            <span className="text-xs font-semibold text-gray-600">{trip.bookedseats || 0} passengers</span>
                        </div>
                    </div>
                    <button
                        onClick={openNavigator}
                        className="w-full h-12 bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-[0.98] text-white rounded-full font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-200"
                    >
                        <Radio size={16} /> Start Trip
                    </button>
                </div>
                )}

                {/* ── TRIP INFO GRID ── */}
                <div className="bg-white rounded-2xl shadow-sm p-4">
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: Calendar, label: "Date", value: formatDate(date) },
                            { icon: Clock, label: "Time", value: time || "—" },
                            { icon: Users, label: "Seats", value: `${trip.bookedseats || 0}/${seats} booked` },
                            { icon: Car, label: "Vehicle", value: `${vehicle || "—"} · ${vehicleType || "—"}` },
                            { icon: Ruler, label: "Distance", value: `${kilometer} km` },
                            { icon: IndianRupee, label: "Price/seat", value: `₹${(kilometer || 0) * (pricePerKm || 8)}` },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                                    <Icon size={15} className="text-[#7C3AED]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-400">{label}</p>
                                    <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                {/* ── PASSENGERS ── */}
                <div className="bg-white rounded-2xl shadow-sm p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                            <Users size={15} className="text-[#7C3AED]" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm">Passengers</h3>
                    </div>
                    <TripTraveler tripId={trip._id} />
                </div>

                {/* ── TRIP ACTIONS ── */}
                {status === "Active" && (
                    <div className="bg-white rounded-2xl shadow-sm p-4">
                        <h3 className="font-bold text-gray-900 text-sm mb-3">Trip Actions</h3>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                disabled={isProcessing}
                                onClick={() => handleTripAction("complete")}
                                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold py-3 transition shadow-md shadow-green-100 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                            >
                                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                Mark as Completed
                            </button>
                            <button
                                disabled={isProcessing}
                                onClick={() => handleTripAction("cancel")}
                                className="flex-1 flex items-center justify-center gap-2 border-2 border-red-400 text-red-600 rounded-xl font-bold py-3 hover:bg-red-50 transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                            >
                                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                                Cancel Trip
                            </button>
                        </div>
                    </div>
                )}

                </div>
            </div>
        </ProtectedRoute>
    );
}
