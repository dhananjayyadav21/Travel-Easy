"use client";
import { useState, useEffect } from "react";
import RoleRoute from "@/utils/RoleRoute";
import ProviderBottomNav from "@/components/ProviderBottomNav";
import TripCard from "@/components/ProviderTripCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Car, TrendingUp, Plus, ChevronRight, FlaskConical } from "lucide-react";
import toast from "react-hot-toast";

function getInitials(name) {
    if (!name) return "P";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function getTodayDateStr() {
    return new Date().toISOString().split("T")[0];
}

export default function ProviderDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [recentTrips, setRecentTrips] = useState([]);
    const [tripsLoading, setTripsLoading] = useState(true);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

    useEffect(() => {
        try {
            const u = JSON.parse(localStorage.getItem("user") || "null");
            setUser(u);
        } catch { }

        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/providertrips/my", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) setRecentTrips(data.trips || []);
            } catch { } finally {
                setTripsLoading(false);
            }
        };
        fetchTrips();
    }, []);

    const today = getTodayDateStr();
    const todayEarnings = recentTrips
        .filter(t => t.date === today && t.status !== "Cancelled")
        .reduce((sum, t) => sum + ((t.kilometer || 0) * 8 * (t.bookedseats || 0)), 0);
    const totalRides = recentTrips.length;

    return (
        <RoleRoute role="provider">
            <div className="min-h-[calc(100vh-56px)] bg-[#F5F3FF]">

                <div className="max-w-lg mx-auto px-5 pt-6 pb-28">

                    {/* Greeting */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <p className="text-xl font-semibold text-gray-700">{greeting},</p>
                            <h1 className="text-xl font-extrabold text-gray-900">
                                {user?.name?.split(" ")[0] || "Driver"}!
                            </h1>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:bg-violet-50 transition relative">
                            <Bell size={18} className="text-[#7C3AED]" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-green-50 rounded-2xl shadow-sm p-4">
                            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center mb-3">
                                <TrendingUp size={18} className="text-white" />
                            </div>
                            <p className="text-xs text-gray-500 font-medium mb-1">Today&apos;s Earnings</p>
                            <p className="text-xl font-extrabold text-gray-900">
                                ₹{todayEarnings.toLocaleString("en-IN")}
                            </p>
                        </div>
                        <div className="bg-violet-50 rounded-2xl shadow-sm p-4">
                            <div className="w-10 h-10 rounded-xl bg-[#7C3AED] flex items-center justify-center mb-3">
                                <Car size={18} className="text-white" />
                            </div>
                            <p className="text-xs text-gray-500 font-medium mb-1">Total Rides</p>
                            <p className="text-xl font-extrabold text-gray-900">{totalRides}</p>
                        </div>
                    </div>

                    {/* Post New Ride button */}
                    <button
                        onClick={() => router.push("/provider-dashboard/create")}
                        className="w-full h-14 bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-[0.98] text-white font-extrabold text-base rounded-full shadow-lg shadow-violet-200 transition-all flex items-center justify-center gap-2 mb-6"
                    >
                        <Plus size={20} />
                        Post New Ride
                    </button>

                    {/* Recent Rides */}
                    {tripsLoading ? (
                        <div className="space-y-3">
                            {[1, 2].map(i => (
                                <div key={i} className="bg-white rounded-2xl p-4 animate-pulse shadow-sm">
                                    <div className="flex gap-3 items-center">
                                        <div className="w-11 h-11 rounded-full bg-gray-100 flex-shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3.5 bg-gray-100 rounded w-2/3" />
                                            <div className="h-3 bg-gray-100 rounded w-1/3" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : recentTrips.length > 0 ? (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-base font-extrabold text-gray-900">Recent Rides</p>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={async () => {
                                            try {
                                                const token = localStorage.getItem("token");
                                                const res = await fetch("/api/seed-trips", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
                                                const data = await res.json();
                                                if (data.success) { toast.success(data.message); window.location.reload(); }
                                                else toast.error(data.message);
                                            } catch { toast.error("Seed failed"); }
                                        }}
                                        className="flex items-center gap-1 text-xs text-gray-300 hover:text-[#7C3AED] transition"
                                        title="Re-seed sample data"
                                    >
                                        <FlaskConical size={12} />
                                    </button>
                                    <Link href="/providertrips" className="text-sm text-[#7C3AED] font-semibold hover:underline flex items-center gap-0.5">
                                        View All <ChevronRight size={14} />
                                    </Link>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                {recentTrips.slice(0, 3).map(t => {
                                    const price = (t.kilometer || 0) * 8 * (t.bookedseats || 0);
                                    return (
                                        <Link key={t._id} href={`/providertrips/${t._id}`} className="block">
                                            <div className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-all flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#6C2BD9] to-[#8B5CF6] flex items-center justify-center text-white font-extrabold text-xs flex-shrink-0">
                                                    {t.source?.split(",")[0]?.slice(0, 2).toUpperCase() || "TR"}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 truncate">
                                                        {t.source?.split(",")[0]} → {t.destination?.split(",")[0]}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        ₹{price.toLocaleString("en-IN")} · {t.kilometer || "—"} km
                                                    </p>
                                                </div>
                                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                                                    t.status === "Active" ? "bg-green-100 text-green-700"
                                                    : t.status === "Completed" ? "bg-violet-100 text-violet-700"
                                                    : "bg-red-100 text-red-600"
                                                }`}>{t.status}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-14 text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                                <Car size={28} className="text-violet-300" />
                            </div>
                            <p className="text-sm font-bold text-gray-700 mb-1">No rides yet</p>
                            <p className="text-xs text-gray-400 mb-5">Post your first ride to start earning</p>
                            <button
                                onClick={() => router.push("/provider-dashboard/create")}
                                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-bold px-6 py-3 rounded-full transition shadow-md shadow-violet-200 flex items-center gap-2 mb-3"
                            >
                                <Plus size={15} /> Post Your First Ride
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const token = localStorage.getItem("token");
                                        const res = await fetch("/api/seed-trips", {
                                            method: "POST",
                                            headers: { Authorization: `Bearer ${token}` },
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                            toast.success(data.message);
                                            window.location.reload();
                                        } else {
                                            toast.error(data.message);
                                        }
                                    } catch { toast.error("Seed failed"); }
                                }}
                                className="text-xs text-gray-400 hover:text-[#7C3AED] font-medium flex items-center gap-1.5 transition"
                            >
                                <FlaskConical size={13} /> Load sample trips for testing
                            </button>
                        </div>
                    )}

                </div>

                <ProviderBottomNav />
            </div>
        </RoleRoute>
    );
}
