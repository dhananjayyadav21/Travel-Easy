"use client";

import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function TripBookingsTable({ tripId }) {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all bookings for the trip
    const fetchBookings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/bookingsfortrip?tripId=${tripId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message || "Failed to fetch bookings");
            setBookings(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [tripId]);

    if (isLoading) {
        return (
            <div className="text-center py-10">
                <Loader2 className="animate-spin mx-auto text-indigo-600" size={32} />
                <p className="mt-2 text-gray-600">Loading bookings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-600 flex flex-col items-center gap-2">
                <AlertTriangle size={28} />
                <p>{error}</p>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="text-center py-10 text-gray-600">
                No bookings for this trip yet.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left">Traveler Name</th>
                        <th className="px-4 py-2 text-left">Number</th>
                        <th className="px-4 py-2 text-left">Seats</th>
                        <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((b) => (
                        <tr key={b._id} className="border-t border-gray-200">
                            <td className="px-4 py-2">{b.travelerName}</td>
                            <td className="px-4 py-2">{b.travelerNumber}</td>
                            <td className="px-4 py-2">{b.numberOfSeats}</td>
                            <td className="px-4 py-2 flex justify-center gap-2">
                                {b.status == "Completed" && (
                                    <button
                                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        <CheckCircle size={16} />
                                        Complete
                                    </button>
                                )}
                                {b.status == "Active" && (
                                    <button
                                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        <CheckCircle size={16} />
                                        Active
                                    </button>
                                )}
                                {b.status == "Cancelled" && (
                                    <button
                                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        <XCircle size={16} />
                                        Cancel
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
