"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/utils/ProtectedRoute";
import ProviderBottomNav from "@/components/ProviderBottomNav";
import { useRouter } from "next/navigation";
import { Bell, ChevronLeft, TrendingUp } from "lucide-react";

const TABS = ["Today", "Week", "Month"];

function getDateRange(tab) {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    if (tab === "Today") return { from: today, to: today };
    if (tab === "Week") {
        const d = new Date(now);
        d.setDate(d.getDate() - 6);
        return { from: d.toISOString().split("T")[0], to: today };
    }
    const d = new Date(now);
    d.setDate(d.getDate() - 29);
    return { from: d.toISOString().split("T")[0], to: today };
}

function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().split("T")[0]);
    }
    return days;
}

export default function ProviderEarningsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("Week");
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/providertrips", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) setTrips(data.trips || []);
            } catch { /* ignore */ } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    const { from, to } = getDateRange(activeTab);

    const filteredTrips = trips.filter(t => {
        if (!t.date) return false;
        return t.date >= from && t.date <= to && t.status !== "Cancelled";
    });

    const totalEarnings = filteredTrips.reduce(
        (sum, t) => sum + (t.kilometer || 0) * 8 * (t.bookedseats || 0),
        0
    );

    // Build 7-day earnings map for the bar chart
    const last7 = getLast7Days();
    const earningsByDay = {};
    last7.forEach(d => { earningsByDay[d] = 0; });
    trips.forEach(t => {
        if (t.date && earningsByDay[t.date] !== undefined && t.status !== "Cancelled") {
            earningsByDay[t.date] += (t.kilometer || 0) * 8 * (t.bookedseats || 0);
        }
    });
    const barValues = last7.map(d => earningsByDay[d]);
    const maxBar = Math.max(...barValues, 1);
    const dayLabels = last7.map(d => {
        const date = new Date(d);
        return date.toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 3);
    });
    const todayLabel = new Date().toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 3);

    // Percentage change vs previous period (simple: compare first half vs second half of trips)
    const half = Math.floor(filteredTrips.length / 2);
    const prevEarnings = filteredTrips.slice(0, half).reduce((s, t) => s + (t.kilometer || 0) * 8 * (t.bookedseats || 0), 0);
    const pctChange = prevEarnings > 0 ? Math.round(((totalEarnings - prevEarnings) / prevEarnings) * 100) : null;

    const BAR_H = 80;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#F5F3FF]">

                {/* Header */}
                <div className="bg-white border-b border-violet-100 sticky top-14 z-20">
                    <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                            >
                                <ChevronLeft size={18} className="text-gray-700" />
                            </button>
                            <h1 className="text-base font-extrabold text-gray-900">Earnings</h1>
                        </div>
                        <button className="w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center hover:bg-violet-100 transition">
                            <Bell size={16} className="text-[#7C3AED]" />
                        </button>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto px-4 pt-5 pb-28 space-y-4">

                    {/* Tab switcher */}
                    <div className="bg-white rounded-2xl border border-violet-100 shadow-sm p-1.5 flex gap-1">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 h-9 rounded-xl text-sm font-bold transition-all ${
                                    activeTab === tab
                                        ? "bg-[#7C3AED] text-white shadow-md shadow-violet-200"
                                        : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Earnings stat */}
                    <div className="bg-white rounded-2xl border border-violet-100 shadow-sm p-6">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">
                            {activeTab === "Today" ? "Today" : activeTab === "Week" ? "This Week" : "This Month"}
                        </p>
                        <div className="flex items-end gap-3 mb-1">
                            <span className="text-4xl font-extrabold text-gray-900">
                                ₹{loading ? "—" : totalEarnings.toLocaleString("en-IN")}
                            </span>
                            {pctChange !== null && (
                                <span className={`flex items-center gap-1 text-sm font-bold mb-1 ${pctChange >= 0 ? "text-green-600" : "text-red-500"}`}>
                                    <TrendingUp size={14} />
                                    {pctChange >= 0 ? "+" : ""}{pctChange}%
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-400">{filteredTrips.length} completed rides</p>

                        {/* Bar chart */}
                        <div className="mt-6">
                            <svg width="100%" height={BAR_H + 24} viewBox={`0 0 ${last7.length * 44} ${BAR_H + 24}`} preserveAspectRatio="none">
                                {barValues.map((val, i) => {
                                    const barH = Math.max(4, Math.round((val / maxBar) * BAR_H));
                                    const x = i * 44 + 6;
                                    const y = BAR_H - barH;
                                    const isToday = dayLabels[i] === todayLabel;
                                    return (
                                        <g key={i}>
                                            <rect
                                                x={x}
                                                y={y}
                                                width={32}
                                                height={barH}
                                                rx={6}
                                                fill={isToday || val > 0 ? "#7C3AED" : "#EDE9FE"}
                                                opacity={isToday ? 1 : val > 0 ? 0.6 : 0.3}
                                            />
                                            <text
                                                x={x + 16}
                                                y={BAR_H + 16}
                                                textAnchor="middle"
                                                fontSize="9"
                                                fill={isToday ? "#7C3AED" : "#9CA3AF"}
                                                fontWeight={isToday ? "700" : "500"}
                                            >
                                                {dayLabels[i]}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>

                    {/* Breakdown */}
                    {!loading && filteredTrips.length > 0 && (
                        <div>
                            <p className="text-sm font-bold text-gray-900 mb-3">Ride Breakdown</p>
                            <div className="space-y-2">
                                {filteredTrips.slice(0, 5).map(t => {
                                    const earned = (t.kilometer || 0) * 8 * (t.bookedseats || 0);
                                    return (
                                        <div key={t._id} className="bg-white rounded-2xl border border-violet-100 shadow-sm px-4 py-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {t.source?.split(",")[0]} → {t.destination?.split(",")[0]}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">{t.date} · {t.bookedseats || 0} seats</p>
                                            </div>
                                            <p className="text-sm font-extrabold text-[#7C3AED]">₹{earned.toLocaleString("en-IN")}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* View Details */}
                    <button
                        onClick={() => router.push("/providertrips")}
                        className="w-full h-14 border-2 border-[#7C3AED] text-[#7C3AED] font-bold rounded-2xl text-base hover:bg-violet-50 transition"
                    >
                        View All Rides
                    </button>

                </div>

                <ProviderBottomNav />
            </div>
        </ProtectedRoute>
    );
}
