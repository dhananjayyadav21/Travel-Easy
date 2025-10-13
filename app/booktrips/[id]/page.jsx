"use client";
import React, { useState, useEffect } from "react";
// 1. Import AlertTriangle
import { MapPin, Calendar, Users, Phone, Ruler, IndianRupee, Waypoints, CheckCircle, Car, X, AlertTriangle } from 'lucide-react';
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const PRICE_PER_KM = 26;

const BookTripPage = () => {
    const router = useRouter();
    // Added tripId and tripName state for API use and display
    const [tripId, setTripId] = useState(null);
    const [tripName, setTripName] = useState("Trip");

    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [contact, setContact] = useState("");
    const [kilometers, setKilometers] = useState(0);
    const [date, setDate] = useState("");
    const [travelerName, setTravelerName] = useState("");
    const [travelerNumber, setTravelerNumber] = useState("");
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const seatCount = selectedSeats.length;

    useEffect(() => {
        const selectedTrip = JSON.parse(localStorage.getItem('selectedTrip') || '{}');
        if (selectedTrip && selectedTrip._id) {
            setTripId(selectedTrip._id);
            setTripName(selectedTrip.name || "Trip");
            setSource(selectedTrip.source || "");
            setDestination(selectedTrip.destination || "");
            // NOTE: Corrected property access from `kilometers` to `kilometer` based on common trip object structure
            setKilometers(selectedTrip.kilometer || 0);
            setDate(selectedTrip.date || "");
            setContact(selectedTrip.contact || "");

            // Get total seats and already booked seats (default 0)
            const totalSeats = parseInt(selectedTrip.seats) || 0;
            const bookedSeats = parseInt(selectedTrip.bookedseats) || 0;

            // Generate seat labels for *AVAILABLE* seats only
            const availableSeats = [];
            // Start seat numbering from bookedSeats + 1 up to totalSeats
            for (let i = bookedSeats + 1; i <= totalSeats; i++) {
                availableSeats.push(`Seat ${i}`);
            }

            setSeats(availableSeats);
        } else {
            // Optional: Handle case where no trip is selected
            if (typeof window !== 'undefined') {
                toast.error("No trip selected. Redirecting.");
                router.push("/");
            }
        }
    }, [router]);


    const handleSeatToggle = (seatLabel) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatLabel)) return prev.filter(s => s !== seatLabel);

            // Allow selecting only if there are available seats remaining in the 'seats' state
            if (prev.length < seats.length) return [...prev, seatLabel];

            toast.error(`You can only book up to ${seats.length} seats for this ride.`);
            return prev;
        });
    };

    useEffect(() => {
        const km = parseFloat(kilometers) || 0;
        const count = selectedSeats.length;
        // Calculate total price: KM * PricePerKM * SeatCount
        setTotalPrice((km > 0 && count > 0) ? km * PRICE_PER_KM * count : 0);
    }, [kilometers, selectedSeats]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !tripId || // Ensure trip ID exists
            !source ||
            !destination ||
            !date ||
            !contact ||
            !travelerName ||
            !travelerNumber ||
            seatCount === 0 ||
            totalPrice === 0
        ) {
            toast.error('Please fill all required fields and select at least one seat.');
            return;
        }

        const bookingDetails = {
            trip: tripId,
            source,
            destination,
            contact,
            travelerName,
            travelerNumber,
            seatsBooked: selectedSeats,
            numberOfSeats: seatCount,
            kilometers,
            date,
            totalPrice,
            ratePerKm: PRICE_PER_KM,
        };

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/bookTrip", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bookingDetails),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Trip booked successfully!");
                setSelectedSeats([]);
                router.push("/travelertrips");
            } else {
                toast.error(data.error || data.message || "Booking failed");
            }
        } catch (error) {
            console.error("Booking Error:", error);
            toast.error("Something went wrong while booking.");
        }
    };

    // 2. Removed the incorrect early return based on seats.length < 0
    // The check is now correctly done in the JSX below.

    return (
        <div className="min-h-screen p-4 sm:p-8 font-inter">
            <div className="max-w-8xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-10 my-4 md:my-1 border border-indigo-100">

                <div className="text-center mb-2 border-b pb-4">
                    <h1 className="text-4xl font-extrabold text-indigo-700 flex items-center justify-center gap-3">
                        <Car size={32} /> Book Your Ride
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg">
                        Fill in your trip details and select your preferred seats.
                    </p>
                </div>

                <button
                    onClick={() => router.back()}
                    className="text-indigo-600 font-bold hover:underline flex items-center gap-1 mb-8"
                >
                    ← Previous Page
                </button>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 flex items-center gap-2">
                                    <Waypoints size={20} className="text-indigo-500" /> Route & Contact Info
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Source */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            <MapPin size={16} /> Source Location
                                        </label>
                                        <input type="text" value={source} onChange={e => setSource(e.target.value)} placeholder="e.g., Mumbai Airport" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition" required />
                                    </div>
                                    {/* Destination */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            <MapPin size={16} /> Destination Location
                                        </label>
                                        <input type="text" value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g., Pune Station" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition" required />
                                    </div>
                                    {/* Date */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            <Calendar size={16} /> Travel Date
                                        </label>
                                        <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition" required />
                                    </div>
                                    {/* Provider Contact */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            <Phone size={16} /> Provider Contact
                                        </label>
                                        <input type="tel" value={contact} onChange={e => setContact(e.target.value)} placeholder="Provider Number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition" required />
                                    </div>
                                    {/* Traveler Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            <Users size={16} /> Traveler Name
                                        </label>
                                        <input type="text" value={travelerName} onChange={e => setTravelerName(e.target.value)} placeholder="Traveler Name" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition" required />
                                    </div>
                                    {/* Traveler Number */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            <Phone size={16} /> Traveler Number
                                        </label>
                                        <input type="tel" value={travelerNumber} onChange={e => setTravelerNumber(e.target.value)} placeholder="Traveler Contact Number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition" required />
                                    </div>
                                    {/* Kilometers */}
                                    <div className="space-y-2 md:col-span-2 pt-4 border-t border-gray-100">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            <Ruler size={16} /> Estimated Trip Distance (KM)
                                        </label>
                                        <input type="number" value={kilometers} onChange={e => setKilometers(Math.max(0, parseFloat(e.target.value)))} placeholder="Enter distance in kilometers to calculate price" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition" required />
                                    </div>
                                </div>
                            </div>

                            {/* Seat Selection */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3 flex items-center gap-2">
                                    <Users size={20} className="text-indigo-500" /> Select Seats Available
                                </h2>

                                {/* 3. Conditional rendering check based on available seats */}
                                {seats.length > 0 ? (
                                    <div className="grid grid-cols-4 gap-3 max-w-lg">
                                        {seats.map(seat => (
                                            <div key={seat} onClick={() => handleSeatToggle(seat)} className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 shadow-sm
                                                ${selectedSeats.includes(seat) ? 'bg-indigo-600 border-indigo-700 text-white shadow-lg scale-[1.02]' : 'bg-white border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-400'}`}>
                                                <Users size={20} className="mb-1" />
                                                <span className="font-bold text-sm text-center">{seat}</span>
                                                {selectedSeats.includes(seat) && <CheckCircle size={16} className="absolute top-2 right-2 text-green-300" />}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg flex items-center gap-3 max-w-lg shadow-inner">
                                        <AlertTriangle size={24} className="flex-shrink-0" />
                                        <span className="font-semibold text-lg">
                                            Not available seats! This trip is fully booked.
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-1">
                            <div className="bg-indigo-50 p-6 rounded-lg shadow-md border border-indigo-200 space-y-4 lg:sticky lg:top-8 mt-8">
                                <h2 className="text-2xl font-bold text-indigo-800 flex items-center gap-2">
                                    <IndianRupee size={24} /> Total Cost Summary
                                </h2>
                                <div className="flex justify-between text-lg font-medium text-gray-700 border-b border-indigo-200 pb-2">
                                    <span>Rate / Seat / KM:</span>
                                    <span className="font-bold text-indigo-700">₹{PRICE_PER_KM}</span>
                                </div>
                                <div className="flex justify-between text-lg font-medium text-gray-700">
                                    <span>Trip Calculation:</span>
                                    <span className="font-bold">({kilometers} km × {PRICE_PER_KM}) × {seatCount} seats</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t-2 border-indigo-400">
                                    <span className="text-xl font-bold text-gray-900">Final Price:</span>
                                    <span className="text-4xl font-extrabold text-indigo-600">₹{totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <button
                                    type="submit"
                                    // Disable if seats.length is 0 or other required fields are missing
                                    disabled={seats.length === 0 || totalPrice === 0 || !contact || !date || seatCount === 0 || !travelerName || !travelerNumber}
                                    className={`w-full py-4 text-xl font-bold text-white rounded-xl transition-all duration-300 shadow-lg
                                    ${seats.length === 0 || totalPrice === 0 || !contact || !date || seatCount === 0 || !travelerName || !travelerNumber
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl'}`}
                                >
                                    {seats.length === 0
                                        ? 'TRIP IS FULL'
                                        : totalPrice > 0 ? `BOOK NOW for ₹${totalPrice.toLocaleString('en-IN')}` : 'Enter Details and Select Seats to Calculate Price'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookTripPage;