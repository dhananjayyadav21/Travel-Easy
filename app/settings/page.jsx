import ComingSoon from "@/components/ComingSoon";
import { Settings } from "lucide-react";
import TravelerBottomNav from "@/components/TravelerBottomNav";

export default function SettingsPage() {
    return (
        <>
            <ComingSoon
                icon={<Settings size={36} className="text-[#7C3AED]" />}
                title="Settings"
                description="Manage your account preferences, privacy controls, and notification settings."
            />
            <TravelerBottomNav />
        </>
    );
}
