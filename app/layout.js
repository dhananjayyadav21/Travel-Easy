import "@/style/globals.css";
import Navbar from "./Navbar/page";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Travel Easy",
  description: "Generated for affordable travel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='antialiased bg-gradient-to-r from-green-50 to-red-50'>

      <body
        className='min-h-screen bg-gradient-to-r from-green-50 to-red-50'
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
