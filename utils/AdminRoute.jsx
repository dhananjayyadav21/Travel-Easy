"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminRoute({ children }) {
    const router = useRouter();
    const [ok, setOk] = useState(false);

    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user") || "null");
            if (!token || user?.role !== "admin") {
                router.push("/admin/login");
            } else {
                setOk(true);
            }
        } catch {
            router.push("/admin/login");
        }
    }, [router]);

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
