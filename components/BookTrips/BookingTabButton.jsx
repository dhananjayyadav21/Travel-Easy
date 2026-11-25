"use client";
import React from "react";

const TabButton = ({ label, active, onClick, count }) => {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3.5 text-sm font-semibold transition-all whitespace-nowrap ${
                active
                    ? "text-sky-600 border-b-2 border-sky-600 bg-sky-50/50"
                    : "text-gray-500 border-b-2 border-transparent hover:text-gray-800 hover:bg-gray-50"
            }`}
        >
            {label}
            {count !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    active
                        ? "bg-sky-100 text-sky-700"
                        : "bg-gray-100 text-gray-500"
                }`}>
                    {count}
                </span>
            )}
        </button>
    );
};

export default TabButton;
