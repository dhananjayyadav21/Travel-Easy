"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Users, Car, TrendingUp, UserCheck, ChevronRight, RefreshCw, BarChart2, Shield } from "lucide-react";
import AdminRoute from "@/utils/AdminRoute";
import AdminBottomNav from "@/components/AdminBottomNav";

function formatCurrency(n) {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n}`;
}

function formatCount(n) {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return String(n);
}

function LineChart({ data }) {
    if (!data || data.length === 0) return null;
    const W = 300, H = 90, PAD = 10;
    const max = Math.max(...data, 1);
    const pts = data.map((v, i) => {
        const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
        const y = H - PAD - ((v / max) * (H - PAD * 2));
        return [x, y];
    });
    const polyline = pts.map(([x, y]) => `${x},${y}`).join(" ");
    const fillPath = `M${pts[0][0]},${pts[0][1]} ${pts.map(([x, y]) => `L${x},${y}`).join(" ")} L${pts[pts.length - 1][0]},${H - PAD} L${pts[0][0]},${H - PAD} Z`;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 90 }} preserveAspectRatio="none">
            <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.02" />
                </linearGradient>
            </defs>
            <path d={fillPath} fill="url(#lg)" />
            <polyline points={polyline} fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {pts.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="3.5" fill="white" stroke="#7C3AED" strokeWidth="2" />
            ))}
        </svg>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchStats = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/admin/stats", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch stats");
            setStats(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    const TILES = stats ? [
        { label: "Total Users",    value: formatCount(stats.totalUsers),    icon: Users,     iconBg: "bg-violet-500",  cardBg: "bg-violet-50"  },
        { label: "Total Rides",    value: formatCount(stats.totalRides),    icon: Car,       iconBg: "bg-teal-500",    cardBg: "bg-teal-50"    },
        { label: "Revenue",        value: formatCurrency(stats.totalRevenue), icon: TrendingUp, iconBg: "bg-amber-500", cardBg: "bg-amber-50"  },
        { label: "Active Drivers", value: formatCount(stats.activeDrivers), icon: UserCheck, iconBg: "bg-green-500",  cardBg: "bg-green-50"   },
    ] : [];

    return (
        <AdminRoute>
            <div className="min-h-screen bg-[#F5F3FF] pb-24">

                {/* ── WHITE STICKY HEADER ── */}
                <div className="bg-white border-b border-gray-100 shadow-sm sticky top-14 z-20">
                    <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#7C3AED] flex items-center justify-center">
                                <Shield size={16} className="text-white" />
                            </div>
                            <h1 className="text-base font-extrabold text-gray-900">Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={fetchStats}
                                disabled={loading}
                                className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition"
                            >
                                <RefreshCw size={15} className={`text-gray-500 ${loading ? "animate-spin" : ""}`} />
                            </button>
                            <button className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition relative">
                                <Bell size={15} className="text-gray-500" />
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 pt-4 space-y-4">

                    {loading ? (
                        <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse shadow-sm">
                                    <div className="w-11 h-11 bg-gray-100 rounded-2xl mb-3" />
                                    <div className="h-3 bg-gray-100 rounded w-20 mb-2" />
                                    <div className="h-6 bg-gray-100 rounded w-14" />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
                            <p className="text-sm text-red-600 font-semibold mb-2">{error}</p>
                            <button onClick={fetchStats} className="text-xs text-[#7C3AED] font-bold hover:underline">Retry</button>
                        </div>
                    ) : (
                        <>
                            {/* ── STAT TILES ── */}
                            <div className="grid grid-cols-2 gap-3">
                                {TILES.map(({ label, value, icon: Icon, iconBg, cardBg }) => (
                                    <div key={label} className={`${cardBg} rounded-2xl shadow-sm p-4`}>
                                        <div className={`w-11 h-11 ${iconBg} rounded-2xl flex items-center justify-center mb-3 shadow-sm`}>
                                            <Icon size={20} className="text-white" />
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium">{label}</p>
                                        <p className="text-2xl font-extrabold text-gray-900 mt-0.5 leading-tight">{value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* ── REVENUE CHART ── */}
                            {stats.dailyRevenue && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                                                <BarChart2 size={14} className="text-[#7C3AED]" />
                                            </div>
                                            <p className="text-sm font-bold text-gray-900">Revenue</p>
                                            <span className="text-xs text-gray-400 font-medium">Last 7 days</span>
                                        </div>
                                        <span className="text-sm font-extrabold text-[#7C3AED]">
                                            {formatCurrency(stats.dailyRevenue.reduce((a, b) => a + b, 0))}
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <LineChart data={stats.dailyRevenue} />
                                    </div>
                                    <div className="flex justify-between mt-1 px-1">
                                        {["6d", "5d", "4d", "3d", "2d", "1d", "Today"].map(d => (
                                            <span key={d} className="text-[9px] text-gray-300 font-medium">{d}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* ── QUICK NAV ── */}
                    <div className="space-y-2">
                        {[
                            { label: "Manage Users",  sub: "Block, promote or remove users",   href: "/admin/users",   iconBg: "bg-violet-100", icon: Users,     iconColor: "text-[#7C3AED]" },
                            { label: "View Reports",  sub: "Revenue analytics & trip exports", href: "/admin/reports", iconBg: "bg-teal-100",   icon: BarChart2, iconColor: "text-teal-600"  },
                        ].map(({ label, sub, href, iconBg, icon: Icon, iconColor }) => (
                            <Link
                                key={label}
                                href={href}
                                className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
                            >
                                <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                    <Icon size={18} className={iconColor} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900">{label}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                                </div>
                                <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
            <AdminBottomNav />
        </AdminRoute>
    );
}
