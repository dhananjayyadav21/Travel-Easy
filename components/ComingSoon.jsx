"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ComingSoon({ icon, title, description }) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="px-5 pt-5 pb-2 flex items-center gap-3">
                <button onClick={() => router.back()} className="p-1">
                    <ArrowLeft size={22} className="text-gray-800" />
                </button>
                <h1 className="text-lg font-extrabold text-gray-900">{title}</h1>
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-28 text-center">
                <div className="w-20 h-20 rounded-3xl bg-violet-50 flex items-center justify-center mb-6">
                    {icon}
                </div>

                <h2 className="text-xl font-extrabold text-gray-900 mb-2">Coming Soon</h2>
                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                    {description || `${title} is under construction. We're working hard to bring this to you.`}
                </p>

                <div className="mt-8 inline-flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-full px-5 py-2.5">
                    <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                    <span className="text-sm font-semibold text-violet-700">In development</span>
                </div>
            </div>
        </div>
    );
}
