"use client";
"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, RefreshCw, X } from "lucide-react";
import ProtectedRoute from "@/utils/ProtectedRoute";
import ProviderBottomNav from "@/components/ProviderBottomNav";
import InlineAlert from "@/components/InlineAlert";

function CarIllustration() {
    return (
        <svg viewBox="0 0 200 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-auto mx-auto drop-shadow-lg">
            {/* Shadow */}
            <ellipse cx="100" cy="86" rx="68" ry="4" fill="#C4B5FD" fillOpacity="0.4" />
            {/* Body */}
            <rect x="12" y="46" width="176" height="36" rx="10" fill="#7C3AED" />
            {/* Roof */}
            <path d="M44 46 L60 20 Q68 10 82 9 L120 9 Q134 10 142 20 L158 46Z" fill="#6D28D9" />
            {/* Window left */}
            <rect x="62" y="15" width="32" height="23" rx="5" fill="#A5F3FC" fillOpacity="0.85" />
            {/* Window right */}
            <rect x="100" y="15" width="34" height="23" rx="5" fill="#A5F3FC" fillOpacity="0.85" />
            {/* Window shine */}
            <rect x="64" y="17" width="10" height="4" rx="2" fill="white" fillOpacity="0.5" />
            <rect x="102" y="17" width="10" height="4" rx="2" fill="white" fillOpacity="0.5" />
            {/* Headlight */}
            <rect x="172" y="52" width="12" height="7" rx="3" fill="#FDE68A" />
            {/* Taillight */}
            <rect x="16" y="52" width="10" height="7" rx="3" fill="#FCA5A5" />
            {/* Door line */}
            <line x1="100" y1="46" x2="100" y2="82" stroke="#6D28D9" strokeWidth="1.5" strokeOpacity="0.4" />
            {/* Door handle left */}
            <rect x="68" y="62" width="16" height="4" rx="2" fill="#8B5CF6" />
            {/* Door handle right */}
            <rect x="116" y="62" width="16" height="4" rx="2" fill="#8B5CF6" />
            {/* Wheel left outer */}
            <circle cx="53" cy="80" r="13" fill="#1E1B4B" />
            <circle cx="53" cy="80" r="8" fill="#4C1D95" />
            <circle cx="53" cy="80" r="4" fill="#DDD6FE" />
            <circle cx="53" cy="80" r="1.5" fill="white" />
            {/* Wheel right outer */}
            <circle cx="149" cy="80" r="13" fill="#1E1B4B" />
            <circle cx="149" cy="80" r="8" fill="#4C1D95" />
            <circle cx="149" cy="80" r="4" fill="#DDD6FE" />
            <circle cx="149" cy="80" r="1.5" fill="white" />
        </svg>
    );
}

const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-sm p-5 animate-pulse">
        <div className="h-20 bg-gray-100 rounded-xl mb-4" />
        <div className="h-5 bg-gray-100 rounded w-1/2 mx-auto mb-4" />
        <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-2/3 mb-5" />
        <div className="flex gap-3">
            <div className="flex-1 h-12 bg-gray-100 rounded-xl" />
            <div className="flex-1 h-12 bg-violet-100 rounded-xl" />
        </div>
    </div>
);

const REJECT_REASONS = [
    "No seats available",
    "Route changed",
    "Vehicle issue",
    "Personal emergency",
    "Other",
];

