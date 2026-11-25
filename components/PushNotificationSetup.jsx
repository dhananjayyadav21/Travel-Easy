"use client";
import { useEffect } from "react";

export default function PushNotificationSetup() {
    useEffect(() => {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
        if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) return;

        const register = async () => {
            try {
                const reg = await navigator.serviceWorker.register("/sw.js");
                const token = localStorage.getItem("token");
                if (!token) return;

                const existing = await reg.pushManager.getSubscription();
                if (existing) return; // already subscribed

                const permission = await Notification.requestPermission();
                if (permission !== "granted") return;

                const sub = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
                });

                await fetch("/api/notifications/subscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(sub),
                });
            } catch (err) {
                console.error("Push setup error:", err);
            }
        };

        register();
    }, []);

    return null;
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
