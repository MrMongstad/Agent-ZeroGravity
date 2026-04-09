"use client";

import { motion } from "framer-motion";
import { Ship, Lock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Logic for Supabase Magic Link or Password would go here
        setTimeout(() => setIsLoading(false), 1500);
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 selection:bg-primary/30">
            {/* Background Glows */}
            <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass rounded-[2.5rem] p-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    {/* Top Branding */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
                            <Ship className="text-black w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
                            Empire<span className="text-primary">Portal</span>
                        </h1>
                        <p className="text-slate-400 text-sm mt-2 font-medium tracking-wide uppercase">Identity Verification Required</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Secure Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@empire.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all focus:bg-white/[0.08]"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-primary text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all active:scale-95 shadow-[0_0_40px_rgba(var(--primary-rgb),0.2)]"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    REQUEST ACCESS <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Global Support Required?</p>
                        <div className="flex gap-6">
                            <Link href="#" className="text-slate-400 hover:text-primary text-[10px] font-black tracking-tighter transition-colors">DISCORD HQ</Link>
                            <Link href="#" className="text-slate-400 hover:text-primary text-[10px] font-black tracking-tighter transition-colors">ENCRYPTION PROTOCOL</Link>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-8 text-slate-600 text-[10px] font-medium tracking-[0.3em] uppercase">
                    &copy; {new Date().getFullYear()} SonicReader Empire Operations
                </p>
            </motion.div>
        </div>
    );
}
