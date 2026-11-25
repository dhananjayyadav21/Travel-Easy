"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, ArrowLeft, MoreVertical, RefreshCw, Search, UserX, UserCheck, Briefcase, Trash2, Mail, Phone, Calendar, ShieldCheck, ChevronDown } from "lucide-react";
import AdminRoute from "@/utils/AdminRoute";
import AdminBottomNav from "@/components/AdminBottomNav";
import InlineAlert from "@/components/InlineAlert";

const TABS = ["All", "Active", "Blocked"];

function getInitials(name) {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function DropdownMenu({ user, onAction, onClose }) {
    const ref = useRef();
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [onClose]);

    return (
        <div ref={ref} className="absolute right-0 top-9 z-20 bg-white border border-gray-100 rounded-2xl shadow-xl w-44 overflow-hidden">
            {user.isBlocked ? (
                <button onClick={() => onAction("unblock")} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-green-600 hover:bg-green-50 transition text-left">
                    <UserCheck size={15} /> Unblock User
                </button>
            ) : (
                <button onClick={() => onAction("block")} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition text-left">
                    <UserX size={15} /> Block User
                </button>
            )}
            {user.role === "traveler" && (
                <button onClick={() => onAction("makeProvider")} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#7C3AED] hover:bg-violet-50 transition text-left border-t border-gray-50">
                    <Briefcase size={15} /> Make Provider
                </button>
            )}
            <button onClick={() => onAction("delete")} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-700 hover:bg-red-50 transition text-left border-t border-gray-50">
                <Trash2 size={15} /> Delete User
            </button>
        </div>
    );
}

