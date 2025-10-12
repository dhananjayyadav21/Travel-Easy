'use client'
import { useState, useEffect } from 'react';
import TopTravelProviders from '@/components/TopTravelProviders';
import TravelInfo from '@/components/TravelInfo';

const page = () => {
    const images = [
        '/images/home-crousal1.jpg',
        '/images/home-crousal2.jpg',
        '/images/home-crousal3.jpg'
    ];

    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // hide loader after window load or after 1.2s fallback
        const onLoad = () => setLoading(false);
        if (typeof window !== 'undefined') {
            if (document.readyState === 'complete') {
                setLoading(false);
            } else {
                window.addEventListener('load', onLoad);
                const t = setTimeout(() => setLoading(false), 1200);
                return () => {
                    window.removeEventListener('load', onLoad);
                    clearTimeout(t);
                };
            }
        }
    }, []);

    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 border-4 border-t-transparent border-gray-900 rounded-full animate-spin" />
                        <div className="text-sm text-gray-700">Loading...</div>
                    </div>
                </div>
            )}


            {/* crousal */}
            <div className="px-2 sm:px-3 md:px-4 mx-auto my-6 max-w-full">
                <div className="relative w-full h-[140px] sm:h-[220px] md:h-[320px] overflow-hidden rounded-xl shadow-lg">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`slide-${index}`}
                            className={`absolute w-full h-full object-cover transition-opacity duration-700 ${index === current ? 'opacity-100' : 'opacity-0'
                                }`}
                        />
                    ))}


                    {/* Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === current ? 'bg-blue-600 scale-110' : 'bg-gray-300'
                                    }`}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>

            {/* header */}
            <div className="bg-white py-6 mx-4 rounded-lg border border-amber-300">
                <div className="max-w-7xl mx-auto px-3">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Travel Categories</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[{
                            key: 'car',
                            img: '/images/car.png',
                            label: 'Car'
                        }, {
                            key: 'bus',
                            img: '/images/bus.png',
                            label: 'Bus'
                        }, {
                            key: 'suv',
                            img: '/images/suv-car.png',
                            label: 'SUV'
                        }, {
                            key: 'van',
                            img: '/images/van.png',
                            label: 'Van'
                        }].map((item) => (
                            <button key={item.key} className="flex items-center gap-3 p-3 bg-gradient-to-bl from-amber-200 to-red-100 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-black/10">
                                <div className="flex-shrink-0 w-12 h-12 rounded-md bg-gray-50 flex items-center justify-center">
                                    <img src={item.img} alt={item.label} className="w-8 h-8 object-contain" />
                                </div>
                                <div className="text-left">
                                    <span className="block text-sm font-medium text-gray-900">{item.label}</span>
                                    <span className="block text-xs text-gray-500">Fast, reliable</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top travel info section */}
            <TravelInfo />

            {/* Top travel providers section */}
            <TopTravelProviders />

        </>
    )
}

export default page
