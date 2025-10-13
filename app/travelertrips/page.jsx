"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { PlaneTakeoff, Loader2, AlertTriangle, Car } from "lucide-react";
import toast from "react-hot-toast";
import { TABS_CONFIG } from "@/components/BookTrips/TabsConfig";
import TripCard from "@/components/BookTrips/BookingTripCard";
import TabButton from "@/components/BookTrips/BookingTabButton";

const TravelerTripsPage = () => {
    const [activeTab, setActiveTab] = useState("Active");
    const [allTrips, setAllTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch bookings
    const fetchTrips = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`/api/bookings`, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) setAllTrips(data.data);
            else throw new Error(data.error || "Failed to fetch trips");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrips();
    }, [fetchTrips]);

    // Cancel trip
    const cancelTrip = async (bookingId) => {
        const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            toast.error("Failed to cancel trip.");
        }

        if (response.ok) {
            toast.success("Succesfully cancel trip.");
        }

        setAllTrips(prev => prev.map(t => t.id === bookingId ? { ...t, status: "Cancelled" } : t));
    };

    // Group by status
    const groupedTrips = useMemo(() => allTrips.reduce((acc, t) => {
        acc[t.status] = acc[t.status] || [];
        acc[t.status].push(t);
        return acc;
    }, { Active: [], Completed: [], Cancelled: [] }), [allTrips]);

    const tripsToDisplay = groupedTrips[activeTab] || [];

    return (
        <div className="min-h-screen p-4 sm:p-8 my-4 font-inter">
            <div className="max-w-8xl mx-auto">
                {/* --- Header --- */}
                <header className="mb-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <PlaneTakeoff size={32} className="text-indigo-600" />
                        <h1 className="text-3xl font-extrabold text-gray-900">My Booked Trips </h1>
                    </div>
                    <p className="text-xl font-medium text-gray-700 mt-4">View Your Trips</p>
                </header>

                {/* --- Tabs --- */}
                <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                    {Object.keys(TABS_CONFIG).map(status => (
                        <TabButton
                            key={status}
                            tabName={status}
                            count={groupedTrips[status]?.length || 0}
                            isActive={activeTab === status}
                            onClick={() => setActiveTab(status)}
                        />
                    ))}
                </div>

                {/* --- Tab Content --- */}
                <div className="p-4 border border-gray-200 rounded-lg shadow-sm mb-8">
                    <h2 className={`text-xl font-bold mb-4 ${TABS_CONFIG[activeTab].color}`}>
                        {activeTab} Journeys ({tripsToDisplay.length})
                    </h2>

                    {isLoading && (
                        <div className="text-center p-10">
                            <Loader2 size={32} className="animate-spin mx-auto text-indigo-600" />
                            <p className="mt-3 text-lg text-gray-600">Loading your journeys...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center p-10 bg-rose-50 border border-rose-300 text-rose-700 rounded-lg flex items-center justify-center gap-3">
                            <AlertTriangle size={24} />
                            <p className="text-lg font-medium">Error loading trips: {error}</p>
                        </div>
                    )}

                    {!isLoading && !error && tripsToDisplay.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {tripsToDisplay.map(trip => (
                                <TripCard key={trip.id} trip={trip} onCancelTrip={cancelTrip} />
                            ))}
                        </div>
                    )}

                    {!isLoading && !error && tripsToDisplay.length === 0 && (
                        <div className="text-center p-10 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                            <Car size={48} className={`mx-auto ${TABS_CONFIG[activeTab].color} opacity-60 mb-3`} />
                            <p className="text-lg text-gray-600 font-medium">
                                No {activeTab} journeys right now.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TravelerTripsPage;
