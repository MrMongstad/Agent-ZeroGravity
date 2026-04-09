"use client";

import React from 'react';
import { LineChart, DollarSign, ArrowUpRight, TrendingDown } from 'lucide-react';

interface FinancialsProps {
  burnRates?: {
    anthropic?: number;
    google?: number;
    openai?: number;
    total_24h?: string;
  };
}

export default function Financials({ burnRates }: FinancialsProps) {
  const defaultBurn = {
    anthropic: 75,
    google: 12,
    openai: 42,
    total_24h: "$12.45"
  };

  const burn = burnRates || defaultBurn;

  const providers = [
    { name: "Anthropic / Claude", value: burn.anthropic, color: "bg-amber-100", glow: "shadow-amber-500/20" },
    { name: "Google / Vertex AI", value: burn.google, color: "bg-blue-500", glow: "shadow-blue-500/20" },
    { name: "OpenAI / GPT-4o", value: burn.openai, color: "bg-emerald-500", glow: "shadow-emerald-500/20" },
  ];

  return (
    <div className="glass-panel h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <LineChart className="w-5 h-5 text-blue-500" />
          <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">Financial Burn Intel</h2>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-500">
           <TrendingDown className="w-3 h-3" />
           <span>-12% (24h)</span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {providers.map((p, i) => (
          <div key={i}>
            <div className="flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">
              <span>{p.name}</span>
              <span className="text-white/80 font-mono tracking-tighter">{p.value}% Limit</span>
            </div>
            <div className="h-[6px] w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative group">
              <div 
                className={`h-full ${p.color} transition-all duration-1000 shadow-[0_0_12px] group-hover:brightness-125 ${p.glow}`}
                style={{ width: `${p.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
         <span className="text-[9px] uppercase tracking-widest font-black text-white/20">Monthly Run Rate</span>
         <div className="flex items-center gap-1 group cursor-pointer">
            <span className="text-xl font-mono font-black text-white/80 tracking-tighter group-hover:text-blue-500 transition-colors">{burn.total_24h}</span>
            <ArrowUpRight className="w-3 h-3 text-white/20 group-hover:text-blue-500 transition-colors" />
         </div>
      </div>
    </div>
  );
}
