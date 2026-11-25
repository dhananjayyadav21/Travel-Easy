"use client";

import React, { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/utils/ProtectedRoute";
import TripMap from "@/components/TripMap";
import { Navigation, ArrowLeft, Users, XCircle, MapPin } from "lucide-react";
import toast from "react-hot-toast";

export default function NavigatePage({ params }) {
    const { id } = use(params);
    const router = useRouter();

    const [trip, setTrip] = useState(null);
    const [liveLocation, setLiveLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const watchIdRef = useRef(null);

    // Suppress Google Maps auth error popup
    useEffect(() => {
        window.gm_authFailure = () => {};
    }, []);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`/api/providertrips/trip/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.success) setTrip(data.trip);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    }, [id]);

    // Start geolocation on mount
    useEffect(() => {
        if (!id) return;
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported.");
            return;
        }

        toast.success("Navigator started!");

        watchIdRef.current = navigator.geolocation.watchPosition(
            async (pos) => {
                const { latitude: lat, longitude: lng } = pos.coords;
                setLiveLocation({ lat, lng });
                try {
                    const token = localStorage.getItem("token");
                    await fetch("/api/providertrips/location", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ tripId: id, lat, lng }),
                    });
                } catch { /* silent */ }
            },
            () => toast.error("Could not get your location."),
            { enableHighAccuracy: true, maximumAge: 5000 }
        );

        return () => {
            if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
        };
    }, [id]);

    const stopAndGoBack = () => {
        if (watchIdRef.current) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        toast("Navigator stopped.");
        router.back();
    };

    const { source, destination, kilometer, time, bookedseats, sourceCoords, destinationCoords } = trip || {};
    const srcCity = source?.split(",")[0] || "Start";
    const dstCity = destination?.split(",")[0] || "Destination";

    return (
        <ProtectedRoute>
            <div className="fixed inset-0 z-50 flex flex-col bg-[#EEF0F5]">

                {/* Map area */}
                <div className="flex-1 relative">
                    {!loading && sourceCoords && destinationCoords ? (
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
                                    <Navigation size={28} className="text-[#7C3AED]" />
                                </div>
                                <p className="text-sm text-gray-500 font-medium">
                                    {loading ? "Loading…" : "No coordinates for this trip."}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── TOP NAV CARD (reference style) ── */}
                    <div className="absolute top-4 left-4 right-4 z-10">
                        <div className="bg-white rounded-3xl shadow-xl flex items-center gap-3 px-4 py-3.5">
                            {/* Direction icon box */}
                            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED] flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-300">
                                <Navigation size={22} className="text-white" />
                            </div>

                            {/* Distance + route */}
                            <div className="flex-1 min-w-0">
                                <p className="text-gray-900 font-extrabold text-xl leading-tight">{kilometer || "—"} km</p>
                                <p className="text-gray-400 text-xs font-medium truncate mt-0.5">{srcCity} → {dstCity}</p>
                            </div>

                            {/* Live indicator */}
                            <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${liveLocation ? "bg-green-50" : "bg-gray-50"}`}>
                                    <span className={`w-3 h-3 rounded-full ${liveLocation ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
                                </div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">{liveLocation ? "Live" : "GPS"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Back button */}
                    <button
                        onClick={stopAndGoBack}
                        className="absolute top-28 left-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 active:scale-95 transition"
                    >
                        <ArrowLeft size={18} className="text-gray-700" />
                    </button>
                </div>

                {/* ── BOTTOM SHEET (reference style) ── */}
                <div className="bg-white rounded-t-3xl px-5 pt-3 pb-8 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
                    {/* Drag handle */}
                    <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

                    {/* Info row — route dots */}
                    <div className="flex items-center gap-3 mb-4">
                        {/* Route visual */}
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                            <div className="w-px h-5 bg-gray-200" />
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        </div>

                        {/* Route text */}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{srcCity}</p>
                            <p className="text-[10px] text-gray-400 my-0.5">{kilometer || "—"} km · {bookedseats || 0} passenger{bookedseats !== 1 ? "s" : ""} · {time || "—"}</p>
                            <p className="text-xs font-bold text-gray-900 truncate">{dstCity}</p>
                        </div>

                        {/* Passengers badge */}
                        <div className="flex items-center gap-1.5 bg-violet-50 rounded-xl px-3 py-2 flex-shrink-0">
                            <Users size={14} className="text-[#7C3AED]" />
                            <span className="text-sm font-extrabold text-[#7C3AED]">{bookedseats || 0}</span>
                        </div>
                    </div>

                    {/* Stop button */}
                    <button
                        onClick={stopAndGoBack}
                        className="w-full h-14 bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-[0.98] text-white rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-200"
                    >
                        <XCircle size={18} /> Stop Navigator
                    </button>
                </div>
            </div>
        </ProtectedRoute>
    );
}
