import { Geist, Geist_Mono } from "next/font/google";
import "../style/globals.css";
import Navbar from "./Navbar/page";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Travel Easy",
  description: "Generated for affordable travel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-blue-600">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-red-600`}
      >
        <Navbar />

        <main className="flex-1 pt-14">
          {children}
        </main>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: "#000000", color: "#fff" },
            success: { iconTheme: { primary: "#4ade80", secondary: "#fff" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}
