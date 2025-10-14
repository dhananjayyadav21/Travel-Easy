"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, Home, User, Mail, Briefcase, Truck } from 'lucide-react';
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/utils/ProtectedRoute";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const router = useRouter();

    // ---------------- USERDETAIL ----------------
    useEffect(() => {
        try {
            const raw = localStorage.getItem("user");
            if (raw) setUser(JSON.parse(raw));
        } catch (e) {
            setUser(null);
        }
    }, []);

    // ---------------- LODING ----------------
    useEffect(() => {
        const onLoad = () => setPageLoading(false);
        if (typeof window !== 'undefined') {
            if (document.readyState === 'complete') setPageLoading(false);
            else {
                window.addEventListener('load', onLoad);
                const t = setTimeout(() => setPageLoading(false), 1200);
                return () => { window.removeEventListener('load', onLoad); clearTimeout(t); };
            }
        }
    }, []);

    // ---------------- HANDLELOGOUT ----------------
    function logout() {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push('/login');
    }

    if (!user) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-red-50 p-4">
                    {pageLoading && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-14 h-14 border-4 border-t-transparent border-gray-900 rounded-full animate-spin" />
                                <div className="text-sm text-gray-700">Loading...</div>
                            </div>
                        </div>
                    )}
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-xl font-semibold mb-2">You are not signed in</h2>
                        <p className="text-sm text-gray-600 mb-4">Please login or create an account to view your profile.</p>
                        <div className="flex gap-3 justify-center">
                            <Link href="/login" className="px-4 py-2 bg-black text-white rounded">Login</Link>
                            <Link href="/register" className="px-4 py-2 border rounded">Register</Link>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen flex items-center justify-center p-4">

                {/* Profile Card: White background, elevated shadow, light border */}
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-200">

                    {/* Header Section: Avatar and main info */}
                    <div className="flex flex-col items-center justify-center text-center pb-6 border-b border-gray-200 mb-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-600 shadow-md">
                            <img
                                src={user.avatar || '/images/profile.png'}
                                alt="User Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mt-4">{user.name || 'User Name'}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <Mail size={16} className="text-purple-600" />
                            {user.email}
                        </p>
                        <p className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full mt-2">
                            Role: {user.role || 'Traveler'}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-col gap-3">
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition duration-200 shadow-md cursor-pointer"
                        >
                            <LogOut size={20} />
                            Secure Logout
                        </button>
                        <Link
                            href="/"
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200"
                        >
                            <Home size={20} />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
