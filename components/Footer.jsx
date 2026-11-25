import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 mt-12">
            <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 py-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="text-center">
                        <Image
                            src="/images/logo.png"
                            alt="TravelEasy"
                            width={140}
                            height={47}
                            className="h-9 w-auto mx-auto"
                        />
                        <p className="text-xs text-gray-400 mt-1.5">Share Ride. Save More.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                        {[
                            { href: "/about",   label: "About"   },
                            { href: "/help",    label: "Help"    },
                            { href: "/contact", label: "Contact" },
                            { href: "/privacy", label: "Privacy" },
                            { href: "/terms",   label: "Terms"   },
                        ].map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="text-xs text-gray-500 hover:text-[#7C3AED] transition font-medium"
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    <p className="text-xs text-gray-400">© {new Date().getFullYear()} TravelEasyHai. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
