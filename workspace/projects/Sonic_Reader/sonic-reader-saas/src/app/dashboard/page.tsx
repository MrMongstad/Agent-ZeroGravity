"use client";

import { motion } from "framer-motion";
import { Zap, Activity, Shield, Download, Settings, LogOut } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
    const [usage, setUsage] = useState({ current: 12540, limit: 50000 });
    const [licenseKey, setLicenseKey] = useState("SNK-GHOST-XXXX-9921");
    const [isGenerating, setIsGenerating] = useState(false);

    const generateKey = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch("/api/license", { method: "POST" });
            const data = await res.json();
            if (data.licenseKey) setLicenseKey(data.licenseKey);
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    const percentage = (usage.current / usage.limit) * 100;


    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-primary/30">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl z-50 overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="p-2 bg-primary rounded-lg shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]">
                            <Zap className="text-black w-5 h-5 fill-current" />
                        </div>
                        <span className="font-black text-xl tracking-tighter">SONIC<span className="text-primary">DASH</span></span>
                    </div>

                    <nav className="space-y-2">
                        <NavItem icon={<Activity size={20} />} label="Overview" active />
                        <NavItem icon={<Download size={20} />} label="App Downloads" />
                        <NavItem icon={<Shield size={20} />} label="License Keys" />
                        <NavItem icon={<Settings size={20} />} label="Settings" />
                    </nav>
                </div>

                <div className="absolute bottom-0 w-full p-8 border-t border-white/5">
                    <button className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="pl-64 pr-8 pt-8 pb-20">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-black mb-1">Welcome back, Stephan.</h1>
                        <p className="text-slate-500 font-medium">Your digital empire is running at 98.4% efficiency.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 rounded-full border border-primary/20 bg-primary/5 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-xs font-bold text-primary tracking-widest uppercase">Elite Status</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-500 p-[1px]">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-sm">SM</div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Stats */}
                    <StatCard
                        title="Daily Quota Burn"
                        value={`${usage.current.toLocaleString()} / ${usage.limit.toLocaleString()}`}
                        subtext={`${Math.floor(percentage)}% of daily allowance`}
                        progress={percentage}
                    />
                    <StatCard
                        title="SaaS Revenue"
                        value="$1,240.00"
                        subtext="+12% from yesterday"
                    />
                    <StatCard
                        title="Active Nodes"
                        value="2,412"
                        subtext="Global reach active"
                    />

                    {/* Main Viz Area */}
                    <div className="lg:col-span-2 glass rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] group-hover:bg-primary/20 transition-colors" />
                        <h3 className="text-xl font-bold mb-8">Character Ingestion History</h3>
                        <div className="h-64 flex items-end gap-2 px-4">
                            {/* Mock Graph Bars */}
                            {[40, 70, 45, 90, 65, 80, 55, 95, 30, 85, 60, 75].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: i * 0.05, duration: 0.8 }}
                                    className="flex-grow bg-gradient-to-t from-primary/20 to-primary rounded-t-lg hover:to-white transition-colors cursor-pointer"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="glass rounded-3xl p-8 border border-white/5">
                        <h3 className="text-xl font-bold mb-6">Active License</h3>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                            <code className="text-primary font-mono text-lg tracking-wider">{licenseKey}</code>
                        </div>
                        <button
                            onClick={generateKey}
                            disabled={isGenerating}
                            className="w-full py-4 bg-primary text-black font-black rounded-xl hover:scale-[1.02] transition-transform active:scale-95 shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] disabled:opacity-50"
                        >
                            {isGenerating ? "GENERATING..." : "REFRESH LICENSE KEY"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active = false }: any) {
    return (
        <button className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
            {icon}
            <span className="font-bold">{label}</span>
        </button>
    );
}

function StatCard({ title, value, subtext, progress }: any) {
    return (
        <div className="glass rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors" />
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2">{title}</p>
            <h4 className="text-3xl font-black mb-1 tracking-tight">{value}</h4>
            <p className="text-slate-400 text-sm font-medium">{subtext}</p>
            {progress !== undefined && (
                <div className="mt-6 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-primary"
                    />
                </div>
            )}
        </div>
    );
}
