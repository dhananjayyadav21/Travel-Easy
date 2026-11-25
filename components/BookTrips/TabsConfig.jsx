"use client";
import { Car, CheckCircle, XCircle } from 'lucide-react';

export const TABS_CONFIG = {
    Active: {
        icon: Car,
        color: "text-[#FF6B35]",
        bgActive: "bg-orange-50",
        border: "border-[#FF6B35]",
        pillBg: "bg-orange-100/50",
    },
    Completed: {
        icon: CheckCircle,
        color: "text-[#16A36A]",
        bgActive: "bg-emerald-50",
        border: "border-[#16A36A]",
        pillBg: "bg-emerald-100/50",
    },
    Cancelled: {
        icon: XCircle,
        color: "text-[#E5484D]",
        bgActive: "bg-red-50",
        border: "border-[#E5484D]",
        pillBg: "bg-red-100/50",
    },
};
