import ComingSoon from "@/components/ComingSoon";
import { Wallet } from "lucide-react";
import TravelerBottomNav from "@/components/TravelerBottomNav";

export default function WalletPage() {
    return (
        <>
            <ComingSoon
                icon={<Wallet size={36} className="text-[#7C3AED]" />}
                title="Wallet"
                description="Add money, track spending, and pay for rides instantly — your in-app wallet is on its way."
            />
            <TravelerBottomNav />
        </>
    );
}
