"use client";

import { useEffect, useState } from "react";
import TripCard from "@/components/ProviderTripCard";
import { Loader2, AlertTriangle, BusFront, CalendarCheck, Clock, XCircle, Filter } from "lucide-react";
import ProtectedRoute from "@/utils/ProtectedRoute";

// Define the available trip statuses
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
                setError("Authentication required. Please log in.");
                setIsLoading(false);
                return;
            }

            // Using the current status in the API call
            const res = await fetch(`/api/providertrips/my?status=${currentStatus}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const responseData = await res.json();

            if (!res.ok) {
                // API returns a standard error format
                throw new Error(responseData.message || `Failed to fetch ${currentStatus} trips.`);
            }

            // Store all fetched data in local storage for details page access
            if (responseData.trips && Array.isArray(responseData.trips)) {
                localStorage.setItem('trips', JSON.stringify(responseData.trips));
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

    useEffect(() => {
        fetchTrips(status);
    }, [status]);

    // Allows manual refresh if needed
    const refetch = () => fetchTrips(status);

    return { data, isLoading, error, refetch };
};

// --- ProviderTrips Page Component ---

export default function ProviderTrips() {
    // State to manage which status tab is currently active
    const [activeStatus, setActiveStatus] = useState(tripStatuses[0].key);

    // Fetch data using the custom hook based on the active status
    const { data: trips, isLoading, error, refetch } = useFetchProviderTrips(activeStatus);

    // --- Tab Component ---
    const TabButton = ({ statusKey, label, Icon }) => {
        const isActive = statusKey === activeStatus;
        return (
            <button
                onClick={() => setActiveStatus(statusKey)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition duration-200 
                    ${isActive
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                }
            >
                <Icon size={18} className="mr-2" />
                {label}
            </button>
        );
    };

    // --- Render Logic ---
    // 1. Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                <p className="text-lg font-medium text-gray-600">Loading {activeStatus} trips...</p>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header Section */}
                    <header className="mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Offered Rides</h1>
                        <p className="text-gray-500 text-lg">Manage all trips you've published for ride-sharing.</p>
                    </header>

                    {/* Status Tabs/Filters */}
                    <div className="flex flex-wrap gap-3 mb-8 p-3 bg-white rounded-xl shadow-sm border border-gray-200">
                        <Filter size={20} className="text-indigo-600 self-center mr-2 hidden sm:block" />
                        {tripStatuses.map((status) => (
                            <TabButton
                                key={status.key}
                                statusKey={status.key}
                                label={status.label}
                                Icon={status.icon}
                            />
                        ))}
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center justify-between shadow-sm">
                            <div className="flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-3" />
                                <span className="block sm:inline">{error}</span>
                            </div>
                            <button
                                onClick={refetch}
                                className="text-sm font-semibold text-red-700 hover:text-red-900 underline"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!error && trips.length === 0 && (
                        <div className="text-center p-12 border-4 border-dashed border-gray-300 rounded-xl mt-10 bg-white">
                            <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold text-gray-700">No {activeStatus} Trips Found</h2>
                            <p className="text-gray-500 mt-2">It looks like you haven't created any rides under this status yet.</p>
                        </div>
                    )}

                    {/* Trips Grid */}
                    {!error && trips.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trips.map((trip) => (
                                <TripCard key={trip._id} trip={trip} />
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </ProtectedRoute>
    );
}