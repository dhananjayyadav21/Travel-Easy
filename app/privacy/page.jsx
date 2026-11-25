import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Privacy Policy — TravelEasyHai",
    description: "How TravelEasyHai collects, uses, and protects your personal data.",
};

const Section = ({ title, children }) => (
    <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">{title}</h2>
        <div className="text-sm text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
);

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#F5F3FF]">

            {/* Header */}
            <div className="bg-white sticky top-14 z-20 border-b border-gray-100">
                <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 h-14 flex items-center gap-3">
                    <Link href="/" className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition flex-shrink-0">
                        <ArrowLeft size={16} className="text-gray-600" />
                    </Link>
                    <h1 className="text-base font-extrabold text-gray-900">Privacy Policy</h1>
                </div>
            </div>

            <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 pt-5 pb-16 space-y-4">

                {/* Intro banner */}
                <div className="bg-violet-50 border border-violet-100 rounded-2xl px-5 py-4">
                    <p className="text-xs font-bold text-[#7C3AED] mb-1">Last updated: November 2024</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Your privacy matters to us. This policy explains what data we collect, how we use it, and your rights over it. By using TravelEasyHai, you agree to this policy.
                    </p>
                </div>

                <Section title="1. Information We Collect">
                    <p>We collect only the information necessary to provide our service:</p>
                    <ul className="space-y-1.5 mt-2">
                        {[
                            { label: "Name & Email",    desc: "Required to create your account and send booking confirmations." },
                            { label: "Phone Number",    desc: "Used to connect you with your driver and for OTP-based login." },
                            { label: "Location Data",   desc: "Collected during active rides for GPS tracking and route calculation. Never stored after the ride ends." },
                            { label: "Payment Method",  desc: "We store your payment preference (UPI, cash) but do not store card or bank details." },
                            { label: "Device & Usage",  desc: "Basic app usage data (pages visited, errors) to improve our service." },
                        ].map(({ label, desc }) => (
                            <li key={label} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" />
                                <span><strong className="text-gray-800">{label}:</strong> {desc}</span>
                            </li>
                        ))}
                    </ul>
                </Section>

                <Section title="2. How We Use Your Information">
                    <ul className="space-y-1.5">
                        {[
                            "Process and confirm your bookings",
                            "Connect you with your driver for coordination",
                            "Send OTP codes and ride notifications via email/SMS",
                            "Calculate distances and pricing (₹8/km per seat)",
                            "Ensure safety through driver verification",
                            "Resolve disputes and provide customer support",
                            "Improve app performance and fix bugs",
                        ].map(item => (
                            <li key={item} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </Section>

                <Section title="3. Data Sharing">
                    <p>
                        <strong className="text-gray-800">We do not sell your personal data.</strong> Period.
                    </p>
                    <p>We share limited data only when necessary:</p>
                    <ul className="space-y-1.5 mt-2">
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" />
                            <span><strong className="text-gray-800">With Drivers:</strong> Your name and phone number are shared with your driver only after booking confirmation.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" />
                            <span><strong className="text-gray-800">With Service Providers:</strong> We use MongoDB for database, Google Maps for routing, and email providers for notifications — all under strict data agreements.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" />
                            <span><strong className="text-gray-800">Legal Requirement:</strong> We may disclose information if required by Indian law or a valid court order.</span>
                        </li>
                    </ul>
                </Section>

                <Section title="4. Cookies">
                    <p>We use minimal cookies and localStorage to:</p>
                    <ul className="space-y-1.5 mt-2">
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" />
                            <span>Keep you logged in (JWT token stored in localStorage)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" />
                            <span>Remember your onboarding preference</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" />
                            <span>Cache your selected trip details during booking</span>
                        </li>
                    </ul>
                    <p className="mt-2">We do not use advertising or tracking cookies.</p>
                </Section>

                <Section title="5. Data Security">
                    <p>We protect your data with:</p>
                    <ul className="space-y-1.5 mt-2">
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span>bcrypt password hashing (never stored in plain text)</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span>JWT tokens with 7-day expiry</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span>HTTPS encryption on all data in transit</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span>MongoDB Atlas with access controls and encryption at rest</span></li>
                    </ul>
                </Section>

                <Section title="6. Your Rights">
                    <p>You have full control over your data:</p>
                    <ul className="space-y-1.5 mt-2">
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span><strong className="text-gray-800">Access:</strong> Request a copy of all data we hold about you.</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span><strong className="text-gray-800">Correction:</strong> Update your name, phone, or email from your profile.</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span><strong className="text-gray-800">Deletion:</strong> Request account deletion by emailing us. We'll delete your data within 30 days.</span></li>
                        <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 flex-shrink-0" /><span><strong className="text-gray-800">Opt-out:</strong> Unsubscribe from marketing emails at any time.</span></li>
                    </ul>
                </Section>

                <Section title="7. Contact Us">
                    <p>For any privacy concerns or data requests, reach us at:</p>
                    <div className="mt-3 bg-violet-50 rounded-xl px-4 py-3 space-y-1">
                        <p><strong className="text-gray-800">Email:</strong>{" "}
                            <a href="mailto:support@traveleasyhai.com" className="text-[#7C3AED] font-semibold">support@traveleasyhai.com</a>
                        </p>
                        <p><strong className="text-gray-800">Response time:</strong> Within 2 business days</p>
                    </div>
                </Section>

            </div>

            <Footer />
        </div>
    );
}
