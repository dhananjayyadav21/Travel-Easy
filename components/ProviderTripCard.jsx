"use client";

import { Car, Calendar, Clock, Users, MapPin, Navigation } from 'lucide-react';
import Link from 'next/link';

export default function TripCard({ trip }) {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col gap-4 hover:shadow-xl transition duration-300">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-indigo-600">{trip.name}</h3>
                <span className={`text-sm font-medium px-3 py-1 rounded-full 
                                 ${trip.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                        trip.status === "Active" ? "bg-green-100 text-green-800" :
                            trip.status === "Completed" ? "bg-gray-100 text-gray-800" :
                                "bg-red-100 text-red-800"}`}>
                    {trip.status}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-indigo-600" />
                    <span>{trip.date}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-indigo-600" />
                    <span>{trip.time}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users size={16} className="text-indigo-600" />
                    <span>{trip.seats} Seats</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-indigo-600" />
                    <span>{trip.meetPlace}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Navigation size={16} className="text-indigo-600" />
                    <span>{trip.source} → {trip.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Car size={16} className="text-indigo-600" />
                    <span>{trip.vehicle} ({trip.vehicleType})</span>
                </div>
            </div>

            <div className="flex justify-end mt-4 gap-2">
                <Link href={`/trips/${trip._id}`} className="text-white bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700 transition">
                    View Details
                </Link>
            </div>
        </div>
    );
}
