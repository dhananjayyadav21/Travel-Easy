import Image from "next/image";
import Link from "next/link";
import { FaStar } from 'react-icons/fa';

const providers = [
    {
        providerName: "John Travels",
        travelName: "Express Tours",
        contact: "+91 9876543210",
        vehicle: "MH12AB1234",
        img: "/images/top-driver1.jpg",
        rating: 4.8,
        location: 'Mumbai',
    },
    {
        providerName: "Jane Travels",
        travelName: "Holiday Riders",
        contact: "+91 9123456780",
        vehicle: "MH14CD5678",
        img: "/images/top-driver2.jpeg",
        rating: 4.6,
        location: 'Pune',
    },
    {
        providerName: "Bob Travels",
        travelName: "Adventure Wheels",
        contact: "+91 9988776655",
        vehicle: "MH20EF9012",
        img: "/images/top-driver3.jpg",
        rating: 4.7,
        location: 'Goa',
    },
    {
        providerName: "Emma Travels",
        travelName: "Skyline Tours",
        contact: "+91 9112233445",
        vehicle: "MH18GH3456",
        img: "/images/top-driver4.jpg",
        rating: 4.5,
        location: 'Bengaluru',
    },
];

export default function TopTravelProviders() {
    const userDataString = localStorage.getItem('user');
    let userRole = null;

    if (userDataString) {
        try {
            const userData = JSON.parse(userDataString);
            userRole = userData.role;
        } catch (e) {
            console.error("Error parsing user data from localStorage:", e);
        }
    }
    return (
        <div className="px-4 py-10 max-w-7xl mx-auto">

            <div className="flex justify-center mb-10">
                <span className="inline-block w-5/6 h-0.5 rounded bg-gray-700/80"></span>
            </div>

            <h2 className="text-2xl font-bold text-center mb-2">Top Travel Providers</h2>
            <p className="text-center text-gray-500 mb-6 max-w-2xl mx-auto">
                Trusted travel providers offering safe and reliable journeys. Browse providers, check ratings and book directly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {providers.map((provider, idx) => (
                    <article key={idx} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
                        <div className="relative h-40 w-full">
                            <Image src={provider.img} alt={provider.providerName} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover" />
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900">{provider.providerName}</h3>
                                <p className="text-sm text-gray-600">{provider.travelName} · <span className="text-gray-500">{provider.location}</span></p>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center text-yellow-500">
                                        <FaStar />
                                    </span>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{provider.rating.toFixed(1)}</div>
                                        <div className="text-xs text-gray-500">based on reviews</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {userRole === 'traveler' &&
                                        <button className="ml-2 bg-black text-white text-sm px-3 py-1 rounded-md hover:bg-gray-900"><Link href="/traveler-dashboard">Book</Link></button>}

                                    {userRole === 'provider' &&
                                        <button className="ml-2 bg-black text-white text-sm px-3 py-1 rounded-md hover:bg-gray-900"><Link href="/provider-dashboard">Add</Link></button>}
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
