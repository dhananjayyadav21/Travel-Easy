"use client";
import { useEffect, useRef } from "react";

// Purple car SVG icon as data URL
const CAR_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="18" fill="#7C3AED"/>
  <circle cx="18" cy="18" r="14" fill="#6D28D9"/>
  <path d="M10 20h16v5a1 1 0 01-1 1H11a1 1 0 01-1-1v-5z" fill="white"/>
  <path d="M11 20l3-7h10l3 7" fill="white"/>
  <rect x="12" y="14" width="5" height="4" rx="1" fill="#A5F3FC" opacity="0.9"/>
  <rect x="19" y="14" width="5" height="4" rx="1" fill="#A5F3FC" opacity="0.9"/>
  <circle cx="13" cy="25" r="2.5" fill="#1E1B4B"/>
  <circle cx="23" cy="25" r="2.5" fill="#1E1B4B"/>
  <circle cx="13" cy="25" r="1" fill="white"/>
  <circle cx="23" cy="25" r="1" fill="white"/>
</svg>`;

const CAR_ICON_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(CAR_ICON_SVG)}`;

export default function TripMap({ sourceCoords, destinationCoords, liveLocation, height = "300px" }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const liveMarkerRef = useRef(null);
    const directionsRendererRef = useRef(null);
    const coveredPolylineRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current || !window.google) return;
        if (!sourceCoords?.lat || !destinationCoords?.lat) return;

        const map = new window.google.maps.Map(mapRef.current, {
            zoom: 8,
            center: {
                lat: (sourceCoords.lat + destinationCoords.lat) / 2,
                lng: (sourceCoords.lng + destinationCoords.lng) / 2,
            },
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            styles: [
                { featureType: "poi", stylers: [{ visibility: "off" }] },
                { featureType: "transit", stylers: [{ visibility: "off" }] },
            ],
        });
        mapInstanceRef.current = map;

        // Source marker
        new window.google.maps.Marker({
            position: { lat: sourceCoords.lat, lng: sourceCoords.lng },
            map,
            title: "Start",
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#22C55E",
                fillOpacity: 1,
                strokeColor: "#fff",
                strokeWeight: 2,
            },
        });

        // Destination marker
        new window.google.maps.Marker({
            position: { lat: destinationCoords.lat, lng: destinationCoords.lng },
            map,
            title: "Destination",
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#EF4444",
                fillOpacity: 1,
                strokeColor: "#fff",
                strokeWeight: 2,
            },
        });

        // Draw route
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: "#7C3AED",
                strokeWeight: 5,
                strokeOpacity: 0.5,
            },
        });
        directionsRenderer.setMap(map);
        directionsRendererRef.current = directionsRenderer;

        directionsService.route(
            {
                origin: { lat: sourceCoords.lat, lng: sourceCoords.lng },
                destination: { lat: destinationCoords.lat, lng: destinationCoords.lng },
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === "OK") directionsRenderer.setDirections(result);
            }
        );
    }, [sourceCoords, destinationCoords]);

    // Update live location marker + covered route
    useEffect(() => {
        if (!mapInstanceRef.current || !window.google || !liveLocation?.lat) return;

        const pos = { lat: liveLocation.lat, lng: liveLocation.lng };

        if (liveMarkerRef.current) {
            liveMarkerRef.current.setPosition(pos);
        } else {
            liveMarkerRef.current = new window.google.maps.Marker({
                position: pos,
                map: mapInstanceRef.current,
                title: "Your Location",
                icon: {
                    url: CAR_ICON_URL,
                    scaledSize: new window.google.maps.Size(40, 40),
                    anchor: new window.google.maps.Point(20, 20),
                },
                zIndex: 999,
            });
        }

        // Draw covered route (source → live position) in solid violet
        if (sourceCoords?.lat) {
            if (coveredPolylineRef.current) coveredPolylineRef.current.setMap(null);
            coveredPolylineRef.current = new window.google.maps.Polyline({
                path: [
                    { lat: sourceCoords.lat, lng: sourceCoords.lng },
                    pos,
                ],
                strokeColor: "#7C3AED",
                strokeWeight: 6,
                strokeOpacity: 1,
                map: mapInstanceRef.current,
            });
        }

        // Pan and zoom to live location
        mapInstanceRef.current.panTo(pos);
        if (mapInstanceRef.current.getZoom() < 12) {
            mapInstanceRef.current.setZoom(13);
        }
    }, [liveLocation, sourceCoords]);

    if (!sourceCoords?.lat || !destinationCoords?.lat) {
        return (
            <div
                style={{ height }}
                className="w-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm"
            >
                Map unavailable — no coordinates saved for this trip.
            </div>
        );
    }

    return <div ref={mapRef} style={{ height }} className="w-full" />;
}
