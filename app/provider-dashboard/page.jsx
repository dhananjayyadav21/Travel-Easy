"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/utils/ProtectedRoute";

import {
    Car,
    Calendar,
    Clock,
    Users,
    MapPin,
    Phone,
    CreditCard,
    ChevronLeft,
    Tag,
    Navigation,
    Home,
    Ruler,
} from 'lucide-react';

// Custom Input Component with Icon and Label (Light Theme Adjusted)
const InputField = ({ icon: Icon, label, ...props }) => (
    <div className="relative group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <div className="flex items-center bg-white rounded-lg border border-gray-300 focus-within:border-indigo-500 transition-all duration-200">
            {/* Input icon */}
            <div className="p-3 text-indigo-600">
                <Icon size={20} />
            </div>
            {/* Input element */}
            <input
                {...props}
                className="w-full bg-transparent text-gray-900 py-3 pr-4 rounded-r-lg placeholder-gray-500 focus:outline-none"
            />
        </div>
    </div>
);


export default function AddTrip() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const [trip, setTrip] = useState({
        name: "",
        date: "",
        time: "",
        seats: "",
        source: "",
        destination: "",
        kilometer: "",
        meetPlace: "",
        contact: "",
        vehicle: "",
        vehicleType: "",
        panCard: "",

    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTrip({ ...trip, [name]: value });
    };

    // Resets the form fields and displays a confirmation message.
    const handleReset = () => {
        setTrip({
            name: "", date: "", time: "", seats: "",
            source: "", destination: "", kilometer: "", meetPlace: "",
            contact: "", vehicle: "", vehicleType: "", panCard: "",
        });
        setMessage({ type: "info", text: "Form fields have been successfully reset." });

        // Clear the info message after a few seconds
        setTimeout(() => setMessage(null), 3000);
    };

    //Handles form submission, validation, API call, and state management.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Basic validation: Check if any field is empty
        for (let key in trip) {
            if (!trip[key]) {

                // error message
                setMessage({ type: "error", text: `${key.charAt(0).toUpperCase() + key.slice(1)} is required.` });
                setLoading(false);
                return;
            }
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/addtrip", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(trip),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Failed to add trip.");
            }

            setMessage({ type: "success", text: "Trip successfully published. The form has been reset for a new entry." }); // 

            // Clear form fields after successful submission
            setTrip({
                name: "",
                date: "",
                time: "",
                seats: "",
                source: "",
                destination: "",
                kilometer: "",
                meetPlace: "",
                contact: "",
                vehicle: "",
                vehicleType: "",
                panCard: "",
            });

            // Redirect logic is removed

        } catch (err) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            {/* Modern Background: Light gray background */}
            <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 font-inter">

                {/* Main Card: White background, light shadow, increased max width */}
                <div className="bg-white w-full max-w-7xl p-6 sm:p-10 rounded-xl shadow-xl border border-gray-200 space-y-8">

                    {/* Header and Reset Button */}
                    <div className="flex items-center justify-between border-b border-gray-300 pb-4">
                        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                            <Car size={32} className="text-indigo-600" />
                            Offer a New Ride
                        </h2>
                        {/* Reset button now clears the form */}
                        <button
                            onClick={handleReset}
                            className="flex items-center text-gray-600 hover:text-indigo-600 transition"
                        >
                            <ChevronLeft size={20} />
                            Reset Form
                        </button>
                    </div>

                    {/* Message Alert (Colors adjusted for light background) */}
                    {message && (
                        <div
                            className={`p-4 rounded-xl text-sm font-medium ${message.type === "success"
                                ? "bg-green-100 text-green-700 border border-green-400"
                                : message.type === "error"
                                    ? "bg-red-100 text-red-700 border border-red-400"
                                    : "bg-blue-100 text-blue-700 border border-blue-400" // Info style for reset
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Form Sections Container: Responsive layout */}
                        <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">

                            {/* Left Column: Basic Info and Route Details (2/3 width on large screens) */}
                            <div className="flex flex-col space-y-8 lg:w-2/3">

                                {/* Section 1: Trip Details */}
                                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-6 flex-shrink-0">
                                    <h3 className="text-xl font-bold text-indigo-600 border-b border-indigo-500/50 pb-2">1. Basic Ride Information</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            icon={Tag}
                                            label="Trip Name"
                                            type="text"
                                            name="name"
                                            placeholder="Enter a descriptive name"
                                            value={trip.name}
                                            onChange={handleChange}
                                        />
                                        <InputField
                                            icon={Users}
                                            label="Available Seats"
                                            type="tel"
                                            name="seats"
                                            placeholder="Number of available seats"
                                            value={trip.seats}
                                            onChange={handleChange}
                                            min="1"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <InputField
                                            icon={Calendar}
                                            label="Date"
                                            type="date"
                                            name="date"
                                            value={trip.date}
                                            onChange={handleChange}
                                        />
                                        <InputField
                                            icon={Clock}
                                            label="Departure Time"
                                            type="time"
                                            name="time"
                                            value={trip.time}
                                            onChange={handleChange}
                                        />
                                        <InputField
                                            icon={Home}
                                            label="Meeting Point"
                                            type="text"
                                            name="meetPlace"
                                            placeholder="Specify the meeting location"
                                            value={trip.meetPlace}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Section 2: Route */}
                                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-6 flex-grow">
                                    <h3 className="text-xl font-bold text-indigo-600 border-b border-indigo-500/50 pb-2">2. Route</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            icon={MapPin}
                                            label="Source City/Location"
                                            type="text"
                                            name="source"
                                            placeholder="Starting point (e.g., Mumbai)"
                                            value={trip.source}
                                            onChange={handleChange}
                                        />
                                        <InputField
                                            icon={Navigation}
                                            label="Destination City/Location"
                                            type="text"
                                            name="destination"
                                            placeholder="End point (e.g., Pune)"
                                            value={trip.destination}
                                            onChange={handleChange}
                                        />
                                        <InputField
                                            icon={Ruler}
                                            label="Distance (Kilometers)"
                                            type="number"
                                            name="kilometer"
                                            placeholder="e.g., 180"
                                            value={trip.kilometers}
                                            onChange={handleChange}
                                            min="1"
                                        />
                                    </div>
                                </div>
                            </div>


                            {/* Right Column: Provider Details (1/3 width on large screens) */}
                            <div className="lg:w-1/3">
                                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-6">
                                    <h3 className="text-xl font-bold text-indigo-600 border-b border-indigo-500/50 pb-2">3. Provider and Vehicle</h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        {/* Grid-cols-1 here ensures fields stack in the narrow column on large screens */}
                                        <InputField
                                            icon={Phone}
                                            label="Contact Number"
                                            type="text"
                                            name="contact"
                                            placeholder="Enter your contact number"
                                            value={trip.contact}
                                            onChange={handleChange}
                                        />
                                        <InputField
                                            icon={Car}
                                            label="Vehicle Number"
                                            type="text"
                                            name="vehicle"
                                            placeholder="Registration number (e.g., MH01AB1234)"
                                            value={trip.vehicle}
                                            onChange={handleChange}
                                        />
                                        <InputField
                                            icon={Car}
                                            label="Vehicle Type"
                                            type="text"
                                            name="vehicleType"
                                            placeholder="Vehicle Type (e.g., SUV)"
                                            value={trip.vehicleType}
                                            onChange={handleChange}
                                        />
                                        <InputField
                                            icon={CreditCard}
                                            label="PAN Card Number"
                                            type="text"
                                            name="panCard"
                                            placeholder="PAN for verification"
                                            value={trip.panCard}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Submit Button: Full width, prominent style */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 text-sm font-bold rounded-md 
                                   bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 
                                   hover:bg-indigo-700 transition duration-300 disabled:opacity-50 
                                   disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-t-2 border-t-white border-indigo-300 rounded-full animate-spin"></span>
                                    Processing Request...
                                </>
                            ) : (
                                "Confirm and Publish Trip"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
}
