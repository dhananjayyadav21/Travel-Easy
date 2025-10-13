"use client";
import { Car, CheckCircle, XCircle } from 'lucide-react';

// Centralized tab configuration for consistency and reuse
export const TABS_CONFIG = {
    Active: {
        icon: Car,
        color: "text-indigo-600",
        bgActive: "bg-indigo-50",
        border: "border-indigo-600",
        pillBg: "bg-indigo-100/50"
    },
    Completed: {
        icon: CheckCircle,
        color: "text-emerald-600",
        bgActive: "bg-emerald-50",
        border: "border-emerald-600",
        pillBg: "bg-emerald-100/50"
    },
    Cancelled: {
        icon: XCircle,
        color: "text-rose-600",
        bgActive: "bg-rose-50",
        border: "border-rose-600",
        pillBg: "bg-rose-100/50"
    },
};
