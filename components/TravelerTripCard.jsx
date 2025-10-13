"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
    Tag,
    Users,
    Route,
    Ruler,
    Calendar,
    Clock,
    Home,
    Car,
    Phone,
} from "lucide-react";

const getStatusClasses = (status) => {
    switch (status) {
        case "Confirmed":
            return "bg-green-100 text-green-700 border-green-300";
        case "Pending":
            return "bg-yellow-100 text-yellow-700 border-yellow-300";
        case "Cancelled":
            return "bg-red-100 text-red-700 border-red-300";
        default:
            return "bg-gray-100 text-gray-700 border-gray-300";
    }
};

const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center text-sm space-x-2 p-2 bg-white rounded-md shadow-sm border border-gray-100">
        <Icon size={16} className="text-indigo-500 flex-shrink-0" />
        <span className="font-semibold text-gray-600">{label}:</span>
        <span className="text-gray-800 font-medium truncate">{value}</span>
    </div>
);

export default function TripCard({ booking }) {
    const { trip, seatsBooked, status } = booking;
    const statusClasses = getStatusClasses(status);
    const router = useRouter();

    // Handle click event
    const handleCardClick = () => {
        // Save the selected trip details in localStorage
        localStorage.setItem("selectedTrip", JSON.stringify(trip));

        // Navigate to booking page with trip ID
        router.push(`/booktrips/${trip._id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 cursor-pointer"
        >
            {/* Header */}
            <div
                className={`p-5 flex justify-between items-start border-b-4 ${trip.status === "Confirmed"
                    ? "border-green-500"
                    : trip.status === "Active"
                        ? "border-yellow-500"
                        : "border-red-500"
                    }`}
            >
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Tag size={20} className="text-indigo-600" />
                    {trip.name}
                </h3>
                <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusClasses}`}
                >
                    {trip.status}
                </span>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
                <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-indigo-700 uppercase">
                            Booked
                        </span>
                        <span className="text-2xl font-extrabold text-indigo-600 flex items-center gap-1">
                            {seatsBooked} <Users size={20} />
                        </span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-xs font-semibold text-gray-500 uppercase">
                            Total Seats
                        </span>
                        <span className="text-lg font-bold text-gray-800">
                            {trip.seats}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailItem
                        icon={Route}
                        label="Route"
                        value={`${trip.source} to ${trip.destination}`}
                    />
                    <DetailItem
                        icon={Ruler}
                        label="Distance"
                        value={`${trip.kilometer} km`}
                    />
                    <DetailItem
                        icon={Calendar}
                        label="Date"
                        value={new Date(trip.date).toLocaleDateString()}
                    />
                    <DetailItem icon={Clock} label="Time" value={trip.time} />
                    <DetailItem icon={Home} label="Meeting Point" value={trip.meetPlace} />
                    <DetailItem icon={Car} label="Vehicle Type" value={trip.vehicleType} />
                </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50">
                <h4 className="text-md font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Phone size={18} /> Provider Details :
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="font-medium text-gray-800">
                        Vehicle No:{" "}
                        <span className="font-bold text-indigo-600">{trip.vehicle}</span>
                    </div>
                    <div className="font-medium text-gray-800">
                        Provider Contact:{" "}
                        <span className="font-bold">{trip.contact}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