export default function AdminUsers() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("All");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [openMenu, setOpenMenu] = useState(null);
    const [expandedUser, setExpandedUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [actionError, setActionError] = useState("");

    const fetchUsers = async (tab = activeTab) => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/admin/users?tab=${tab.toLowerCase()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch users");
            setUsers(data.users || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        fetchUsers(tab);
        setSearch("");
    };

    const handleAction = async (userId, action) => {
        setOpenMenu(null);
        setActionError("");
        setActionLoading(userId);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ userId, action }),
            });
            if (!res.ok) throw new Error("Action failed. Please try again.");
            fetchUsers(activeTab);
        } catch (err) {
            setActionError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const filtered = users.filter(u =>
        !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
    );

    const ROLE_COLORS = {
        traveler: "bg-blue-50 text-blue-600",
        provider: "bg-violet-50 text-[#7C3AED]",
        admin:    "bg-amber-50 text-amber-700",
    };

    return (
        <AdminRoute>
            <div className="min-h-screen bg-[#F5F3FF] pb-24">

                {/* ── HEADER ── */}
                <div className="bg-white border-b border-gray-100 sticky top-14 z-20">
                    <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition"
                            >
                                <ArrowLeft size={16} className="text-gray-600" />
                            </button>
                            <h1 className="text-base font-extrabold text-gray-900">Users</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => fetchUsers()}
                                className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition"
                            >
                                <RefreshCw size={15} className="text-gray-500" />
                            </button>
                            <button className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition relative">
                                <Bell size={15} className="text-gray-500" />
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
                            </button>
                        </div>
                    </div>

                    {/* ── UNDERLINE TABS ── */}
                    <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 flex">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={`flex-1 pb-3 text-sm font-semibold transition-all border-b-2 ${
                                    activeTab === tab
                                        ? "border-[#7C3AED] text-[#7C3AED]"
                                        : "border-transparent text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-3/5 lg:w-2/5 mx-auto px-4 pt-4 space-y-3">

                    {/* Search */}
                    <div className="relative">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name or email…"
                            className="w-full h-11 pl-9 pr-4 bg-white border border-gray-100 rounded-2xl text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-violet-100 transition"
                        />
                    </div>

                    {actionError && (
                        <div className="mb-3">
                            <InlineAlert message={actionError} onDismiss={() => setActionError("")} />
                        </div>
                    )}

                    {/* ── USER LIST ── */}
                    {loading ? (
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            {[1, 2, 3, 4, 5].map((i, idx, arr) => (
                                <div key={i} className={`flex items-center gap-3 px-4 py-3.5 animate-pulse ${idx < arr.length - 1 ? "border-b border-gray-50" : ""}`}>
                                    <div className="w-11 h-11 rounded-full bg-gray-100 flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3.5 bg-gray-100 rounded w-1/3" />
                                        <div className="h-3 bg-gray-50 rounded w-16" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
                            <p className="text-sm text-red-600 font-semibold mb-2">{error}</p>
                            <button onClick={() => fetchUsers()} className="text-xs text-[#7C3AED] font-bold hover:underline">Retry</button>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center py-16 text-center">
                            <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-3">
                                <Search size={22} className="text-violet-300" />
                            </div>
                            <p className="text-sm font-bold text-gray-700">No users found</p>
                            <p className="text-xs text-gray-400 mt-1">Try a different filter or search</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filtered.map((user) => {
                                const isExpanded = expandedUser === user.id;
                                const joinDate = user.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                    : "—";
                                return (
                                    <div key={user.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                        {/* ── ROW (click to expand) ── */}
                                        <div
                                            className="flex items-center gap-3 px-4 py-3.5 relative cursor-pointer"
                                            onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                                        >
                                            {/* Avatar */}
                                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#6C2BD9] to-[#8B5CF6] flex items-center justify-center flex-shrink-0 shadow-sm shadow-violet-200">
                                                <span className="text-white text-xs font-extrabold">{getInitials(user.name)}</span>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.isBlocked ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                                                        {user.isBlocked ? "Blocked" : "Active"}
                                                    </span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${ROLE_COLORS[user.role] || "bg-gray-50 text-gray-500"}`}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Chevron + three-dot */}
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <ChevronDown size={15} className={`text-gray-300 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                                                <div className="relative" onClick={e => e.stopPropagation()}>
                                                    {actionLoading === user.id ? (
                                                        <div className="w-8 h-8 flex items-center justify-center">
                                                            <div className="w-4 h-4 border-2 border-t-transparent border-[#7C3AED] rounded-full animate-spin" />
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                                                            className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center transition"
                                                        >
                                                            <MoreVertical size={16} className="text-gray-400" />
                                                        </button>
                                                    )}
                                                    {openMenu === user.id && (
                                                        <DropdownMenu
                                                            user={user}
                                                            onAction={(action) => handleAction(user.id, action)}
                                                            onClose={() => setOpenMenu(null)}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── EXPANDED DETAIL ── */}
                                        {isExpanded && (
                                            <div className="border-t border-gray-50 px-4 py-3 bg-gray-50/60 space-y-2">
                                                {user.email && (
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                                                            <Mail size={13} className="text-[#7C3AED]" />
                                                        </div>
                                                        <p className="text-xs text-gray-600 truncate">{user.email}</p>
                                                    </div>
                                                )}
                                                {user.phone && (
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                                            <Phone size={13} className="text-green-600" />
                                                        </div>
                                                        <p className="text-xs text-gray-600">{user.phone}</p>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                                                        <Calendar size={13} className="text-amber-600" />
                                                    </div>
                                                    <p className="text-xs text-gray-600">Joined {joinDate}</p>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                                                        <ShieldCheck size={13} className="text-teal-600" />
                                                    </div>
                                                    <p className="text-xs text-gray-600">Email {user.isVerified ? "verified" : "not verified"}</p>
                                                </div>

                                                {/* Quick actions */}
                                                <div className="flex gap-2 pt-1">
                                                    {user.isBlocked ? (
                                                        <button
                                                            onClick={() => handleAction(user.id, "unblock")}
                                                            className="flex-1 h-9 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
                                                        >
                                                            <UserCheck size={13} /> Unblock
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleAction(user.id, "block")}
                                                            className="flex-1 h-9 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
                                                        >
                                                            <UserX size={13} /> Block
                                                        </button>
                                                    )}
                                                    {user.role === "traveler" && (
                                                        <button
                                                            onClick={() => handleAction(user.id, "makeProvider")}
                                                            className="flex-1 h-9 bg-violet-50 hover:bg-violet-100 text-[#7C3AED] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
                                                        >
                                                            <Briefcase size={13} /> Make Provider
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleAction(user._id || user.id, "delete")}
                                                        className="w-9 h-9 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition flex-shrink-0"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <AdminBottomNav />
        </AdminRoute>
    );
}