export default function ProviderBookingRequestsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");
    const [processing, setProcessing] = useState({});
    const [actionMsg, setActionMsg] = useState({ type: "", text: "" });
    const [rejectModal, setRejectModal] = useState(null); // { bookingId }
    const [rejectReason, setRejectReason] = useState("");
    const [rejectError, setRejectError] = useState("");

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setFetchError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/provider-bookings", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) setBookings(data.data);
            else throw new Error(data.message);
        } catch {
            setFetchError("Could not load booking requests. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    const handleAction = async (bookingId, action, reason = "") => {
        setProcessing(p => ({ ...p, [bookingId]: action }));
        setActionMsg({ type: "", text: "" });
        try {
            const token = localStorage.getItem("token");
            const url = action === "accept"
                ? `/api/bookings/${bookingId}/accept`
                : `/api/bookings/${bookingId}/cancel`;
            const res = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: reason ? JSON.stringify({ reason }) : undefined,
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setActionMsg({
                    type: "success",
                    text: action === "accept" ? "Booking accepted! Ride is now active." : "Booking cancelled.",
                });
                setBookings(prev => prev.map(b =>
                    b._id === bookingId
                        ? { ...b, status: action === "accept" ? "Active" : "Cancelled" }
                        : b
                ));
                setTimeout(() => setActionMsg({ type: "", text: "" }), 4000);
            } else {
                setActionMsg({ type: "error", text: data.message || "Action failed. Please try again." });
            }
        } catch {
            setActionMsg({ type: "error", text: "Network error. Please check your connection." });
        } finally {
            setProcessing(p => ({ ...p, [bookingId]: null }));
        }
    };

    const openRejectModal = (bookingId) => {
        setRejectReason("");
        setRejectModal({ bookingId });
    };

    const confirmReject = async () => {
        if (!rejectReason) { setRejectError("Please select a reason to cancel."); return; }
        setRejectError("");
        const { bookingId } = rejectModal;
        setRejectModal(null);
        await handleAction(bookingId, "reject", rejectReason);
    };

    const pending = bookings.filter(b => b.status === "Pending");
    const others  = bookings.filter(b => b.status !== "Pending");

    return (
        <ProtectedRoute>
            <div className="min-h-screen md:min-h-[calc(100vh-56px)] bg-[#F5F3FF]">

                {/* Header */}
                <div className="bg-white sticky top-0 md:top-14 z-20 border-b border-gray-100">
                    <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
                                <ArrowLeft size={22} className="text-gray-800" />
                            </button>
                            <h1 className="text-base font-extrabold text-gray-900">Booking Requests</h1>
                        </div>
                        <button onClick={fetchBookings} disabled={loading} className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50">
                            <RefreshCw size={14} className={`text-gray-500 ${loading ? "animate-spin" : ""}`} />
                        </button>
                    </div>
                </div>

                <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 pt-5 pb-28 space-y-4">

                    {fetchError && <InlineAlert message={fetchError} onDismiss={() => setFetchError("")} />}
                    {actionMsg.text && (
                        <InlineAlert
                            message={actionMsg.text}
                            type={actionMsg.type === "success" ? "success" : "error"}
                            onDismiss={() => setActionMsg({ type: "", text: "" })}
                        />
                    )}

                    {loading && [1, 2].map(i => <SkeletonCard key={i} />)}

                    {!loading && bookings.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4B5FD" strokeWidth="1.5">
                                    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"/><path d="M16 3H8l-2 4h12l-2-4Z"/>
                                </svg>
                            </div>
                            <p className="text-sm font-bold text-gray-700 mb-1">No booking requests</p>
                            <p className="text-xs text-gray-400">New requests will appear here</p>
                        </div>
                    )}

                    {!loading && pending.map(b => (
                        <BookingRequestCard
                            key={b._id}
                            booking={b}
                            processing={processing[b._id]}
                            onAccept={() => handleAction(b._id, "accept")}
                            onReject={() => openRejectModal(b._id)}
                        />
                    ))}

                    {!loading && others.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Past Requests</p>
                            <div className="space-y-3">
                                {others.map(b => (
                                    <BookingRequestCard
                                        key={b._id}
                                        booking={b}
                                        past
                                        processing={processing[b._id]}
                                        onReject={() => openRejectModal(b._id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <ProviderBottomNav />
            </div>

            {/* Reject Reason Modal */}
            {rejectModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-6 sm:pb-0">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-extrabold text-gray-900">Reason for Rejection</h3>
                            <button onClick={() => setRejectModal(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                                <X size={16} className="text-gray-500" />
                            </button>
                        </div>
                        {rejectError && <div className="mb-3"><InlineAlert message={rejectError} onDismiss={() => setRejectError("")} /></div>}
                        <div className="space-y-2 mb-5">
                            {REJECT_REASONS.map(r => (
                                <button
                                    key={r}
                                    onClick={() => setRejectReason(r)}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold border-2 transition ${
                                        rejectReason === r
                                            ? "border-[#7C3AED] bg-violet-50 text-[#7C3AED]"
                                            : "border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-200"
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setRejectModal(null)}
                                className="flex-1 h-12 border-2 border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReject}
                                disabled={!rejectReason}
                                className="flex-1 h-12 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition disabled:opacity-40"
                            >
                                Reject Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
}

function BookingRequestCard({ booking, processing, onAccept, onReject, past }) {
    const isPending   = booking.status === "Pending";
    const isActive    = booking.status === "Active";
    const isCancelled = booking.status === "Cancelled";

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-4">

                {/* Car + seatsÂ·price */}
                <div className="mb-4">
                    <CarIllustration />
                    <p className="text-center text-base font-extrabold text-gray-900 mt-3">
                        {booking.seatsBooked?.length || booking.numberOfSeats || 1} Seat{(booking.seatsBooked?.length || booking.numberOfSeats || 1) > 1 ? "s" : ""} Â· â‚¹{booking.totalPrice?.toLocaleString("en-IN") || "â€”"}
                    </p>
                </div>

                {/* Pickup & Drop */}
                <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full border-2 border-[#7C3AED] bg-white flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                        </div>
                        <p className="text-sm text-gray-600">
                            <span className="text-gray-400 font-medium">Pickup: </span>
                            <span className="font-semibold text-gray-800">{booking.tripSource?.split(",")[0] || "â€”"}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-[#7C3AED] flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <p className="text-sm text-gray-600">
                            <span className="text-gray-400 font-medium">Drop-off: </span>
                            <span className="font-semibold text-gray-800">{booking.tripDestination?.split(",")[0] || "â€”"}</span>
                        </p>
                    </div>
                </div>

                {/* Traveler name */}
                {booking.travelerName && (
                    <p className="text-xs text-gray-400 mb-4 text-center">Requested by <span className="font-semibold text-gray-600">{booking.travelerName}</span></p>
                )}

                {/* Buttons */}
                {!past && isPending && (
                    <div className="flex gap-3">
                        <button
                            onClick={onReject}
                            disabled={!!processing}
                            className="flex-1 h-12 border-2 border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:border-red-200 hover:text-red-500 transition disabled:opacity-50 flex items-center justify-center"
                        >
                            {processing === "reject" ? <Loader2 size={15} className="animate-spin" /> : "Reject"}
                        </button>
                        <button
                            onClick={onAccept}
                            disabled={!!processing}
                            className="flex-1 h-12 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl text-sm transition disabled:opacity-50 flex items-center justify-center shadow-md shadow-violet-200"
                        >
                            {processing === "accept" ? <Loader2 size={15} className="animate-spin text-white" /> : "Accept"}
                        </button>
                    </div>
                )}

                {/* Past active â€” accepted badge + cancel side by side */}
                {past && isActive && (
                    <div className="flex gap-3">
                        <div className="flex-1 h-12 rounded-xl bg-green-100 text-green-600 text-xs font-bold flex items-center justify-center shadow-sm">
                            Accepted Â· Active
                        </div>
                        <button
                            onClick={onReject}
                            disabled={!!processing}
                            className="flex-1 h-12 bg-red-100 hover:bg-red-500 active:scale-95 text-red-500 hover:text-white font-bold rounded-xl text-sm shadow-sm hover:shadow-md hover:shadow-red-200 transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
                        >
                            {processing === "reject" ? <Loader2 size={13} className="animate-spin" /> : "Cancel"}
                        </button>
                    </div>
                )}

                {(isCancelled || (!isPending && !isActive)) && (
                    <div className={`text-center text-xs font-bold py-2.5 rounded-xl ${
                        isCancelled ? "bg-red-50 text-red-400" : "bg-violet-50 text-violet-500"
                    }`}>
                        {isCancelled ? "Rejected / Cancelled" : "Completed"}
                    </div>
                )}
            </div>
        </div>
    );
}
