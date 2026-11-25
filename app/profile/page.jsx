"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
    LogOut, Mail, Camera, Star, Phone, CheckCircle, AlertCircle,
    User, Shield, Award, ChevronRight, Bell, Tag, HelpCircle,
    Settings, Wallet, ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/utils/ProtectedRoute";
import toast from "react-hot-toast";
import TravelerBottomNav from "@/components/TravelerBottomNav";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [dbUser, setDbUser] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [photoUploading, setPhotoUploading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const fileInputRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        try {
            const raw = localStorage.getItem("user");
            if (raw) setUser(JSON.parse(raw));
        } catch { setUser(null); }

        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const res = await fetch("/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setDbUser(data.user);
                    setPageLoading(false);
                    if (data.user?.role === "provider") {
                        try {
                            const rRes = await fetch(`/api/reviews?providerId=${data.user._id}`);
                            if (rRes.ok) {
                                const rData = await rRes.json();
                                setReviews(rData.reviews || []);
                            }
                        } catch { /* non-fatal */ }
                    }
                }
            } catch { /* non-fatal */ }
            setPageLoading(false);
        };
        fetchUser();
    }, []);

    function logout() {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("authChanged"));
        router.push("/login");
    }

    const handlePhotoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { toast.error("Please select an image file."); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB."); return; }
        setPhotoUploading(true);
        try {
            const formData = new FormData();
            formData.append("photo", file);
            const token = localStorage.getItem("token");
            const res = await fetch("/api/upload/profile-photo", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Profile photo updated!");
                setDbUser(prev => ({ ...prev, profilePhoto: data.url }));
                const stored = JSON.parse(localStorage.getItem("user") || "{}");
                localStorage.setItem("user", JSON.stringify({ ...stored, profilePhoto: data.url }));
            } else {
                toast.error(data.message || "Upload failed");
            }
        } catch {
            toast.error("Upload failed. Please try again.");
        } finally {
            setPhotoUploading(false);
        }
    };

    const displayUser = dbUser || user;

    if (pageLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-2 border-t-transparent border-[#7C3AED] rounded-full animate-spin" />
            </div>
        );
    }

    if (!displayUser) {
        return (
            <ProtectedRoute>
                <div className="min-h-[calc(100vh-56px)] bg-[#F5F3FF] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-violet-100 p-8 text-center max-w-sm w-full">
                        <div className="w-14 h-14 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User size={24} className="text-[#7C3AED]" />
                        </div>
                        <h2 className="text-base font-bold text-gray-900 mb-1">Not signed in</h2>
                        <p className="text-xs text-gray-500 mb-5">Please sign in to view your profile.</p>
                        <div className="flex gap-2 justify-center">
                            <Link href="/login" className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-bold rounded-xl transition">Sign In</Link>
                            <Link href="/register" className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:border-violet-400 transition">Sign Up</Link>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    const photoUrl = displayUser.profilePhoto || displayUser.avatar || null;
    const avgRating = displayUser.avgRating || 0;
    const totalRatings = displayUser.totalRatings || 0;
    const initials = displayUser.name
        ? displayUser.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
        : "U";
    const isProvider = displayUser.role === "provider";
    const memberYear = displayUser.createdAt ? new Date(displayUser.createdAt).getFullYear() : new Date().getFullYear();

    const travelerMenuItems = [
        { icon: <Wallet size={19} className="text-[#7C3AED]" />, label: "Wallet", href: "#", value: "₹1,250", bg: "bg-violet-100" },
        { icon: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2"><rect x="2" y="8" width="20" height="10" rx="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M2 11l3-5h14l3 5"/></svg>, label: "My Bookings", href: "/travelertrips", bg: "bg-violet-100" },
        { icon: <Bell size={19} className="text-[#7C3AED]" />, label: "Notifications", href: "#", bg: "bg-violet-100" },
        { icon: <Tag size={19} className="text-[#7C3AED]" />, label: "Offers & Coupons", href: "#", bg: "bg-violet-100" },
        { icon: <HelpCircle size={19} className="text-[#7C3AED]" />, label: "Help & Support", href: "#", bg: "bg-violet-100" },
        { icon: <Settings size={19} className="text-[#7C3AED]" />, label: "Settings", href: "#", bg: "bg-violet-100" },
    ];

    const providerMenuItems = [
        { icon: <Wallet size={19} className="text-[#7C3AED]" />, label: "Earnings", href: "/provider-earnings", value: "₹0", bg: "bg-violet-100" },
        { icon: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2"><rect x="2" y="8" width="20" height="10" rx="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M2 11l3-5h14l3 5"/></svg>, label: "My Rides", href: "/providertrips", bg: "bg-violet-100" },
        { icon: <Bell size={19} className="text-[#7C3AED]" />, label: "Notifications", href: "#", bg: "bg-violet-100" },
        { icon: <HelpCircle size={19} className="text-[#7C3AED]" />, label: "Help & Support", href: "#", bg: "bg-violet-100" },
        { icon: <Settings size={19} className="text-[#7C3AED]" />, label: "Settings", href: "#", bg: "bg-violet-100" },
    ];

    const menuItems = isProvider ? providerMenuItems : travelerMenuItems;

    return (
        <ProtectedRoute>
            <div className="min-h-[calc(100vh-56px)] bg-white">

                {/* Header */}
                <div className="px-5 pt-5 pb-2 flex items-center gap-3">
                    <button onClick={() => router.back()} className="p-1">
                        <ArrowLeft size={22} className="text-gray-800" />
                    </button>
                    <h1 className="text-lg font-extrabold text-gray-900">Profile</h1>
                </div>

                <div className="max-w-2xl mx-auto px-4 pb-28">

                    {/* Avatar + name + phone */}
                    <div className="flex flex-col items-center text-center pt-4 pb-6">
                        <div className="relative cursor-pointer mb-4" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-violet-100 shadow-lg">
                                {photoUploading ? (
                                    <div className="w-full h-full bg-violet-50 flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-t-transparent border-[#7C3AED] rounded-full animate-spin" />
                                    </div>
                                ) : photoUrl ? (
                                    <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-white text-2xl font-extrabold">
                                        {initials}
                                    </div>
                                )}
                            </div>
                            <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#7C3AED] rounded-full border-2 border-white flex items-center justify-center shadow-md">
                                <Camera size={12} className="text-white" />
                            </button>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />

                        <h2 className="text-xl font-extrabold text-gray-900">{displayUser.name || "User"}</h2>
                        <p className="text-sm text-gray-400 mt-1">
                            {displayUser.phone ? `+91 ${displayUser.phone}` : displayUser.email}
                        </p>

                        {/* Edit Profile — outline button */}
                        <button
                            onClick={() => toast("Profile editing coming soon!")}
                            className="mt-4 px-10 py-2.5 border-2 border-[#7C3AED] text-[#7C3AED] font-bold rounded-full text-sm hover:bg-violet-50 transition"
                        >
                            Edit Profile
                        </button>
                    </div>

                    {/* Menu list */}
                    <div className="divide-y divide-gray-50">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-4 py-4 hover:bg-gray-50 transition rounded-xl px-1"
                            >
                                <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center flex-shrink-0">
                                    {item.icon}
                                </div>
                                <span className="flex-1 text-sm font-semibold text-gray-800">{item.label}</span>
                                {item.value && (
                                    <span className="text-sm font-extrabold text-[#7C3AED] mr-1">{item.value}</span>
                                )}
                                <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                            </Link>
                        ))}

                        {/* Logout */}
                        <button
                            onClick={logout}
                            className="flex items-center gap-4 py-4 hover:bg-red-50 transition rounded-xl px-1 w-full"
                        >
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                                <LogOut size={19} className="text-red-500" />
                            </div>
                            <span className="flex-1 text-sm font-semibold text-red-500 text-left">Sign Out</span>
                            <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                        </button>
                    </div>

                </div>

                <TravelerBottomNav />
            </div>
        </ProtectedRoute>
    );
}
