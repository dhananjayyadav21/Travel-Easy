"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const profileRef = useRef(null);
    const router = useRouter();
    const pathname = usePathname();

    // Skeleton loader component
    const SkeletonBox = ({ w = "w-16", h = "h-8", rounded = "rounded-md" }) => (
        <div className={`${w} ${h} ${rounded} bg-gray-200 animate-pulse`}></div>
    );

    // ✅ Auth check + listen for login/logout events
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            setIsAuthenticated(!!token);
            setLoading(false);
        };

        checkAuth();

        window.addEventListener("storage", checkAuth); // cross-tab
        window.addEventListener("authChanged", checkAuth); // custom event

        return () => {
            window.removeEventListener("storage", checkAuth);
            window.removeEventListener("authChanged", checkAuth);
        };
    }, []);

    // ✅ Close menus on route change
    useEffect(() => {
        setMobileOpen(false);
        setProfileOpen(false);

        // update auth state on route change
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, [pathname]);

    // ✅ Close profile dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        window.dispatchEvent(new Event("authChanged")); // notify navbar to update
        router.push("/login");
    };

    return (
        <nav className="bg-white text-black fixed top-0 left-0 right-0 z-50 shadow">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3 min-h-[64px]">
                {/* Logo + Mobile toggle */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-md hover:bg-black/5"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <Link href="/" className="text-lg md:text-xl font-bold tracking-tight">
                        TravelEasy
                    </Link>
                </div>

                {/* Right side buttons */}
                <div className="flex items-center gap-3 min-w-[140px] justify-end">
                    {loading ? (
                        <>
                            <SkeletonBox w="w-20" h="h-8" />
                        </>
                    ) : isAuthenticated ? (
                        <>
                            {/* Logout button visible on large screens */}
                            <button
                                onClick={handleLogout}
                                className="hidden sm:flex items-center bg-gray-100 text-red-600 font-semibold px-4 py-1 rounded-md hover:bg-gray-200 transition"
                            >
                                Logout  <LogOut size={16} className="ml-2" />
                            </button>

                            {/* Profile Icon */}
                            <div ref={profileRef} className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="w-9 h-9 rounded-full overflow-hidden border border-gray-300 shadow-sm cursor-pointer"
                                >
                                    <img src="/images/profile.png" alt="Profile" className="w-full h-full object-cover" />
                                </button>

                                {/* Profile Dropdown */}
                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-2 z-50 animate-fadeIn">
                                        <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                                            Your Profile
                                        </Link>

                                        {(() => {
                                            let user = null;
                                            try {
                                                user = JSON.parse(localStorage.getItem("user"));
                                            } catch { }
                                            if (user && user.role !== "traveler") {
                                                return (
                                                    <>
                                                        <Link href="/provider-dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100">
                                                            Add-Trip
                                                        </Link>
                                                        <Link href="/providertrips" className="block px-4 py-2 text-sm hover:bg-gray-100">
                                                            MY-Trip
                                                        </Link>
                                                    </>
                                                );
                                            } else {
                                                return (
                                                    <>
                                                        <Link href="/traveler-dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100">
                                                            Book-Trip
                                                        </Link>
                                                        <Link href="/travelertrips" className="block px-4 py-2 text-sm hover:bg-gray-100">
                                                            View-Trip
                                                        </Link>
                                                    </>
                                                );
                                            }
                                        })()}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/register" className="hidden md:inline-block border border-black/10 px-3 py-1 rounded-md text-sm hover:bg-black/5">
                                Sign up
                            </Link>
                            <Link href="/login" className="hidden md:inline-block bg-black text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-900">
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && !loading && (
                <div className="md:hidden bg-white shadow-md">
                    <div className="px-4 py-3 space-y-2">
                        {!isAuthenticated ? (
                            <>
                                <Link href="/login" className="block px-2 py-2 rounded bg-black text-white text-center">
                                    Login
                                </Link>
                                <Link href="/register" className="block px-2 py-2 rounded border border-black/10 text-center">
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/profile" className="block px-2 py-2 text-center">
                                    Your Profile
                                </Link>
                                <button onClick={handleLogout} className="flex justify-center w-full text-center px-2 py-2 text-red-500">
                                    Logout <LogOut size={18} className="ml-2" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
