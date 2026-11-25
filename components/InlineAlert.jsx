import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

/**
 * Inline alert banner — replaces toast notifications.
 * type: "error" | "success" | "info"
 */
export default function InlineAlert({ message, type = "error", onDismiss }) {
    if (!message) return null;

    const styles = {
        error:   "bg-red-50 border-red-200 text-red-700",
        success: "bg-green-50 border-green-200 text-green-700",
        info:    "bg-violet-50 border-violet-200 text-violet-700",
    };

    const Icon = type === "success" ? CheckCircle : type === "info" ? Info : AlertCircle;

    return (
        <div className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-medium ${styles[type]}`}>
            <Icon size={16} className="flex-shrink-0 mt-px" />
            <span className="flex-1 leading-snug">{message}</span>
            {onDismiss && (
                <button onClick={onDismiss} className="flex-shrink-0 opacity-60 hover:opacity-100 transition mt-px">
                    <X size={14} />
                </button>
            )}
        </div>
    );
}
