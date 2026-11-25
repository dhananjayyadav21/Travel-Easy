"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

export default function RateTripModal({ bookingId, onClose, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover]   = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!rating) { toast.error("Please select a rating."); return; }
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ bookingId, rating, comment }),
            });
            const data = await res.json();
            if (res.ok) { toast.success("Thanks for your review!"); onSuccess?.(); onClose(); }
            else toast.error(data.message || "Failed to submit review.");
        } catch { toast.error("Something went wrong."); }
        finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
            {/* Back arrow */}
            <div className="px-5 pt-5 flex-shrink-0">
                <button onClick={onClose} className="p-1">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
                    </svg>
                </button>
            </div>

            {/* Center content */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">

                {/* Green checkmark */}
                <div className="w-28 h-28 rounded-full bg-green-500 flex items-center justify-center mb-7 shadow-xl shadow-green-200/60">
                    <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Trip Completed!</h2>
                <p className="text-sm text-gray-500 mb-7">Rate your ride experience</p>

                {/* Stars */}
                <div className="flex gap-3 justify-center mb-6">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setRating(s)}
                            onMouseEnter={() => setHover(s)}
                            onMouseLeave={() => setHover(0)}
                            className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                        >
                            <Star
                                size={42}
                                className={(hover || rating) >= s ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
                            />
                        </button>
                    ))}
                </div>

                {/* Optional comment — only show after star selected */}
                {rating > 0 && (
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience... (optional)"
                        maxLength={500}
                        rows={2}
                        className="w-full rounded-2xl border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-violet-100 resize-none text-gray-800 placeholder-gray-400 mb-5"
                    />
                )}
            </div>

            {/* Bottom buttons */}
            <div className="flex-shrink-0 px-8 pb-8 flex flex-col gap-3">
                <button
                    onClick={handleSubmit}
                    disabled={loading || !rating}
                    className="w-full py-4 bg-[#6C2BD9] hover:bg-[#5B21B6] disabled:opacity-40 text-white font-bold rounded-full text-base transition-all shadow-lg shadow-violet-300/40 active:scale-[0.98]"
                >
                    {loading ? "Submitting..." : "Submit Rating"}
                </button>
                <button
                    onClick={onClose}
                    className="w-full py-3 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                >
                    View Details
                </button>
            </div>
        </div>
    );
}
