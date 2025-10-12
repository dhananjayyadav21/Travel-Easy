"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        try {
            const raw = localStorage.getItem("user");
            if (raw) setUser(JSON.parse(raw));
        } catch (e) {
            setUser(null);
        }
    }, []);

    function logout() {
        localStorage.removeItem("user");
        router.push('/login');
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-red-50 p-4">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-semibold mb-2">You are not signed in</h2>
                    <p className="text-sm text-gray-600 mb-4">Please login or create an account to view your profile.</p>
                    <div className="flex gap-3 justify-center">
                        <Link href="/login" className="px-4 py-2 bg-black text-white rounded">Login</Link>
                        <Link href="/register" className="px-4 py-2 border rounded">Register</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-red-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border">
                        <img src={user.avatar || '/images/profile.png'} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-600 mt-1">Role: {user.role || 'traveler'}</p>
                    </div>
                </div>

                {user.role === 'provider' && (
                    <div className="mt-4">
                        <h4 className="font-medium">Provider details</h4>
                        <p className="text-sm text-gray-700">Company: {user.travelName}</p>
                        <p className="text-sm text-gray-700">Contact: {user.contact}</p>
                        <p className="text-sm text-gray-700">Vehicle: {user.vehicle}</p>
                    </div>
                )}

                <div className="mt-6 flex gap-3">
                    <button onClick={logout} className="px-4 py-2 bg-black text-white rounded">Logout</button>
                    <Link href="/" className="px-4 py-2 border rounded">Home</Link>
                </div>
            </div>
        </div>
    );
}
