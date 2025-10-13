"use client";

import { Car, Calendar, Clock, Users, MapPin, ArrowRight, DollarSign, Tag, Info } from 'lucide-react';
import Link from 'next/link';


const getStatusBadge = (status) => {
    const s = String(status).toLowerCase();
    switch (s) {
        case "active":
        case "confirmed":
            return { text: "Active", classes: "bg-green-100 text-green-800 border-green-300" };
        case "completed":
        case "finished":
            return { text: "Completed", classes: "bg-gray-100 text-gray-700 border-gray-300" };
        case "cancelled":
        case "expired":
            return { text: "Cancelled", classes: "bg-red-100 text-red-700 border-red-300" };
        default:
            return { text: "Draft", classes: "bg-indigo-100 text-indigo-700 border-indigo-300" };
    }
};

const formatReadableDate = (dateString) => {
    try {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch (e) {
        return dateString || 'N/A';
    }
};

// --- Sub-Component for a Single Detail Row ---
const CardDetail = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-2 text-sm text-gray-600">
        <Icon size={16} className="text-indigo-500 flex-shrink-0" />
        <span className="font-medium">{label}:</span>
        <span className="text-gray-800 truncate">{value}</span>
    </div>
);

// --- Main TripCard Component ---
export default function TripCard({ trip }) {
    const { text: statusText, classes: statusClasses } = getStatusBadge(trip.status);

    const isPriceAvailable = trip.kilometer && !isNaN(trip.kilometer);
    const estimatedPrice = isPriceAvailable ? trip.kilometer * 26 : null;
    const detailsLink = `/providertrips/${trip._id}`;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col gap-5 hover:shadow-xl hover:ring-2 hover:ring-indigo-100 transition duration-300 transform hover:-translate-y-0.5">

            {/* Header: Title and Status Badge */}
            <div className="flex justify-between items-start border-b pb-3">
                <h3 className="text-xl font-bold text-gray-800 truncate pr-4">{trip.name || "Untitled Trip"}</h3>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusClasses}`}>
                    {statusText}
                </span>
            </div>

            {/* Route Section */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center text-sm font-medium text-gray-500">
                    <MapPin size={16} className="text-red-500 mr-1.5" />
                    Source: <span className="text-gray-800 font-semibold ml-1">{trip.source}</span>
                </div>
                <div className="flex items-center text-sm font-medium text-gray-500">
                    <ArrowRight size={16} className="text-gray-400 mr-1.5 ml-0.5" />
                    Destination: <span className="text-gray-800 font-semibold ml-1">{trip.destination}</span>
                </div>
            </div>

            {/* Details Grid (2 Columns on All Screens) */}
            <div className="grid grid-cols-2 gap-4 border-y py-4">

                {/* Left Column: Date & Time */}
                <div className="flex flex-col gap-2 border-r pr-4">
                    <CardDetail
                        icon={Calendar}
                        label="Date"
                        value={formatReadableDate(trip.date)}
                    />
                    <CardDetail
                        icon={Clock}
                        label="Time"
                        value={trip.time}
                    />
                    <CardDetail
                        icon={MapPin}
                        label="Meeting Point"
                        value={trip.meetPlace || 'N/A'}
                    />
                </div>

                {/* Right Column: Capacity & Vehicle */}
                <div className="flex flex-col gap-2 pl-4">
                    <CardDetail
                        icon={Users}
                        label="Seats"
                        value={`${trip.seats || 0} Available`}
                    />
                    <CardDetail
                        icon={Car}
                        label="Vehicle"
                        value={trip.vehicle || 'N/A'}
                    />
                    <CardDetail
                        icon={Tag}
                        label="Type"
                        value={trip.vehicleType || 'Car'}
                    />
                </div>
            </div>

            {/* Footer: Price and Action Button */}
            <div className="flex justify-between items-center pt-1">
                <div className="flex items-center text-lg font-bold text-gray-900">
                    <DollarSign size={20} className="text-green-600 mr-1" />
                    {estimatedPrice ? (
                        <span className="text-xl">₹{estimatedPrice}</span>
                    ) : (
                        <span className="text-sm text-gray-500 font-normal">Price Est. N/A</span>
                    )}
                </div>

                <Link
                    href={detailsLink}
                    className="flex items-center gap-1 text-white bg-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition duration-300 shadow-md"
                >
                    <Info size={18} />
                    View Details
                </Link>
            </div>
        </div>
    );
}