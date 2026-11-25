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
            position="bottom-right"
            toastOptions={{
              style: { background: "#0C4A6E", color: "#fff", borderRadius: "12px", fontSize: "14px" },
              success: { iconTheme: { primary: "#7DD3FC", secondary: "#fff" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />
        </GoogleMapsProvider>
      </body>
    </html>
  );
}
