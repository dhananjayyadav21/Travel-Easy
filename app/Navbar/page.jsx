"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const router = useRouter();
    const pathname = usePathname();

    const [isClient, setIsClient] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // This confirms the component has mounted in the browser
        setIsClient(true);

        // Safely access localStorage here
        try {
            const user = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (user && token) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Could not access localStorage:", error);
            setIsAuthenticated(false);
        }
    }, []);

    // loding when page load
    useEffect(() => {
        function onDoc(e) {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener('click', onDoc);
        return () => document.removeEventListener('click', onDoc);
    }, []);


    // Close menus on route change
    useEffect(() => {
        setMobileOpen(false);
        setProfileOpen(false);
    }, [pathname]);

    return (
        <nav className="bg-white text-black fixed top-0 left-0 right-0 px-4 md:px-8 py-3 z-50 shadow">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => setMobileOpen((s) => !s)} className="md:hidden p-2 rounded-md hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/10" aria-label="Toggle menu">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <Link href="/" className="text-lg md:text-xl font-bold tracking-tight">TravelEasy</Link>
                </div>

                <div className="flex items-center gap-3">
                    {!isAuthenticated && (
                        <>
                            <Link
                                href="/register"
                                className="hidden md:inline-block border border-black/10 px-3 py-1 rounded-md text-sm hover:bg-black/5"
                            >
                                Sign up
                            </Link>
                            <Link
                                href="/login"
                                className="hidden md:inline-block bg-black text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-900"
                            >
                                Login
                            </Link>
                        </>
                    )}


                    <div ref={profileRef} className="relative">
                        <button onClick={() => setProfileOpen((s) => !s)} aria-haspopup="true" aria-expanded={profileOpen} className="w-10 h-10 rounded-full overflow-hidden border-2 border-black/10 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10">
                            <img src="/images/profile.png" alt="Profile" className="w-full h-full object-cover cursor-pointer" />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-2 z-50 ">
                                <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">Your Profile</Link>

                                {(() => {
                                    // Parse user safely
                                    let user = null;
                                    if (typeof window !== "undefined") {
                                        try {
                                            user = JSON.parse(localStorage.getItem("user"));
                                        } catch (error) {
                                            console.error("Invalid user data in localStorage");
                                        }
                                    }

                                    // Check if user exists and role is NOT traveler
                                    if (user && user.role !== "traveler") {
                                        return (
                                            <>
                                                <Link href="/provider-dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100">
                                                    ADD NewTrip
                                                </Link>
                                                <Link href="/providertrips" className="block px-4 py-2 text-sm hover:bg-gray-100">
                                                    MY Trip
                                                </Link>
                                            </>
                                        );
                                    } else {
                                        return (
                                            <>
                                                <Link href="/traveler-dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100">
                                                    Book Trip
                                                </Link>
                                                <Link href="/travelertrips" className="block px-4 py-2 text-sm hover:bg-gray-100">
                                                    View Trip
                                                </Link>
                                            </>
                                        );
                                    }
                                })()}

                                <button onClick={() => { localStorage.removeItem('user'); router.push('/login'); }} className="w-full flex text-left px-4 py-2 text-sm hover:bg-gray-100">
                                    Secure Logout <span className="mx-2"><LogOut size={20} /></span></button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white">
                    <div className="px-4 py-3 space-y-2">
                        {!localStorage.getItem('user') && !localStorage.getItem('token') && (
                            <Link href="/login" className="block px-2 py-2 rounded bg-black text-white text-center">Login</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}