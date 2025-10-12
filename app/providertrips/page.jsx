"use client";
import { useEffect, useState } from "react";
import TripCard from "@/components/ProviderTripCard";

export default function ProviderTrips() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/providertrips/my?status=Pending", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) throw new Error(data.message || "Failed to fetch trips");

                setTrips(data.trips);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <span className="w-12 h-12 border-4 border-t-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
            </div>
        );
    }

    if (trips.length === 0) {
        return <div className="min-h-screen flex justify-center items-center text-gray-600">No trips found.</div>;
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                    <TripCard key={trip._id} trip={trip} />
                ))}
            </div>
        </div>
    );
}
