"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Shield, LogOut, Mail, Calendar, ChevronRight,
    Users, BarChart2, LayoutDashboard, Lock, AlertTriangle
} from "lucide-react";
import AdminRoute from "@/utils/AdminRoute";
import AdminBottomNav from "@/components/AdminBottomNav";

export default function AdminProfile() {
    const router = useRouter();
    const [user, setUser]           = useState(null);
    const [showLogout, setShowLogout] = useState(false);

    useEffect(() => {
        try {
            const u = JSON.parse(localStorage.getItem("user"));
            setUser(u);
        } catch {}
    }, []);

    const initials = user?.name
        ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
        : "A";

    const joinDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
        : "—";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("authChanged"));
        router.replace("/admin/login");
    };

    const QUICK_LINKS = [
        { label: "Dashboard",     icon: LayoutDashboard, href: "/admin",         color: "text-violet-600", bg: "bg-violet-50"  },
        { label: "Manage Users",  icon: Users,           href: "/admin/users",   color: "text-teal-600",   bg: "bg-teal-50"    },
        { label: "View Reports",  icon: BarChart2,        href: "/admin/reports", color: "text-amber-600",  bg: "bg-amber-50"   },
        { label: "Change Password", icon: Lock,           href: "/admin/login",   color: "text-gray-600",   bg: "bg-gray-50"    },
    ];

    return (
        <AdminRoute>
            <div className="min-h-screen bg-[#F5F3FF] pb-24">

                {/* ── HEADER ── */}
                <div className="bg-white border-b border-gray-100 shadow-sm sticky top-14 z-20">
                    <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#7C3AED] flex items-center justify-center">
                                <Shield size={16} className="text-white" />
                            </div>
                            <h1 className="text-base font-extrabold text-gray-900">Admin Profile</h1>
                        </div>
                        <button
                            onClick={() => setShowLogout(true)}
                            className="flex items-center gap-1.5 px-3 h-8 rounded-xl bg-red-50 border border-red-100 text-red-500 text-xs font-bold hover:bg-red-100 transition"
                        >
                            <LogOut size={13} /> Logout
                        </button>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto px-4 pt-5 space-y-4">

                    {/* ── PROFILE CARD ── */}
                    <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col items-center text-center">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200 mb-4">
                            <span className="text-2xl font-black text-white">{initials}</span>
                        </div>

                        {/* Name */}
                        <h2 className="text-xl font-extrabold text-gray-900">{user?.name || "Admin"}</h2>

                        {/* Role badge */}
                        <div className="flex items-center gap-1.5 mt-2 px-3 py-1 bg-violet-50 rounded-full border border-violet-100">
                            <Shield size={12} className="text-[#7C3AED]" />
                            <span className="text-xs font-bold text-[#7C3AED] uppercase tracking-wide">Super Admin</span>
                        </div>

                        {/* Meta info */}
                        <div className="w-full mt-5 space-y-3 text-left">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                                    <Mail size={14} className="text-[#7C3AED]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Email</p>
                                    <p className="text-sm font-semibold text-gray-800 truncate">{user?.email || "—"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                                    <Calendar size={14} className="text-[#7C3AED]" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Member Since</p>
                                    <p className="text-sm font-semibold text-gray-800">{joinDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── QUICK LINKS ── */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 pt-4 pb-2">Quick Access</p>
                        {QUICK_LINKS.map(({ label, icon: Icon, href, color, bg }, i) => (
                            <button
                                key={label}
                                onClick={() => router.push(href)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition ${i < QUICK_LINKS.length - 1 ? "border-b border-gray-50" : ""}`}
                            >
                                <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                    <Icon size={16} className={color} />
                                </div>
                                <span className="flex-1 text-sm font-semibold text-gray-800 text-left">{label}</span>
                                <ChevronRight size={15} className="text-gray-300" />
                            </button>
                        ))}
                    </div>

                    {/* ── APP INFO ── */}
                    <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
                        <p className="text-xs text-gray-400">TravelEasyHai · Admin Console</p>
                        <p className="text-[11px] text-gray-300 mt-0.5">v1.0 · All rights reserved</p>
                    </div>
                </div>
            </div>

            {/* ── LOGOUT CONFIRM MODAL ── */}
            {showLogout && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4"
                     style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }}>
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
                        <div className="flex flex-col items-center text-center mb-5">
                            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-3">
                                <AlertTriangle size={26} className="text-red-500" />
                            </div>
                            <h3 className="text-lg font-extrabold text-gray-900">Logout?</h3>
                            <p className="text-sm text-gray-500 mt-1">You will be signed out of the Admin Panel.</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogout(false)}
                                className="flex-1 h-12 rounded-2xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition shadow-lg shadow-red-100"
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AdminBottomNav />
        </AdminRoute>
    );
}
