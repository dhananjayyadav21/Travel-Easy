"use client";
import React, { useState } from "react";
import { Calendar, IndianRupee, Users, ChevronRight, Loader2, MapPin } from "lucide-react";
import { TABS_CONFIG } from "./TabsConfig";

const TripCard = ({ trip, onCancelTrip }) => {
    const config = TABS_CONFIG[trip.status];
    const [isCancelling, setIsCancelling] = useState(false);

    const handleCancel = async () => {
        setIsCancelling(true);
        try {
            await onCancelTrip(trip.id);
        } catch (error) {
            console.error(" Cancellation failed:", error);
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <div
            className={`relative bg-white rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300 overflow-hidden group`}
        >
            {/* Left border gradient indicator */}
            <div className={`absolute left-0 top-0 h-full w-1 ${config.border} rounded-l-2xl`} />

            <div className="p-5 flex flex-col h-full">
                {/* --- Header --- */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-1">
                        <MapPin size={18} className="text-indigo-500" />
                        <span className="truncate">{trip.source}</span>
                        <ChevronRight size={18} className="text-gray-400" />
                        <span className="truncate">{trip.destination}</span>
                    </h3>

                    <div
                        className={`flex items-center font-semibold px-3 py-1 rounded-full text-xs ${config.color} ${config.pillBg} shadow-sm`}
                    >
                        {React.createElement(config.icon, { size: 14, className: "mr-1" })}
                        {trip.status}
                    </div>
                </div>

                {/* --- Trip Details --- */}
                <div className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4 flex-grow">
                    <DetailRow icon={<Calendar size={15} />} label="Date" value={trip.date} />
                    <DetailRow
                        icon={<IndianRupee size={15} />}
                        label="Fare"
                        value={`₹${trip.price.toLocaleString("en-IN")}`}
                        strong
                        highlight
                    />
                    <DetailRow icon={<Users size={15} />} label="Contact" value={trip.contact} />
                    {trip.status === "Cancelled" && (
                        <DetailRow icon={<Users size={15} />} label="Cancelled By" value={trip.cancelledBy} />)}
                </div>

                {/* --- Footer Buttons --- */}
                <div className="mt-5">
                    {trip.status === "Active" && (
                        <button
                            onClick={handleCancel}
                            disabled={isCancelling}
                            className={`cursor-pointer w-full py-2.5 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 transition-all shadow-md flex items-center justify-center`}
                        >
                            {isCancelling ? (
                                <>
                                    <Loader2 size={16} className="animate-spin mr-2" />
                                    Cancelling...
                                </>
                            ) : (
                                "Cancel Trip"
                            )}
                        </button>
                    )}

                    {trip.status === "Completed" && (
                        <button className="w-full py-2.5 text-sm font-medium rounded-xl text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all shadow-sm">
                            View Receipt
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/* --- Subcomponent for uniform row layout --- */
const DetailRow = ({ icon, label, value, strong, highlight }) => (
    <p className="flex justify-between items-center">
        <span className="flex items-center gap-2 text-gray-500 font-medium">
            {icon} {label}:
        </span>
        <span
            className={`${strong ? "font-semibold" : ""
                } ${highlight ? "text-indigo-700 font-bold text-base" : "text-gray-800"}`}
        >
            {value}
        </span>
    </p>
);

export default TripCard;
