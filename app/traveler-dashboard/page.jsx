"use client";
import React, { useState, useEffect } from "react";
import { Loader2, AlertTriangle, CheckCircle, Route } from 'lucide-react';
import TripCard from "@/components/TravelerTripCard";

export default function TravelerDashboard() {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchSource, setSearchSource] = useState("");
    const [searchDestination, setSearchDestination] = useState("");

    useEffect(() => {
        const fetchTrips = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/providertrips/all?status=Active", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to fetch trips");

                setBookings(data.trips || []);
                setFilteredBookings(data.trips || []);
            } catch (err) {
                console.error(err);
                setError("Failed to load your trips. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    // Filter trips based on source & destination
    useEffect(() => {
        const filtered = bookings.filter((trip) => {
            const sourceMatch = trip.source?.toLowerCase().includes(searchSource.toLowerCase());
            const destinationMatch = trip.destination?.toLowerCase().includes(searchDestination.toLowerCase());
            return sourceMatch && destinationMatch;
        });
        setFilteredBookings(filtered);
    }, [searchSource, searchDestination, bookings]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="flex flex-col items-center p-10 bg-white rounded-xl shadow-lg">
                    <Loader2 size={32} className="animate-spin text-indigo-500 mb-4" />
                    <p className="text-lg font-medium text-gray-700">Loading your trips...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="flex flex-col items-center p-10 bg-red-50 rounded-xl shadow-lg border border-red-300">
                    <AlertTriangle size={32} className="text-red-500 mb-4" />
                    <p className="text-lg font-medium text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-8 font-inter">
            {/* Header */}
            <div className="max-w-7xl mx-auto my-4 sm:my-1">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3 border-b-2 border-indigo-200 pb-2">
                    <Route size={20} className="text-indigo-600" />
                    View & Book Trip
                </h1>
                <p className="text-gray-600 mt-2">Book seat according to your choice.</p>

                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3 my-6">
                    <input
                        type="text"
                        placeholder="Search by Source"
                        className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
                        value={searchSource}
                        onChange={(e) => setSearchSource(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Search by Destination"
                        className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
                        value={searchDestination}
                        onChange={(e) => setSearchDestination(e.target.value)}
                    />
                </div>
            </div>

            {/* Trip Cards */}
            <div className="max-w-7xl mx-auto">
                {filteredBookings.length === 0 ? (
                    <div className="p-10 bg-white rounded-xl shadow-lg border border-indigo-300 text-center">
                        <CheckCircle size={32} className="text-indigo-500 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700">No trips match your search.</p>
                        <p className="text-sm text-gray-500">Try adjusting your source or destination.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredBookings.map((trip) => (
                            <TripCard key={trip._id} booking={{ trip }} /> // wrap trip inside booking prop for TripCard
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
