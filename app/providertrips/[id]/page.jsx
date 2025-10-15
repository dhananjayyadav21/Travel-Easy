"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/utils/ProtectedRoute";
import TripTraveler from "@/components/TripTravelers/TripTraveler"
import {
    MapPin,
    Calendar,
    Users,
    Clock,
    Ruler,
    IndianRupee,
    Car,
    AlertTriangle,
    Loader2,
    Tag,
    DollarSign,
    ArrowLeft,
    ClipboardCheck,
} from "lucide-react";

// --- Utility Functions ---
const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
    }).format(amount);
};

const formatDate = (dateString) => {
    try {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch (e) {
        return dateString || 'N/A';
    }
};

// --- Custom Hook for Data Fetching ---
const useTripData = (id) => {
    const [trip, setTrip] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (typeof window === "undefined" || !id) {
            setIsLoading(false);
            setError(!id ? "No Trip ID provided." : null);
            return;
        }

        const tripId = Array.isArray(id) ? id[0] : id;

        try {
            const storedTrips = localStorage.getItem("trips");

            if (!storedTrips) {
                setError("No trip data found in local storage.");
                setIsLoading(false);
                return;
            }

            const parsed = JSON.parse(storedTrips);
            let tripsArray = [];

            if (Array.isArray(parsed)) {
                tripsArray = parsed;
            } else if (parsed.trips && Array.isArray(parsed.trips)) {
                tripsArray = parsed.trips;
            }

            const foundTrip = tripsArray.find((t) => String(t._id) === String(tripId));

            if (foundTrip) {


                const pricePerKm = process.env.NEXT_PUBLIC_PRICE_PER_KM_SINGLESEAT;

                setTrip({
                    ...foundTrip,
                    computedPrice: foundTrip.kilometer * pricePerKm,
                    pricePerKm: pricePerKm,
                    source: foundTrip.source || 'Unknown Source',
                    destination: foundTrip.destination || 'Unknown Destination',
                    date: foundTrip.date || 'N/A',
                    time: foundTrip.time || 'N/A',
                    seats: foundTrip.seats || 0,
                    kilometer: foundTrip.kilometer || 0,
                    vehicleType: foundTrip.vehicleType || 'N/A',
                    description: foundTrip.description || '',
                    bookingId: foundTrip._id || 'N/A',
                });
            } else {
                setError(`Trip with ID "${tripId}" not found.`);
            }

        } catch (err) {
            console.error("Error fetching trip data:", err);
            setError("An error occurred while processing trip data.");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    return { trip, isLoading, error };
};

// --- Detail Item Component ---
const DetailItem = ({ icon: Icon, label, value, colorClass = "text-gray-700" }) => (

    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-white rounded-lg transition duration-150 border border-gray-200 hover:shadow-md h-full">
        <Icon className={`w-5 h-5 flex-shrink-0 ${colorClass}`} />
        <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
            <span className="text-xs md:text-base font-semibold text-gray-800 break-words truncate">{value}</span>
        </div>
    </div>
);

// --- TripDetailsPage Component ---
export default function TripDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { trip, isLoading, error } = useTripData(id);

    // --- Loading/Error States ---
    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
                <p className="text-lg font-medium text-gray-600">Loading Trip Details...</p>
            </div>
        );
    }

    if (error || !trip) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-red-600 mb-2">Trip Not Found</h1>
                <p className="text-gray-600 mb-6">{error || `The requested trip could not be loaded.`}</p>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Go Back
                </button>
            </div>
        );
    }

    const {
        source,
        destination,
        date,
        time,
        seats,
        kilometer,
        vehicleType,
        computedPrice,
        pricePerKm,
        description,
        bookingId,
    } = trip;

    return (
        <ProtectedRoute>
            <div className="min-h-screen py-2 sm:py-12 sm:px-6 lg:px-12">

                {/* max-w-6xl allows the content to spread out more horizontally */}
                <div className="max-w-8xl mx-auto sm:shadow-sm rounded-lg p-4 sm:p-8 sm:border border-gray-200">

                    {/* Header Section */}
                    <header className="mb-8 pb-4 border-b flex justify-between items-start">
                        <div>
                            <button
                                onClick={() => router.back()}
                                className="flex items-center text-indigo-600 hover:text-indigo-800 transition text-sm mb-2"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
                            </button>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                                Trip Summary
                            </h1>
                        </div>
                    </header>

                    {/* Main Content Layout for Horizontal Screen */}
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* LEFT COLUMN: Route, Schedule, Description (Takes 2/3 width on large screens) */}
                        <div className="lg:w-2/3 space-y-8">

                            {/* Route & Schedule Section */}
                            <section>
                                <h2 className="text-xl font-bold text-indigo-700 mb-4 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2" /> Route & Schedule
                                </h2>
                                {/* lg:grid-cols-4 spreads the 4 items out horizontally */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <DetailItem
                                        icon={MapPin}
                                        label="Departure"
                                        value={source}
                                        colorClass="text-red-500"
                                    />
                                    <DetailItem
                                        icon={MapPin}
                                        label="Arrival"
                                        value={destination}
                                        colorClass="text-green-500"
                                    />
                                    <DetailItem
                                        icon={Calendar}
                                        label="Travel Date"
                                        value={formatDate(date)}
                                        colorClass="text-blue-500"
                                    />
                                    <DetailItem
                                        icon={Clock}
                                        label="Departure Time"
                                        value={time}
                                        colorClass="text-blue-500"
                                    />
                                </div>
                            </section>

                            {/* Description Section */}
                            <section>
                                <h2 className="text-xl font-bold text-indigo-700 mb-4 flex items-center">
                                    <ClipboardCheck className="w-5 h-5 mr-2" /> Additional Notes
                                </h2>

                                <div className=" bg-gray-50 border border-gray-300 rounded-lg min-h-[100px] shadow-inner">
                                    <TripTraveler tripId={trip._id} />
                                </div>
                            </section>

                        </div>

                        {/* RIGHT COLUMN: Metrics & Pricing (Takes 1/3 width on large screens) */}
                        <div className="lg:w-1/3 space-y-8">

                            {/* Metrics Section */}
                            <section>
                                <h2 className="text-xl font-bold text-indigo-700 mb-4">Metrics & Vehicle</h2>
                                {/* Uses a simple 2-column grid that collapses to 1 column on mobile */}
                                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                                    <DetailItem
                                        icon={Users}
                                        label="Seats Booked"
                                        value={`${seats} Seats`}
                                        colorClass="text-purple-600"
                                    />
                                    <DetailItem
                                        icon={Car}
                                        label="Vehicle Type"
                                        value={vehicleType}
                                        colorClass="text-teal-600"
                                    />
                                    <DetailItem
                                        icon={Ruler}
                                        label="Distance"
                                        value={`${kilometer} km`}
                                        colorClass="text-orange-600"
                                    />
                                    <DetailItem
                                        icon={IndianRupee}
                                        label="Price Rate"
                                        value={`${pricePerKm} / km`}
                                        colorClass="text-gray-600"
                                    />
                                </div>
                            </section>

                            {/* Total Price Block - Stands out */}
                            <section>
                                <h2 className="text-xl font-bold text-indigo-700 mb-4">Pricing Summary</h2>
                                <div className="p-6 bg-indigo-600 rounded-xl shadow-xl text-white">
                                    <div className="flex flex-col justify-center items-center text-center">
                                        <span className="text-base font-light uppercase opacity-90 mb-1">Estimated Final Cost</span>
                                        <span className="text-5xl font-extrabold">{formatCurrency(computedPrice)}</span>
                                        <span className="text-sm font-light opacity-80 mt-3 flex items-center">
                                            <DollarSign className="w-4 h-4 inline-block mr-1" />
                                            Calculated from {kilometer} km @ {formatCurrency(pricePerKm)}/km
                                        </span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Footer/Action Button */}
                    <footer className="mt-10 pt-4 border-t flex justify-end">
                        <button
                            onClick={() => router.back()}
                            className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-md transition duration-300 shadow-lg text-base"
                        >
                            <ArrowLeft className="w-5 h-5 inline-block mr-2" />
                            Go Back
                        </button>
                    </footer>
                </div>
            </div>
        </ProtectedRoute>
    );
}