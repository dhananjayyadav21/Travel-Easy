import "@/style/globals.css";
import Navbar from "./Navbar/page";
import { Toaster } from "react-hot-toast";
import { Github, Linkedin } from 'lucide-react';

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

        <footer className="mt-auto py-6 border-t border-gray-200 text-center text-sm text-gray-500 bg-white shadow-inner w-full">
          <p className="mb-3 font-semibold text-gray-700">Developed By <span className="text-purple-700">DHANANJAY SAMARJEET YADAV</span> </p>
          <div className="flex justify-center space-x-6">
            <a href="https://github.com/dhananjayyadav21" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-700 transition flex items-center">
              <Github size={20} className="mr-1" /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/dhananjayyadav18/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-700 transition flex items-center">
              <Linkedin size={20} className="mr-1" /> LinkedIn
            </a>
          </div>
        </footer>

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
