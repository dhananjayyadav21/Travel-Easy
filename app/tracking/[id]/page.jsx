"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Phone, Star, Users, MapPin } from "lucide-react";
import TripMap from "@/components/TripMap";
import Pusher from "pusher-js";
import ProtectedRoute from "@/utils/ProtectedRoute";

const getInitials = (name) => {
    if (!name) return "P";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

export default function TrackingPage({ params }) {
    const { id } = use(params);
    const router = useRouter();

    const [booking, setBooking] = useState(null);
    const [trip, setTrip] = useState(null);
    const [liveLocation, setLiveLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    // Suppress Google Maps auth error popup
    useEffect(() => {
        window.gm_authFailure = () => {};
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const tripRes = await fetch(`/api/providertrips/trip/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (tripRes.ok) {
                    const tripData = await tripRes.json();
                    if (tripData.success) {
                        setTrip(tripData.trip);
                        if (tripData.trip.liveLocation?.lat) {
                            setLiveLocation(tripData.trip.liveLocation);
                        }
                    }
                }

                const bookRes = await fetch("/api/bookings", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const bookData = await bookRes.json();
                if (bookData.success) {
                    const found = bookData.data.find((b) => b.tripId === id);
                    if (found) setBooking(found);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Pusher OR 4s poll fallback
    useEffect(() => {
        if (!id) return;

        if (process.env.NEXT_PUBLIC_PUSHER_KEY) {
            const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2",
            });
            const channel = pusher.subscribe(`trip-${id}`);
            channel.bind("location-update", (data) => {
                setLiveLocation({ lat: data.lat, lng: data.lng });
            });
            return () => {
                channel.unbind_all();
                pusher.unsubscribe(`trip-${id}`);
                pusher.disconnect();
            };
        }

        const poll = setInterval(async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`/api/providertrips/trip/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) return;
                const data = await res.json();
                if (data.trip?.liveLocation?.lat) {
                    setLiveLocation(data.trip.liveLocation);
                }
            } catch { /* silent */ }
        }, 4000);

        return () => clearInterval(poll);
    }, [id]);

    const sourceCoords = trip?.sourceCoords || null;
    const destinationCoords = trip?.destinationCoords || null;
    const providerName = trip?.name || booking?.providerName || "Provider";
    const vehicle = trip?.vehicle || booking?.vehicle || "Car";
    const rating = trip?.avgRating || 4.8;
    const srcCity = (trip?.source || booking?.source || "").split(",")[0] || "Start";
    const dstCity = (trip?.destination || booking?.destination || "").split(",")[0] || "Destination";
    const kilometer = trip?.kilometer || booking?.kilometer || "—";

    return (
        <ProtectedRoute>
            <div className="fixed inset-0 z-50 flex flex-col bg-[#EEF0F5]">

                {/* Map area */}
                <div className="flex-1 relative">
                    {sourceCoords && destinationCoords ? (
                        <TripMap
                            sourceCoords={sourceCoords}
                            destinationCoords={destinationCoords}
                            liveLocation={liveLocation}
                            height="100%"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#D6DCE8] flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-white/60 flex items-center justify-center mx-auto mb-3 shadow">
                                    <MapPin size={28} className="text-[#7C3AED]" />
                                </div>
                                <p className="text-sm text-gray-500 font-medium">Waiting for live location…</p>
                                <div className="flex gap-1 justify-center mt-2">
                                    {[0, 1, 2].map(i => (
                                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]/40 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── TOP NAV CARD ── */}
                    <div className="absolute top-4 left-4 right-4 z-10">
                        <div className="bg-white rounded-2xl shadow-xl flex items-center gap-3 px-4 py-3.5">
                            {/* Provider avatar */}
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0 shadow-md shadow-violet-300">
                                {getInitials(providerName)}
                            </div>

                            {/* Route info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-gray-900 font-extrabold text-base leading-tight truncate">{providerName}</p>
                                <p className="text-gray-400 text-xs font-medium truncate mt-0.5">{srcCity} → {dstCity}</p>
                            </div>

                            {/* Live indicator */}
                            <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${liveLocation ? "bg-green-50" : "bg-gray-50"}`}>
                                    <span className={`w-3 h-3 rounded-full ${liveLocation ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
                                </div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">{liveLocation ? "Live" : "Waiting"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Back button */}
                    <button
                        onClick={() => router.back()}
                        className="absolute top-28 left-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 active:scale-95 transition"
                    >
                        <ChevronLeft size={20} className="text-gray-700" />
                    </button>

                    {/* Call button (if contact available) */}
                    {trip?.contact && (
                        <a
                            href={`tel:${trip.contact}`}
                            className="absolute top-28 right-4 z-10 w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition"
                        >
                            <Phone size={16} className="text-white" />
                        </a>
                    )}
                </div>

                {/* ── BOTTOM SHEET ── */}
                <div className="bg-white rounded-t-3xl px-5 pt-3 pb-8 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
                    <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

                    {/* Provider info row */}
                    <div className="flex items-center gap-3 mb-4">
                        {/* Route dots */}
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                            <div className="w-px h-5 bg-gray-200" />
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        </div>

                        {/* Route text */}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{srcCity}</p>
                            <div className="flex items-center gap-2 my-0.5">
                                <span className="text-[10px] text-gray-400">{kilometer} km</span>
                                {booking?.seats && <span className="text-[10px] text-gray-400">· {booking.seats} seat{booking.seats !== 1 ? "s" : ""}</span>}
                                {booking?.price && <span className="text-[10px] text-gray-400">· ₹{booking.price?.toLocaleString("en-IN")}</span>}
                            </div>
                            <p className="text-xs font-bold text-gray-900 truncate">{dstCity}</p>
                        </div>

                        {/* Rating */}
                        <div className="flex flex-col items-center gap-1 bg-amber-50 rounded-xl px-3 py-2 flex-shrink-0">
                            <Star size={14} className="text-amber-400 fill-amber-400" />
                            <span className="text-xs font-extrabold text-amber-600">{rating}</span>
                        </div>
                    </div>

                    {/* Vehicle + seats info */}
                    <div className="bg-violet-50 border border-violet-100 rounded-2xl px-4 py-3 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Vehicle</p>
                            <p className="text-sm font-extrabold text-gray-900">{vehicle}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Users size={14} className="text-violet-500" />
                            <span className="text-sm font-bold text-[#7C3AED]">{booking?.seats ?? trip?.bookedseats ?? "—"} seat{(booking?.seats ?? 1) !== 1 ? "s" : ""} booked</span>
                        </div>
                    </div>
                </div>

                {/* Loading overlay */}
                {loading && (
                    <div className="absolute inset-0 z-30 bg-white/80 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-t-transparent border-[#7C3AED] rounded-full animate-spin" />
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
