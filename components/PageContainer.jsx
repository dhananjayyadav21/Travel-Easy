/**
 * PageContainer — consistent responsive content wrapper.
 * Use this on every page that has a bottom nav (passenger/driver/admin).
 * Max width: 2xl (672px), centered, with standard horizontal padding.
 */
export default function PageContainer({ children, className = "" }) {
    return (
        <div className={`max-w-2xl mx-auto w-full px-4 ${className}`}>
            {children}
        </div>
    );
}
