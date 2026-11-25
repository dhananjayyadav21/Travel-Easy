"use client";
import { useEffect, useRef, useState } from "react";

export default function PlacesAutocomplete({ value, onChange, onPlaceSelect, placeholder, icon: Icon, label }) {
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const [inputValue, setInputValue] = useState(value || "");

    useEffect(() => {
        setInputValue(value || "");
    }, [value]);

    useEffect(() => {
        if (!inputRef.current || !window.google) return;

        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
            componentRestrictions: { country: "in" },
            fields: ["geometry", "formatted_address", "name"],
        });

        autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current.getPlace();
            if (!place.geometry) return;

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const address = place.formatted_address || place.name || "";

            setInputValue(address);
            onChange(address);
            if (onPlaceSelect) onPlaceSelect({ lat, lng, address });
        });

        return () => {
            if (autocompleteRef.current) {
                window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
            }
        };
    }, []);

    const handleChange = (e) => {
        setInputValue(e.target.value);
        onChange(e.target.value);
    };

    return (
        <div className="relative">
            {label && (
                <label className="block text-xs text-gray-400 font-medium mb-0.5">{label}</label>
            )}
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full text-sm font-semibold text-gray-900 placeholder-gray-300 focus:outline-none bg-transparent"
                autoComplete="off"
            />
        </div>
    );
}
