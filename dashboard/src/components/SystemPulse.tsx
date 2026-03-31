"use client";

import React from 'react';
import { Network, Server, ShieldCheck, HeartPulse } from 'lucide-react';

interface SystemPulseProps {
  servers?: Array<{ name: string; status: 'online' | 'offline' | 'warning' }>;
}

export default function SystemPulse({ servers }: SystemPulseProps) {
  const defaultServers = [
    { name: "GitKraken", status: 'online' },
    { name: "StitchMCP", status: 'online' },
    { name: "Supabase", status: 'online' },
    { name: "GitHub", status: 'online' },
    { name: "Memory", status: 'online' },
    { name: "Chrome DevTools", status: 'online' },
    { name: "Antigravity Relay", status: 'online' },
    { name: "Vortex Bus", status: 'online' },
  ];

  const displayServers = servers?.length ? servers : defaultServers;

  return (
    <div className="glass-panel h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <HeartPulse className="w-5 h-5 text-blue-500" />
          <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">System Pulse Monitor</h2>
        </div>
        <ShieldCheck className="w-4 h-4 text-emerald-500/20" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {displayServers.map((s, index) => (
          <div key={index} className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:border-blue-500/20 transition-all hover:bg-white/[0.08] cursor-default">
            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${
              s.status === 'online' ? 'bg-emerald-500 shadow-emerald-500/40' : 
              s.status === 'offline' ? 'bg-red-500 shadow-red-500/40' : 
              'bg-amber-500 shadow-amber-500/40 animate-pulse'
            }`} />
            <span className="text-[10px] font-black uppercase tracking-wider text-white/50">{s.name}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
         <span className="text-[9px] uppercase tracking-widest font-black text-white/20">Overall Health Score</span>
         <span className="text-xl font-mono font-black text-emerald-500 tracking-tighter">99.8%</span>
      </div>
    </div>
  );
}
