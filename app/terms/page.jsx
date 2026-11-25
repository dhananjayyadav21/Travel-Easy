import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Terms of Service — TravelEasyHai",
    description: "Terms and conditions for using the TravelEasyHai platform.",
};

const Section = ({ num, title, children }) => (
    <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex items-start gap-3 mb-3">
            <span className="w-7 h-7 rounded-lg bg-violet-50 text-[#7C3AED] text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">
                {num}
            </span>
            <h2 className="text-sm font-extrabold text-gray-900 pt-1">{title}</h2>
        </div>
        <div className="text-sm text-gray-600 leading-relaxed space-y-2 pl-10">{children}</div>
    </div>
);

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#F5F3FF]">

            {/* Header */}
            <div className="bg-white sticky top-14 z-20 border-b border-gray-100">
                <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 h-14 flex items-center gap-3">
                    <Link href="/" className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition flex-shrink-0">
                        <ArrowLeft size={16} className="text-gray-600" />
                    </Link>
                    <h1 className="text-base font-extrabold text-gray-900">Terms of Service</h1>
                </div>
            </div>

            <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 pt-5 pb-16 space-y-4">

                {/* Intro */}
                <div className="bg-violet-50 border border-violet-100 rounded-2xl px-5 py-4">
                    <p className="text-xs font-bold text-[#7C3AED] mb-1">Effective: November 2024</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        By accessing or using TravelEasyHai, you agree to be bound by these Terms of Service. Please read them carefully before using our platform.
                    </p>
                </div>

                <Section num="1" title="Acceptance of Terms">
                    <p>
                        By registering an account or using any feature of TravelEasyHai ("the Platform"), you confirm that you have read, understood, and agree to these Terms. If you do not agree, please do not use the Platform.
                    </p>
                    <p>
                        We reserve the right to update these Terms at any time. Continued use after changes constitutes acceptance of the revised Terms.
                    </p>
                </Section>

                <Section num="2" title="Eligibility">
                    <ul className="space-y-1.5">
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span>You must be at least 18 years old to use TravelEasyHai.</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span>You must provide accurate, current, and complete registration information.</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span>You are responsible for maintaining the security of your account credentials.</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span>One person may hold only one traveller and one driver account.</span></li>
                    </ul>
                </Section>

                <Section num="3" title="Booking Rules">
                    <ul className="space-y-1.5">
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span><strong className="text-gray-800">Pay on Arrival:</strong> All payments are made directly to the driver at the end of the ride. TravelEasyHai does not process payments.</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span><strong className="text-gray-800">No-Show Policy:</strong> If you do not show up at the agreed meeting point within 15 minutes of departure time, the driver may cancel your booking without refund.</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span><strong className="text-gray-800">Cancellation:</strong> Travellers may cancel bookings at any time before the ride departs. Drivers may cancel for valid reasons (vehicle issues, emergency) with notice.</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span><strong className="text-gray-800">Pricing:</strong> The fare is calculated at ₹8 per kilometre per seat plus a ₹15 platform fee. Drivers cannot charge more than the displayed fare.</span></li>
                    </ul>
                </Section>

                <Section num="4" title="Driver (Provider) Responsibilities">
                    <ul className="space-y-1.5">
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span>Maintain a valid driving licence and vehicle registration at all times.</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span>Ensure the vehicle is roadworthy, clean, and has valid insurance.</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span>Depart at the scheduled time and follow the agreed route.</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span>Treat all passengers with respect and maintain a safe, comfortable environment.</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span>Not accept more passengers than the number of verified available seats.</span></li>
                    </ul>
                </Section>

                <Section num="5" title="Prohibited Conduct">
                    <p>The following are strictly prohibited on TravelEasyHai:</p>
                    <ul className="space-y-1.5 mt-2">
                        {[
                            "Providing false information during registration or booking",
                            "Harassment, discrimination, or abusive behaviour toward other users",
                            "Carrying prohibited or illegal items in the vehicle",
                            "Driving under the influence of alcohol or drugs",
                            "Sharing your account credentials with others",
                            "Attempting to manipulate pricing or reviews",
                            "Using the platform for commercial taxi operations",
                        ].map(item => (
                            <li key={item} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-2">Violations may result in immediate account suspension or permanent ban.</p>
                </Section>

                <Section num="6" title="Limitation of Liability">
                    <p>
                        TravelEasyHai is a platform that connects travellers and drivers. We are not a transportation company and do not employ drivers.
                    </p>
                    <p>
                        We are not liable for: accidents or injuries during a ride, loss of property, delays, or disputes between travellers and drivers. All rides are arranged at the users' own risk.
                    </p>
                    <p>
                        Our maximum liability to you for any claim shall not exceed the platform fee (₹15) paid for the specific booking in question.
                    </p>
                </Section>

                <Section num="7" title="Governing Law">
                    <p>
                        These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
                    </p>
                    <p>
                        We encourage resolving disputes amicably first — contact us at{" "}
                        <a href="mailto:support@traveleasyhai.com" className="text-[#7C3AED] font-semibold">support@traveleasyhai.com</a>
                        {" "}before escalating.
                    </p>
                </Section>

                <Section num="8" title="Contact">
                    <p>Questions about these Terms?</p>
                    <div className="mt-2 bg-violet-50 rounded-xl px-4 py-3 space-y-1">
                        <p><strong className="text-gray-800">Email:</strong>{" "}
                            <a href="mailto:support@traveleasyhai.com" className="text-[#7C3AED] font-semibold">support@traveleasyhai.com</a>
                        </p>
                        <p><strong className="text-gray-800">Hours:</strong> Mon–Sat, 9AM–6PM IST</p>
                    </div>
                </Section>

            </div>

            <Footer />
        </div>
    );
}
