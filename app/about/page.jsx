import Link from "next/link";
import { ArrowLeft, MapPin, Shield, Zap, Users, TrendingUp, Heart } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata = { title: "About Us — TravelEasyHai" };

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#F5F3FF]">

            {/* Header */}
            <div className="bg-white sticky top-14 z-20 border-b border-gray-100">
                <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 h-14 flex items-center gap-3">
                    <Link href="/" className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-violet-50 transition">
                        <ArrowLeft size={16} className="text-gray-600" />
                    </Link>
                    <h1 className="text-base font-extrabold text-gray-900">About Us</h1>
                </div>
            </div>

            <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 pt-5 pb-8 space-y-4">

                {/* Hero */}
                <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg,#4C1D95 0%,#7C3AED 60%,#8B5CF6 100%)" }}>
                    <div className="px-6 pt-8 pb-6">
                        <p className="text-xs font-bold text-violet-300 uppercase tracking-widest mb-2">Our Mission</p>
                        <h2 className="text-2xl font-extrabold text-white leading-tight mb-3">
                            India's Most Affordable Carpooling Platform
                        </h2>
                        <p className="text-sm text-violet-200 leading-relaxed">
                            We believe everyone deserves affordable, safe, and sustainable travel. TravelEasyHai connects drivers with empty seats to travellers going the same way — saving money, reducing traffic, and building community.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { value: "10K+",  label: "Rides Shared" },
                        { value: "50+",   label: "Cities"       },
                        { value: "₹8/km", label: "Flat Rate"    },
                    ].map(({ value, label }) => (
                        <div key={label} className="bg-white rounded-2xl shadow-sm p-4 text-center">
                            <p className="text-xl font-extrabold text-[#7C3AED]">{value}</p>
                            <p className="text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Values */}
                <div className="bg-white rounded-2xl shadow-sm p-5">
                    <p className="text-xs font-bold text-[#7C3AED] uppercase tracking-widest mb-4">Why TravelEasyHai</p>
                    <div className="space-y-4">
                        {[
                            { icon: TrendingUp, title: "Affordable — ₹8/km per seat", desc: "No surge pricing, no hidden fees. A flat ₹8 per km per seat, always. Split the cost, save up to 60% vs a solo cab." },
                            { icon: Shield,     title: "Verified Drivers",             desc: "Every driver goes through ID verification. Vehicle number, PAN card, and contact details are verified before they can list a ride." },
                            { icon: MapPin,     title: "Real-time Tracking",           desc: "Track your ride live with GPS. Share your trip with family for safety. Full transparency from start to finish." },
                            { icon: Users,      title: "Community First",              desc: "More than a service — a community of daily commuters, weekend travellers, and responsible drivers sharing the road." },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                                    <Icon size={18} className="text-[#7C3AED]" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 mb-0.5">{title}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How it works */}
                <div className="bg-white rounded-2xl shadow-sm p-5">
                    <p className="text-xs font-bold text-[#7C3AED] uppercase tracking-widest mb-4">How It Works</p>
                    <div className="space-y-4">
                        {[
                            { step: "01", title: "Find a Ride",        desc: "Search rides by source and destination. Browse available seats with real-time availability." },
                            { step: "02", title: "Book Your Seat",     desc: "Select your preferred seat, review the fare, and confirm your booking in seconds." },
                            { step: "03", title: "Travel Together",    desc: "Meet your driver at the pickup point. Pay on arrival. Rate your experience after the ride." },
                        ].map(({ step, title, desc }) => (
                            <div key={step} className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-extrabold text-[#7C3AED]">{step}</span>
                                </div>
                                <div className="pt-0.5">
                                    <p className="text-sm font-bold text-gray-900 mb-0.5">{title}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Story */}
                <div className="bg-white rounded-2xl shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Heart size={16} className="text-[#7C3AED]" />
                        <p className="text-sm font-extrabold text-gray-900">Our Story</p>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        TravelEasyHai was born from a simple frustration — paying full cab fares for a half-empty car.
                        We built a platform where drivers with empty seats and travellers going the same way can find each other.
                        No middlemen, no inflated prices. Just people helping people travel smarter across India.
                    </p>
                </div>

                {/* CTA */}
                <div className="flex gap-3">
                    <Link href="/register" className="flex-1 py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-full text-sm text-center transition shadow-lg shadow-violet-200">
                        Get Started
                    </Link>
                    <Link href="/contact" className="flex-1 py-3.5 border-2 border-[#7C3AED] text-[#7C3AED] font-bold rounded-full text-sm text-center transition hover:bg-violet-50">
                        Contact Us
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}
