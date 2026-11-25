"use client";
import { useEffect } from "react";
import { LoadScript } from "@react-google-maps/api";

const LIBRARIES = ["places", "geometry"];

export default function GoogleMapsProvider({ children }) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // Suppress Google Maps auth error popup (shows when API key has billing issues)
    useEffect(() => {
        window.gm_authFailure = () => {};
    }, []);

    if (!apiKey) return <>{children}</>;

    return (
        <LoadScript
            googleMapsApiKey={apiKey}
            libraries={LIBRARIES}
            loadingElement={<>{children}</>}
        >
            {children}
        </LoadScript>
    );
}
