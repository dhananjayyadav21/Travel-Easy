"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, ArrowLeft, TrendingUp, TrendingDown, Download, ChevronDown } from "lucide-react";
import AdminRoute from "@/utils/AdminRoute";
import AdminBottomNav from "@/components/AdminBottomNav";

const RANGES = [
    { label: "Last 7 Days",  value: 7  },
    { label: "Last 30 Days", value: 30 },
    { label: "Last 90 Days", value: 90 },
];

function formatINR(n) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency", currency: "INR", minimumFractionDigits: 0,
    }).format(n);
}

function BarChart({ data }) {
    if (!data || data.length === 0) return null;
    const W = 320, H = 120, PAD_X = 6, PAD_TOP = 8, PAD_BOT = 22;
    const show = data.length <= 15 ? data : data.slice(-15);
    const maxVal = Math.max(...show.map(d => d.revenue), 1);
    const barSlotW = (W - PAD_X * 2) / show.length;
    const barW = Math.max(barSlotW - 4, 4);
    const chartH = H - PAD_TOP - PAD_BOT;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 130 }} preserveAspectRatio="none">
            <defs>
                <linearGradient id="barFull" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
                <linearGradient id="barLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C4B5FD" />
                    <stop offset="100%" stopColor="#DDD6FE" />
                </linearGradient>
            </defs>
            {show.map((d, i) => {
                const ratio = d.revenue / maxVal;
                const barH = Math.max(4, ratio * chartH);
                const x = PAD_X + i * barSlotW + (barSlotW - barW) / 2;
                const y = PAD_TOP + (chartH - barH);
                const fill = ratio >= 0.6 ? "url(#barFull)" : "url(#barLight)";
                return (
                    <g key={i}>
                        <rect x={x} y={y} width={barW} height={barH} rx="4" fill={fill} />
                        {show.length <= 10 && (
                            <text x={x + barW / 2} y={H - 5} textAnchor="middle" fontSize="7" fill="#C4B5FD">
                                {d.date.split(" ")[0]}
                            </text>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}

export default function AdminReports() {
    const router = useRouter();
    const [range, setRange] = useState(30);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchReport = async (r = range) => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/admin/reports?range=${r}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch report");
            setReport(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReport(); }, []);

    const handleRangeChange = (val) => {
        setRange(val);
        fetchReport(val);
    };

    const handleExport = () => {
        if (!report?.dailyData) return;
        const rows = [
            ["Date", "Revenue (₹)", "Rides"],
            ...report.dailyData.map(d => [d.date, d.revenue, d.rides]),
        ];
        const csv = rows.map(r => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report-${RANGES.find(r => r.value === range)?.label.replace(/ /g, "-")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const selectedLabel = RANGES.find(r => r.value === range)?.label || "Last 30 Days";
    const growthUp = !report || report.growth >= 0;

    return (
        <AdminRoute>
            <div className="min-h-screen bg-[#F5F3FF] pb-24">

                {/* ── HEADER ── */}
                <div className="bg-white border-b border-gray-100 sticky top-14 z-20">
                    <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition"
                            >
                                <ArrowLeft size={16} className="text-gray-600" />
                            </button>
                            <h1 className="text-base font-extrabold text-gray-900">Reports</h1>
                        </div>
                        <button className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition relative">
                            <Bell size={15} className="text-gray-500" />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
                        </button>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto px-4 pt-4 pb-6 space-y-4">

                    {/* ── PILL DATE SELECTOR ── */}
                    <div className="relative inline-block w-full max-w-[180px]">
                        <select
                            value={range}
                            onChange={e => handleRangeChange(Number(e.target.value))}
                            className="w-full h-10 pl-4 pr-8 bg-white border border-gray-200 rounded-full text-sm text-gray-700 font-semibold shadow-sm focus:outline-none focus:border-[#7C3AED] appearance-none"
                        >
                            {RANGES.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            <div className="bg-white rounded-2xl p-5 animate-pulse shadow-sm">
                                <div className="h-3 bg-gray-100 rounded w-24 mb-4" />
                                <div className="h-10 bg-gray-100 rounded w-44 mb-2" />
                                <div className="h-4 bg-gray-50 rounded w-16" />
                            </div>
                            <div className="bg-white rounded-2xl p-5 animate-pulse shadow-sm">
                                <div className="h-32 bg-gray-50 rounded-xl" />
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
                            <p className="text-sm text-red-600 font-semibold mb-2">{error}</p>
                            <button onClick={() => fetchReport()} className="text-xs text-[#7C3AED] font-bold hover:underline">Retry</button>
                        </div>
                    ) : report && (
                        <>
                            {/* ── REVENUE CARD ── */}
                            <div className="bg-white rounded-2xl shadow-sm p-5">
                                <p className="text-sm text-gray-500 font-medium mb-2">Total Revenue</p>
                                <p className="text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                                    {formatINR(report.totalRevenue)}
                                </p>
                                <div className={`inline-flex items-center gap-1 text-sm font-bold ${growthUp ? "text-green-500" : "text-red-500"}`}>
                                    {growthUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                    {growthUp ? "▲" : "▼"} {Math.abs(report.growth)}%
                                </div>
                            </div>

                            {/* ── BAR CHART CARD ── */}
                            <div className="bg-white rounded-2xl shadow-sm p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm font-bold text-gray-900">Daily Revenue</p>
                                    <span className="text-xs text-gray-400 font-medium">{selectedLabel}</span>
                                </div>
                                <BarChart data={report.dailyData} />

                                {/* Summary row */}
                                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-50">
                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-400 font-medium mb-0.5">Avg/Day</p>
                                        <p className="text-sm font-extrabold text-gray-800">
                                            {new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
                                                report.dailyData.length > 0 ? Math.round(report.totalRevenue / report.dailyData.length) : 0
                                            )}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-400 font-medium mb-0.5">Total Rides</p>
                                        <p className="text-sm font-extrabold text-gray-800">
                                            {report.dailyData.reduce((s, d) => s + d.rides, 0)}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-400 font-medium mb-0.5">Peak Day</p>
                                        <p className="text-sm font-extrabold text-[#7C3AED]">
                                            {new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
                                                Math.max(...report.dailyData.map(d => d.revenue), 0)
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ── EXPORT BUTTON ── */}
                            <button
                                onClick={handleExport}
                                className="w-full h-14 bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-[0.98] text-white font-extrabold rounded-2xl text-base transition-all shadow-lg shadow-violet-200 flex items-center justify-center gap-2"
                            >
                                <Download size={18} /> Export Report
                            </button>
                        </>
                    )}
                </div>
            </div>
            <AdminBottomNav />
        </AdminRoute>
    );
}
