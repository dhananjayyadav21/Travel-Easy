import { Geist, Geist_Mono } from "next/font/google";
import "../style/globals.css";
import Navbar from "./Navbar/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Travel Book App",
  description: "Generated for afortable travel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="pt-14 bg-gradient-to-r from-green-50 to-red-50">{children}</main>
      </body>
    </html>
  );
}
