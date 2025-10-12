"use client";
import React, { useState, useEffect } from "react";
// Lucide Icons
import {
    MapPin, Calendar, Users, Phone, Ruler, IndianRupee, Waypoints, CheckCircle, Car, X
} from 'lucide-react';

// Price constant
const PRICE_PER_KM = 26;

// Defines the available seat labels
const SEAT_LABELS = ['Seat 1', 'Seat 2', 'Seat 3', 'Seat 4'];

// Custom Modal Component to replace alert()
const NotificationModal = ({ message, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl border-t-4 border-indigo-600 space-y-4 transform transition-all duration-300 scale-100">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-indigo-700">Booking Status</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X size={20} />
                    </button>
                </div>
                <p className="text-gray-600">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

const BookTripPage = () => {
    // Input States
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [contact, setContact] = useState("");
    const [kilometers, setKilometers] = useState(0);
    const [date, setDate] = useState("");
    const [selectedSeats, setSelectedSeats] = useState([]);

    // Calculation/UI States
    const [totalPrice, setTotalPrice] = useState(0);
    const seatCount = selectedSeats.length;

    // Modal States (REPLACING alert())
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const showModal = (message) => {
        setModalMessage(message);
        setIsModalOpen(true);
    };

    // --- Seat Toggle Logic for Multi-Selection ---
    const handleSeatToggle = (seatLabel) => {
        setSelectedSeats(prevSeats => {
            if (prevSeats.includes(seatLabel)) {
                // Deselect seat
                return prevSeats.filter(seat => seat !== seatLabel);
            } else if (prevSeats.length < SEAT_LABELS.length) {
                // Select seat, ensuring total seats don't exceed availability (4)
                return [...prevSeats, seatLabel].sort();
            } else {
                showModal("You can only book up to 4 seats for this ride.");
                return prevSeats;
            }
        });
    };

    // --- Price Calculation Logic (The part the user asked to ensure is working) ---
    // Recalculates price whenever kilometers or selectedSeats change.
    useEffect(() => {
        const km = parseFloat(kilometers) || 0;
        const count = selectedSeats.length;

        if (km > 0 && count > 0) {
            // Calculation: Kilometers * Rate Per KM * Number of Seats
            const calculated = km * PRICE_PER_KM * count;
            setTotalPrice(calculated);
        } else {
            setTotalPrice(0);
        }
    }, [kilometers, selectedSeats]);
    // ----------------------------------------

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!source || !destination || !date || !contact || seatCount === 0 || totalPrice === 0) {
            showModal('Please fill all required fields, select at least one seat, and ensure distance is entered correctly.');
            return;
        }

        const bookingDetails = {
            source,
            destination,
            contact,
            seatsBooked: selectedSeats,
            numberOfSeats: seatCount,
            kilometers,
            date,
            totalPrice,
            ratePerKm: PRICE_PER_KM
        };

        console.log("Trip Booked:", bookingDetails);
        showModal(`Trip successfully simulated! Total Price: ₹${totalPrice.toLocaleString('en-IN')} for ${seatCount} seats: ${selectedSeats.join(', ')}.`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-inter">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-10 border border-indigo-100">

                {/* Header */}
                <div className="text-center mb-8 border-b pb-4">
                    <h1 className="text-4xl font-extrabold text-indigo-700 flex items-center justify-center gap-3">
                        <Car size={32} /> Book Your Ride
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg">
                        Fill in your trip details and select your preferred seats.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Trip Details */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 flex items-center gap-2">
                            <Waypoints size={20} className="text-indigo-500" /> Route & Contact Info
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Source */}
                            <div className="space-y-2">
                                <label htmlFor="source" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <MapPin size={16} /> Source Location (Start)
                                </label>
                                <input
                                    id="source"
                                    type="text"
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                    placeholder="e.g., Mumbai Airport"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
                                />
                            </div>

                            {/* Destination */}
                            <div className="space-y-2">
                                <label htmlFor="destination" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <MapPin size={16} /> Destination Location (End)
                                </label>
                                <input
                                    id="destination"
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="e.g., Pune Station"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
                                />
                            </div>

                            {/* Date */}
                            <div className="space-y-2">
                                <label htmlFor="date" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <Calendar size={16} /> Date of Travel
                                </label>
                                <input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            {/* Contact Number */}
                            <div className="space-y-2">
                                <label htmlFor="contact" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <Phone size={16} /> Contact Number
                                </label>
                                <input
                                    id="contact"
                                    type="tel"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    placeholder="e.g., 9876543210"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
                                />
                            </div>
                        </div>

                        {/* Kilometers (full width) */}
                        <div className="space-y-2 pt-4 border-t border-gray-100">
                            <label htmlFor="kilometers" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                <Ruler size={16} /> Estimated Trip Distance (Kilometers)
                            </label>
                            <input
                                id="kilometers"
                                type="number"
                                value={kilometers}
                                onChange={(e) => setKilometers(Math.max(0, parseFloat(e.target.value) || 0))}
                                min="0"
                                placeholder="Enter distance in kilometers to calculate price"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
                            />
                        </div>
                    </div>

                    {/* Multi-Seat Selection */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 flex items-center gap-2">
                            <Users size={20} className="text-indigo-500" /> Select Seats Available
                        </h2>

                        <div className="grid grid-cols-4 gap-3 max-w-lg">
                            {SEAT_LABELS.map((seatLabel) => (
                                <div
                                    key={seatLabel}
                                    onClick={() => handleSeatToggle(seatLabel)}
                                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 shadow-sm
                                        ${selectedSeats.includes(seatLabel)
                                            ? 'bg-indigo-600 border-indigo-700 text-white shadow-lg scale-[1.02]'
                                            : 'bg-white border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-400'
                                        }`}
                                >
                                    <Users size={20} className="mb-1" />
                                    <span className="font-bold text-sm text-center">{seatLabel}</span>
                                    {selectedSeats.includes(seatLabel) && (
                                        <CheckCircle size={16} className="absolute top-2 right-2 text-green-300" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Summary of Selection */}
                        {seatCount > 0 && (
                            <div className="space-y-2 mt-4 bg-white p-4 rounded-lg border border-green-100 shadow-inner">
                                <p className="text-sm text-green-700 flex items-center gap-1 font-semibold">
                                    <CheckCircle size={16} /> Total Seats Selected: <span className="font-bold text-base">{seatCount}</span>
                                </p>
                                <p className="text-xs text-gray-600 pl-1">
                                    Selected Seat Nos: {selectedSeats.join(', ')}
                                </p>
                            </div>
                        )}
                        {seatCount === 0 && (
                            <p className="text-sm text-red-600 pl-1">
                                Please select at least one seat.
                            </p>
                        )}
                    </div>

                    {/* Price Summary */}
                    <div className="bg-indigo-50 p-6 rounded-xl shadow-inner border border-indigo-200 space-y-4">
                        <h2 className="text-2xl font-bold text-indigo-800 flex items-center gap-2">
                            <IndianRupee size={24} /> Total Cost Summary
                        </h2>

                        <div className="flex justify-between text-lg font-medium text-gray-700 border-b border-indigo-200 pb-2">
                            <span>Rate / Seat / KM:</span>
                            <span className="font-bold text-indigo-700">₹{PRICE_PER_KM}</span>
                        </div>

                        <div className="flex justify-between text-lg font-medium text-gray-700">
                            <span>Trip Calculation:</span>
                            <span className="font-bold">({kilometers} km x {PRICE_PER_KM}) x {seatCount} seats</span>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t-2 border-indigo-400">
                            <span className="text-xl font-bold text-gray-900">Final Price:</span>
                            <span className="text-4xl font-extrabold text-indigo-600">
                                ${{ PRICE_PER_KM } * { seatCount }}
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={totalPrice === 0 || !contact || !date || seatCount === 0}
                            className={`w-full py-4 text-xl font-bold text-white rounded-xl transition-all duration-300 shadow-md ${totalPrice === 0 || !contact || !date || seatCount === 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                                }`}
                        >
                            {totalPrice > 0 ? `BOOK NOW for ₹${totalPrice.toLocaleString('en-IN')}` : 'Enter Details and Select Seats to Calculate Price'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Custom Notification Modal */}
            <NotificationModal
                message={modalMessage}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default BookTripPage;
