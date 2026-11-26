"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Search, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import Footer from "@/components/Footer";

const FAQS = [
    {
        category: "Booking",
        items: [
            {
                q: "How do I book a seat on a trip?",
                a: "Search for a trip by entering your source and destination. Browse available trips, click on one that suits you, select your seat(s), review the total fare, and confirm your booking. You'll receive a confirmation on screen.",
            },
            {
                q: "Can I book multiple seats at once?",
                a: "Yes! On the booking page, you can select multiple available seats in one go. The fare is calculated per seat × ₹8 per km.",
            },
            {
                q: "How do I cancel a booking?",
                a: "Go to your Trips dashboard and find the booking you want to cancel. Tap 'Cancel Booking' — cancellations are free and can be done any time before the trip departs.",
            },
            {
                q: "What happens if the driver cancels my trip?",
                a: "If a driver cancels a trip, all bookings for that trip are automatically cancelled. You'll see the updated status in your Trips dashboard. No payment is charged since payments are made on arrival.",
            },
            {
                q: "Can I track my trip in real time?",
                a: "Yes. Once your trip is active, open it from your Trips dashboard and you'll see a live GPS map showing the driver's current location.",
            },
        ],
    },
    {
        category: "Payments",
        items: [
            {
                q: "How does payment work?",
                a: "TravelEasyHai uses a 'Pay on Arrival' model. You pay the driver directly at the end of the ride — by cash or UPI. We do not process or hold any payments.",
            },
            {
                q: "What is the platform fee?",
                a: "There is a ₹15 platform fee per booking. This is included in the total fare shown at checkout.",
            },
            {
                q: "How is the fare calculated?",
                a: "Fare = Number of seats × ₹8 per km × distance + ₹15 platform fee. The exact amount is shown before you confirm the booking — no surprises.",
            },
            {
                q: "Can a driver charge more than the displayed fare?",
                a: "No. Drivers agree to the platform pricing when they list a trip. If a driver demands more than the displayed fare, please report it to us immediately.",
            },
        ],
    },
    {
        category: "Safety",
        items: [
            {
                q: "Are drivers verified?",
                a: "Yes. Every driver goes through an ID verification process. Their vehicle number, PAN card, and contact details are verified before they can list a ride.",
            },
            {
                q: "How do I share my trip with family?",
                a: "On the active trip screen, there is a 'Share Trip' button that generates a link. Family members can open this link to track your live location during the ride.",
            },
            {
                q: "What should I do in an emergency during a ride?",
                a: "Call 112 (national emergency number) immediately. After the situation is safe, report the incident to us at support@traveleasyhai.com with your booking ID.",
            },
            {
                q: "What items are prohibited in the vehicle?",
                a: "Firearms, illegal substances, flammable materials, or any item that poses a risk to fellow passengers or the driver. Violations should be reported to us immediately.",
            },
        ],
    },
    {
        category: "Account",
        items: [
            {
                q: "How do I create an account?",
                a: "Tap 'Register' on the home screen. Enter your name, email, phone number, and choose your role (Traveller or Driver). Verify your email with the OTP sent to you, and you're set.",
            },
            {
                q: "I didn't receive my OTP. What should I do?",
                a: "Check your spam/junk folder. If it's not there, wait 2 minutes and try resending. If the issue persists, contact us at support@traveleasyhai.com.",
            },
            {
                q: "Can I be both a traveller and a driver?",
                a: "Currently each account has one role — either Traveller or Driver. You can register a second account with a different email to use both roles.",
            },
            {
                q: "How do I delete my account?",
                a: "Account deletion is currently handled manually. Email us at support@traveleasyhai.com with the subject 'Account Deletion Request' and we'll delete your account and data within 30 days.",
            },
        ],
    },
];

export default function HelpPage() {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState({});

    const toggle = (key) => setOpen(prev => ({ ...prev, [key]: !prev[key] }));

    const normalised = query.trim().toLowerCase();
    const filtered = FAQS.map(section => ({
        ...section,
        items: section.items.filter(
            item =>
                !normalised ||
                item.q.toLowerCase().includes(normalised) ||
                item.a.toLowerCase().includes(normalised)
        ),
    })).filter(section => section.items.length > 0);

    return (
        <div className="min-h-screen bg-[#F5F3FF]">

            {/* Header */}
            <div className="bg-white sticky top-0 md:top-14 z-20 border-b border-gray-100">
                <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 h-14 flex items-center gap-3">
                    <Link href="/" className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition flex-shrink-0">
                        <ArrowLeft size={16} className="text-gray-600" />
                    </Link>
                    <h1 className="text-base font-extrabold text-gray-900">Help &amp; FAQ</h1>
                </div>
            </div>

            <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 pt-5 pb-16 space-y-4">

                {/* Search */}
                <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search for answers…"
                        className="w-full h-12 pl-11 pr-4 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-violet-100 transition shadow-sm"
                    />
                </div>

                {/* Results or empty state */}
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                        <p className="text-sm font-bold text-gray-900 mb-1">No results found</p>
                        <p className="text-xs text-gray-400 mb-4">Try different keywords, or reach out to us directly.</p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7C3AED] text-white text-sm font-bold rounded-xl hover:bg-[#6D28D9] transition"
                        >
                            <MessageSquare size={14} />
                            Contact Support
                        </Link>
                    </div>
                ) : (
                    filtered.map(section => (
                        <div key={section.category} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-5 py-3.5 border-b border-gray-50">
                                <p className="text-xs font-bold text-[#7C3AED] uppercase tracking-widest">{section.category}</p>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {section.items.map((item, i) => {
                                    const key = `${section.category}-${i}`;
                                    const isOpen = !!open[key];
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => toggle(key)}
                                            className="w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-gray-50/60 transition"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 leading-snug">{item.q}</p>
                                                {isOpen && (
                                                    <p className="text-sm text-gray-500 leading-relaxed mt-2">{item.a}</p>
                                                )}
                                            </div>
                                            <div className="flex-shrink-0 mt-0.5 text-gray-400">
                                                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}

                {/* Still need help CTA */}
                <div
                    className="rounded-2xl px-5 py-5 flex items-center justify-between gap-4"
                    style={{ background: "linear-gradient(135deg, #2D1B69 0%, #7C3AED 100%)" }}
                >
                    <div>
                        <p className="text-sm font-extrabold text-white mb-0.5">Still need help?</p>
                        <p className="text-xs text-violet-200">Our support team replies within 2 hours.</p>
                    </div>
                    <Link
                        href="/contact"
                        className="flex-shrink-0 px-4 py-2.5 bg-white text-[#7C3AED] font-bold text-xs rounded-xl hover:bg-violet-50 transition shadow-sm whitespace-nowrap"
                    >
                        Contact Us
                    </Link>
                </div>

            </div>

            <Footer />
        </div>
    );
}
