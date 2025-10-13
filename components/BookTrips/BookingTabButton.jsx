"use client";
import React from "react";
import { TABS_CONFIG } from "./TabsConfig";

const TabButton = ({ tabName, count, isActive, onClick }) => {
    const config = TABS_CONFIG[tabName];

    const activeClasses = `
        font-semibold ${config.color} border-b-2 ${config.border} ${config.bgActive}
    `;
    const inactiveClasses = `
        text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300
    `;

    return (
        <button
            onClick={onClick}
            className={`
                cursor-pointer flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm sm:text-base 
                transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}
            `}
        >
            {React.createElement(config.icon, { size: 18 })}
            <span className="hidden sm:inline whitespace-nowrap">{tabName} Journeys</span>
            <span className="sm:hidden whitespace-nowrap">{tabName}</span>
            <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full 
                ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {count}
            </span>
        </button>
    );
};

export default TabButton;
