"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Ticket, User } from "lucide-react";

const NAV = [
    { label: "Home",     icon: Home,   href: "/traveler-dashboard" },
    { label: "Rides",    icon: Search, href: "/available-rides" },
    { label: "Bookings", icon: Ticket, href: "/travelertrips" },
    { label: "Profile",  icon: User,   href: "/profile" },
];

export default function TravelerBottomNav() {
    const pathname = usePathname();

    // Only the last matching nav item is considered active to avoid dual highlighting
    const activeLabel = (() => {
        for (let i = NAV.length - 1; i >= 0; i--) {
            const { href, label } = NAV[i];
            if (href === "/traveler-dashboard" ? pathname === href : pathname.startsWith(href)) {
                return label;
            }
        }
        return null;
    })();

    const isActive = (label) => label === activeLabel;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 h-[60px] flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.07)]">
            {NAV.map(({ label, icon: Icon, href }) => {
                const active = isActive(label);
                return (
                    <Link
                        key={label}
                        href={href}
                        className="flex flex-col items-center justify-center gap-1 flex-1 h-full relative"
                    >
                        {active && (
                            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#7C3AED] rounded-b-full" />
                        )}
                        <Icon
                            size={21}
                            className={active ? "text-[#7C3AED]" : "text-gray-400"}
                            strokeWidth={active ? 2.5 : 1.8}
                        />
                        <span className={`text-[10px] font-semibold leading-none ${active ? "text-[#7C3AED]" : "text-gray-400"}`}>
                            {label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
