/**
 * PageContainer — consistent responsive content wrapper.
 * mobile: full width  |  tablet (md): 60%  |  large (lg+): 40%
 */
export default function PageContainer({ children, className = "" }) {
    return (
        <div className={`w-full md:w-3/5 lg:w-2/5 mx-auto px-4 ${className}`}>
            {children}
        </div>
    );
}
