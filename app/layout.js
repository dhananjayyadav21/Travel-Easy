import "@/style/globals.css";
import Navbar from "./Navbar/page";
import { Toaster } from "react-hot-toast";

import GoogleMapsProvider from "@/components/GoogleMapsProvider";

import PushNotificationSetup from "@/components/PushNotificationSetup";

export const metadata = {
  title: "Travel Easy Hai | Affordable Seat Sharing",
  description: "India's most affordable carpooling platform — share rides, save money, travel smart.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white font-sans">
        <GoogleMapsProvider>
          <PushNotificationSetup />
          <Navbar />
          <main className="flex-1 pt-14">
            {children}
          </main>

<Toaster
            position="top-center"
            toastOptions={{
              style: { background: "#1e1b4b", color: "#fff", borderRadius: "12px", fontSize: "14px", fontWeight: "600" },
              success: { iconTheme: { primary: "#4ade80", secondary: "#fff" }, duration: 2500 },
              error:   { iconTheme: { primary: "#f87171", secondary: "#fff" }, duration: 3000 },
            }}
          />
        </GoogleMapsProvider>
      </body>
    </html>
  );
}
