// components/TravelInfo.js
import Image from "next/image";
import Link from "next/link";

export default function TravelInfo() {
    return (
        <div className="px-4 py-16 bg-gradient-to-r from-green-50 to-red-50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">

                {/* Image on left */}
                <div className="md:w-1/2 flex justify-center">
                    <Image
                        src="/images/main.jpg"
                        alt="Travel App"
                        width={400}
                        height={300}
                        className="rounded-lg shadow-lg"
                    />
                </div>

                {/* Text content on right */}
                <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-3xl font-bold mb-4">
                        Explore the World with TravelEasy
                    </h2>
                    <p className="text-gray-700 mb-6">
                        TravelEasy connects you with trusted travel providers, ensures safe journeys, and lets you book your trips hassle-free. Discover destinations, check vehicles, and plan your perfect travel experience—all in one place.
                    </p>
                    <button className="bg-black hover:bg-gray-950 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300 cursor-pointer">
                        <Link href="/profile">Start Your Journey</Link>

                    </button>
                </div>
            </div>
        </div>
    );
}
