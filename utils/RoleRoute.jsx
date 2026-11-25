"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ROLE_HOME = {
    traveler: "/traveler-dashboard",
    provider: "/provider-dashboard",
    admin: "/admin",
};

/**
 * RoleRoute — protects a page by role.
 * - No token → /login
 * - Wrong role → redirects to user's correct dashboard
 * - Correct role (or no restriction) → renders children
 */
export default function RoleRoute({ children, role }) {
    const router = useRouter();
    const [ok, setOk] = useState(false);

    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user") || "null");

            if (!token || !user) {
                router.replace("/login");
                return;
            }

            if (role && user.role !== role) {
                router.replace(ROLE_HOME[user.role] || "/");
                return;
            }

            setOk(true);
        } catch {
            router.replace("/login");
        }
    }, [router, role]);

    if (!ok) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F5F3FF]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-2 border-t-transparent border-[#7C3AED] rounded-full animate-spin" />
                    <span className="text-xs text-violet-400 font-medium">Loading...</span>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
