"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail, Phone, Clock, MessageSquare } from "lucide-react";
import InlineAlert from "@/components/InlineAlert";
import Footer from "@/components/Footer";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        if (!form.name.trim()) return setError("Please enter your name.");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("Please enter a valid email address.");
        if (form.message.trim().length < 10) return setError("Message must be at least 10 characters.");
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#F5F3FF]">

            {/* Header */}
            <div className="bg-white sticky top-0 md:top-14 z-20 border-b border-gray-100">
                <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 h-14 flex items-center gap-3">
                    <Link href="/" className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition flex-shrink-0">
                        <ArrowLeft size={16} className="text-gray-600" />
                    </Link>
                    <h1 className="text-base font-extrabold text-gray-900">Contact Us</h1>
                </div>
            </div>

            <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 pt-5 pb-16 space-y-4">

                {/* Hero */}
                <div
                    className="rounded-2xl px-6 py-8 text-center"
                    style={{ background: "linear-gradient(135deg, #2D1B69 0%, #5B21B6 50%, #7C3AED 100%)" }}
                >
                    <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center mx-auto mb-4">
                        <MessageSquare size={24} className="text-white" />
                    </div>
                    <h2 className="text-xl font-extrabold text-white mb-2">We're here to help</h2>
                    <p className="text-sm text-violet-200">Reach out to us anytime. We typically respond within 2 hours during working hours.</p>
                </div>

                {/* Contact methods */}
                <div className="grid grid-cols-1 gap-3">
                    <a
                        href="mailto:support@traveleasyhai.com"
                        className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition group"
                    >
                        <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-100 transition">
                            <Mail size={18} className="text-[#7C3AED]" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Email</p>
                            <p className="text-sm font-bold text-gray-900">support@traveleasyhai.com</p>
                        </div>
                    </a>

                    <a
                        href="tel:+919876543210"
                        className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition group"
                    >
                        <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-100 transition">
                            <Phone size={18} className="text-[#7C3AED]" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Phone</p>
                            <p className="text-sm font-bold text-gray-900">+91 98765 43210</p>
                        </div>
                    </a>

                    <a
                        href="https://wa.me/919876543210?text=Hi%2C%20I%20need%20help%20with%20TravelEasyHai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-50 border border-green-100 rounded-2xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition"
                    >
                        <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#16a34a">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-green-600 font-medium">WhatsApp</p>
                            <p className="text-sm font-bold text-gray-900">Chat with us instantly</p>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" className="ml-auto flex-shrink-0">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                    </a>

                    <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                            <Clock size={18} className="text-[#7C3AED]" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Support Hours</p>
                            <p className="text-sm font-bold text-gray-900">Mon–Sat, 9:00 AM – 6:00 PM IST</p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-2xl shadow-sm p-5">
                    <h2 className="text-sm font-extrabold text-gray-900 mb-1">Send us a message</h2>
                    <p className="text-xs text-gray-400 mb-4">We'll get back to you within 2 business hours.</p>

                    {submitted ? (
                        <InlineAlert
                            type="success"
                            message="Message sent! We'll get back to you within 2 business hours."
                        />
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {error && <InlineAlert message={error} onDismiss={() => setError("")} />}

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Enter your full name"
                                    className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-violet-100 transition bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    placeholder="your@email.com"
                                    className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-violet-100 transition bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message</label>
                                <textarea
                                    value={form.message}
                                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                    placeholder="Describe your issue or question..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-violet-100 transition bg-gray-50 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full h-12 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl text-sm transition shadow-lg shadow-violet-200 active:scale-[0.98]"
                            >
                                Send Message
                            </button>
                        </form>
                    )}
                </div>

                {/* Social */}
                <div className="bg-white rounded-2xl shadow-sm p-5">
                    <p className="text-xs font-bold text-[#7C3AED] uppercase tracking-widest mb-3">Follow Us</p>
                    <div className="flex gap-3">
                        <a
                            href="#"
                            className="flex-1 h-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 hover:bg-violet-50 hover:border-violet-200 hover:text-[#7C3AED] transition"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                            </svg>
                            Instagram
                        </a>
                        <a
                            href="#"
                            className="flex-1 h-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 hover:bg-violet-50 hover:border-violet-200 hover:text-[#7C3AED] transition"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            Twitter / X
                        </a>
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
}
