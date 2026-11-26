import ComingSoon from "@/components/ComingSoon";
import { Bell } from "lucide-react";
import TravelerBottomNav from "@/components/TravelerBottomNav";

export default function NotificationsPage() {
    return (
        <>
            <ComingSoon
                icon={<Bell size={36} className="text-[#7C3AED]" />}
                title="Notifications"
                description="Stay updated with ride alerts, booking confirmations, and special offers — all in one place."
            />
            <TravelerBottomNav />
        </>
    );
}
