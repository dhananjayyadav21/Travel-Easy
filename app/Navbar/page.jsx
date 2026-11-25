"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, User, X, Menu, MapPin, Navigation, LayoutDashboard, Users, BarChart3, TrendingUp, Home, List } from "lucide-react";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
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

    useEffect(() => {
        setMobileOpen(false);
        checkAuth();
    }, [pathname]);

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
            <nav className="bg-white border-b border-violet-100/60 fixed top-0 left-0 right-0 z-50 shadow-[0_1px_12px_rgba(109,40,217,0.06)]">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 h-14">

                    {/* Left — Hamburger (mobile) + Logo */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-1.5 rounded-lg hover:bg-violet-50 text-gray-600 transition"
                            aria-label="Toggle menu"
                        >
                            <Menu size={20} />
                        </button>
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

            {/* Mobile Drawer Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Drawer */}
            <div className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl border-r border-violet-100 transform transition-transform duration-300 ease-in-out md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex flex-col h-full">
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50">
                        <Link href="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
                            <Image
                                src="/images/logo.png"
                                alt="TravelEasy"
                                width={160}
                                height={53}
                                className="h-11 w-auto object-contain"
                            />
                        </Link>
                        <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-xl hover:bg-white/80 text-gray-500 transition">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Drawer Body */}
                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        {!loading && isAuthenticated && currentUser && (
                            <div className="flex items-center gap-3 p-3 mb-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 rounded-2xl">
                                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-violet-200 flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 text-white text-sm font-bold flex-shrink-0">
                                    {currentUser?.profilePhoto ? (
                                        <img src={currentUser.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{getInitials(currentUser?.name)}</span>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.name}</p>
                                    <p className="text-xs text-violet-600 capitalize font-medium">{currentUser.role}</p>
                                </div>
                            </div>
                        )}

                        {!loading && !isAuthenticated && (
                            <div className="flex flex-col gap-2 mb-4">
                                <Link href="/login" onClick={() => setMobileOpen(false)} className="block w-full text-center text-gray-700 border border-gray-200 py-2.5 rounded-xl font-medium transition hover:bg-gray-50 text-sm">
                                    Sign In
                                </Link>
                                <Link href="/register" onClick={() => setMobileOpen(false)} className="block w-full text-center bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-2.5 rounded-xl font-semibold transition text-sm shadow-sm shadow-violet-200">
                                    Get Started
                                </Link>
                            </div>
                        )}

                        {!loading && isAuthenticated && (
                            <div className="flex flex-col gap-1">
                                <Link
                                    href="/profile"
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${pathname === "/profile" ? "bg-violet-50 text-violet-700" : "text-gray-700 hover:bg-violet-50 hover:text-violet-700"}`}
                                >
                                    <User size={16} /> Your Profile
                                </Link>
                                {navLinks.map(({ href, label, icon: Icon }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${pathname === href ? "bg-violet-50 text-violet-700" : "text-gray-700 hover:bg-violet-50 hover:text-violet-700"}`}
                                    >
                                        <Icon size={16} /> {label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Drawer Footer */}
                    {isAuthenticated && (
                        <div className="px-4 pb-6 border-t border-violet-50 pt-3">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
