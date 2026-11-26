"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, User, MapPin, Navigation, LayoutDashboard, Users, BarChart3, TrendingUp, Home, List } from "lucide-react";

export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

    const SkeletonBox = ({ w = "w-16", h = "h-8", rounded = "rounded-md" }) => (
        <div className={`${w} ${h} ${rounded} bg-violet-50 animate-pulse`}></div>
    );

    const checkAuth = () => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
        if (token) {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                setCurrentUser(user);
            } catch { setCurrentUser(null); }
        } else {
            setCurrentUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
        window.addEventListener("storage", checkAuth);
        window.addEventListener("authChanged", checkAuth);
        return () => {
            window.removeEventListener("storage", checkAuth);
            window.removeEventListener("authChanged", checkAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setCurrentUser(null);
        window.dispatchEvent(new Event("authChanged"));
        router.push("/login");
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const isProvider = currentUser?.role === "provider";
    const isAdmin = currentUser?.role === "admin";

    const navLinks = isAdmin
        ? [
            { href: "/admin",         label: "Dashboard", icon: LayoutDashboard },
            { href: "/admin/users",   label: "Users",     icon: Users },
            { href: "/admin/reports", label: "Reports",   icon: BarChart3 },
        ]
        : isProvider
        ? [
            { href: "/provider-dashboard",  label: "Dashboard", icon: Home },
            { href: "/providertrips",        label: "My Rides",  icon: List },
            { href: "/provider-earnings",    label: "Earnings",  icon: TrendingUp },
        ]
        : [
            { href: "/traveler-dashboard", label: "Find Rides",  icon: MapPin },
            { href: "/travelertrips",       label: "My Bookings", icon: Navigation },
        ];

    return (
        <>
            <nav className="hidden md:block bg-white border-b border-violet-100/60 fixed top-0 left-0 right-0 z-50 shadow-[0_1px_12px_rgba(109,40,217,0.06)]">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-14">

                    {/* Left — Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center group">
                            <Image
                                src="/images/logo.png"
                                alt="TravelEasy"
                                width={160}
                                height={53}
                                className="h-11 w-auto object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Center — Nav Links (desktop, authenticated only) */}
                    {isAuthenticated && !loading && (
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map(({ href, label, icon: Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                        pathname === href
                                            ? "text-violet-700 font-semibold bg-violet-50 shadow-sm"
                                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                                >
                                    <Icon size={14} />
                                    {label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right — Auth buttons or user avatar */}
                    <div className="flex items-center gap-2 min-w-[140px] justify-end">
                        {!loading && !isAuthenticated && (
                            <>
                                <Link
                                    href="/login"
                                    className="hidden md:inline-flex items-center text-gray-600 hover:text-violet-700 px-3 py-1.5 text-sm font-medium transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm shadow-violet-200 hover:shadow-md hover:shadow-violet-300 hover:-translate-y-px"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

        </>
    );
}
