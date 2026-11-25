"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/utils/ProtectedRoute";
import GoogleMapsProvider from "@/components/GoogleMapsProvider";
import PlacesAutocomplete from "@/components/PlacesAutocomplete";
import toast from "react-hot-toast";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

const EMPTY_TRIP = {
    name: "", date: "", time: "", seats: 1,
    source: "", destination: "", kilometer: "",
    meetPlace: "", contact: "", vehicle: "", vehicleType: "Car", panCard: "",
};

export default function CreateRidePage() {
    const router = useRouter();
    const [trip, setTrip] = useState(EMPTY_TRIP);
    const [sourceCoords, setSourceCoords] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [calcLoading, setCalcLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const pricePerSeat = trip.kilometer ? Math.round(parseInt(trip.kilometer) * 8) : null;

    const calculateDistance = async (src, dst) => {
        if (!src || !dst || !window.google) return;
        setCalcLoading(true);
        try {
            const service = new window.google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
                {
                    origins: [{ lat: src.lat, lng: src.lng }],
                    destinations: [{ lat: dst.lat, lng: dst.lng }],
                    travelMode: window.google.maps.TravelMode.DRIVING,
                    unitSystem: window.google.maps.UnitSystem.METRIC,
                },
                (response, status) => {
                    setCalcLoading(false);
                    if (status === "OK") {
                        const element = response.rows[0].elements[0];
                        if (element.status === "OK") {
                            const km = Math.round(element.distance.value / 1000);
                            setTrip(prev => ({ ...prev, kilometer: String(km) }));
                        }
                    }
                }
            );
        } catch { setCalcLoading(false); }
    };

    const handleSourceSelect = (coords) => {
        setSourceCoords(coords);
        setTrip(p => ({ ...p, source: coords.address }));
        if (destinationCoords) calculateDistance(coords, destinationCoords);
    };

    const handleDestinationSelect = (coords) => {
        setDestinationCoords(coords);
        setTrip(p => ({ ...p, destination: coords.address }));
        if (sourceCoords) calculateDistance(sourceCoords, coords);
    };

    const handleSubmit = async () => {
        if (!trip.source) return toast.error("Select a starting point");
        if (!trip.destination) return toast.error("Select a destination");
        if (!trip.date) return toast.error("Select a travel date");
        if (!trip.time) return toast.error("Select a departure time");
        if (!trip.vehicle) return toast.error("Enter vehicle number");
        if (!trip.contact) return toast.error("Enter contact number");

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const payload = {
                ...trip,
                name: trip.name || `${trip.source.split(",")[0]} → ${trip.destination.split(",")[0]}`,
                sourceCoords,
                destinationCoords,
            };
            const res = await fetch("/api/addtrip", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to publish ride");
            toast.success("Ride published!");
            setSubmitted(true);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-white flex items-center justify-center px-6">
                    <div className="text-center max-w-sm w-full">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl shadow-green-200">
                            <Check size={32} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Ride Posted!</h2>
                        <p className="text-sm text-gray-500 mb-2">
                            {trip.source.split(",")[0]} → {trip.destination.split(",")[0]}
                        </p>
                        {pricePerSeat && (
                            <p className="text-lg font-extrabold text-[#7C3AED] mb-8">₹{pricePerSeat}/seat</p>
                        )}
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setTrip(EMPTY_TRIP); setSourceCoords(null); setDestinationCoords(null); setSubmitted(false); }}
                                className="flex-1 h-13 py-3.5 border-2 border-[#7C3AED] text-[#7C3AED] rounded-full text-sm font-bold hover:bg-violet-50 transition"
                            >
                                Post Another
                            </button>
                            <button
                                onClick={() => router.push("/provider-dashboard")}
                                className="flex-1 h-13 py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full text-sm font-bold transition"
                            >
                                Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <GoogleMapsProvider>
                <div className="min-h-screen bg-[#F5F3FF]">

                    {/* Header */}
                    <div className="bg-white sticky top-14 z-20 px-5 h-14 flex items-center gap-3 border-b border-gray-100">
                        <button
                            onClick={() => router.back()}
                            className="w-8 h-8 flex items-center justify-center"
                        >
                            <ArrowLeft size={22} className="text-gray-800" />
                        </button>
                        <h1 className="text-base font-extrabold text-gray-900">Create New Ride</h1>
                    </div>

                    <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 pt-5 pb-32">

                        <div className="space-y-3">

                            {/* From */}
                            <div className="bg-white rounded-2xl shadow-sm flex items-center gap-4 px-5 py-4">
                                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round">
                                        <circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-400 font-medium mb-0.5">From</p>
                                    <PlacesAutocomplete
                                        value={trip.source}
                                        onChange={(val) => setTrip(p => ({ ...p, source: val }))}
                                        onPlaceSelect={handleSourceSelect}
                                        placeholder="Starting point"
                                    />
                                </div>
                            </div>

                            {/* To */}
                            <div className="bg-white rounded-2xl shadow-sm flex items-center gap-4 px-5 py-4">
                                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round">
                                        <circle cx="12" cy="10" r="3" fill="#7C3AED" fillOpacity="0.3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-400 font-medium mb-0.5">To</p>
                                    <PlacesAutocomplete
                                        value={trip.destination}
                                        onChange={(val) => setTrip(p => ({ ...p, destination: val }))}
                                        onPlaceSelect={handleDestinationSelect}
                                        placeholder="Destination"
                                    />
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="bg-white rounded-2xl shadow-sm flex items-center gap-4 px-5 py-4">
                                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-400 font-medium mb-0.5">Date &amp; Time</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="date"
                                            value={trip.date}
                                            onChange={e => setTrip(p => ({ ...p, date: e.target.value }))}
                                            className="flex-1 text-sm font-semibold text-gray-900 focus:outline-none bg-transparent min-w-0"
                                        />
                                        <input
                                            type="time"
                                            value={trip.time}
                                            onChange={e => setTrip(p => ({ ...p, time: e.target.value }))}
                                            className="flex-1 text-sm font-semibold text-gray-900 focus:outline-none bg-transparent min-w-0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Total Seats */}
                            <div className="bg-white rounded-2xl shadow-sm flex items-center gap-4 px-5 py-4">
                                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400 font-medium mb-0.5">Total Seats</p>
                                    <p className="text-sm font-bold text-gray-900">{trip.seats}</p>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <button type="button" onClick={() => setTrip(p => ({ ...p, seats: Math.max(1, p.seats - 1) }))}
                                        className="w-8 h-8 rounded-full bg-violet-50 text-[#7C3AED] font-bold text-lg flex items-center justify-center border border-violet-200 hover:bg-violet-100 transition">−</button>
                                    <span className="text-base font-extrabold text-gray-900 w-5 text-center">{trip.seats}</span>
                                    <button type="button" onClick={() => setTrip(p => ({ ...p, seats: Math.min(8, p.seats + 1) }))}
                                        className="w-8 h-8 rounded-full bg-violet-50 text-[#7C3AED] font-bold text-lg flex items-center justify-center border border-violet-200 hover:bg-violet-100 transition">+</button>
                                </div>
                            </div>

                            {/* Price per Seat */}
                            <div className="bg-white rounded-2xl shadow-sm flex items-center gap-4 px-5 py-4">
                                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round">
                                        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400 font-medium mb-0.5">Price per Seat</p>
                                    {calcLoading ? (
                                        <p className="text-sm text-gray-400">Calculating...</p>
                                    ) : pricePerSeat ? (
                                        <p className="text-sm font-bold text-gray-900">₹{pricePerSeat}</p>
                                    ) : (
                                        <p className="text-sm text-gray-300">Auto after route selected</p>
                                    )}
                                </div>
                                {!pricePerSeat && (
                                    <input
                                        type="number"
                                        value={trip.kilometer}
                                        onChange={e => setTrip(p => ({ ...p, kilometer: e.target.value }))}
                                        placeholder="km"
                                        className="w-16 h-9 rounded-xl border border-gray-200 px-2 text-sm text-center text-gray-800 focus:outline-none focus:border-[#7C3AED] bg-gray-50 flex-shrink-0"
                                    />
                                )}
                            </div>

                            {/* Vehicle */}
                            <div className="bg-white rounded-2xl shadow-sm flex items-center gap-4 px-5 py-4">
                                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round">
                                        <rect x="2" y="8" width="20" height="10" rx="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M2 11l3-5h14l3 5"/>
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-400 font-medium mb-0.5">Vehicle Number</p>
                                    <input type="text" value={trip.vehicle}
                                        onChange={e => setTrip(p => ({ ...p, vehicle: e.target.value }))}
                                        placeholder="e.g. MH01AB1234"
                                        className="w-full text-sm font-semibold text-gray-900 placeholder-gray-300 focus:outline-none bg-transparent" />
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="bg-white rounded-2xl shadow-sm flex items-center gap-4 px-5 py-4">
                                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-400 font-medium mb-0.5">Contact Number</p>
                                    <input type="tel" value={trip.contact}
                                        onChange={e => setTrip(p => ({ ...p, contact: e.target.value }))}
                                        placeholder="Your mobile number"
                                        className="w-full text-sm font-semibold text-gray-900 placeholder-gray-300 focus:outline-none bg-transparent" />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Fixed Publish button */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 z-30">
                        <div className="w-full md:w-3/5 lg:w-2/5 mx-auto">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full h-14 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white font-extrabold text-base rounded-full shadow-lg shadow-violet-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <><Loader2 size={18} className="animate-spin" /> Publishing...</> : "Publish Ride"}
                            </button>
                        </div>
                    </div>

                </div>
            </GoogleMapsProvider>
        </ProtectedRoute>
    );
}
