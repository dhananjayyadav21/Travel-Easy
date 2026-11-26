import ComingSoon from "@/components/ComingSoon";
import { Tag } from "lucide-react";
import TravelerBottomNav from "@/components/TravelerBottomNav";

export default function OffersPage() {
    return (
        <>
            <ComingSoon
                icon={<Tag size={36} className="text-[#7C3AED]" />}
                title="Offers & Coupons"
                description="Exclusive discounts, promo codes, and cashback offers on your rides — coming very soon."
            />
            <TravelerBottomNav />
        </>
    );
}
