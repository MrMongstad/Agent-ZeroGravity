import React from 'react';
import { LayoutPanelTop, Database, DollarSign } from 'lucide-react';

interface HeaderProps {
  tasks: number;
  cost: string;
}

export default function Header({ tasks, cost }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-10 py-6 border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-4 group cursor-pointer">
        <div className="relative">
          <LayoutPanelTop className="w-8 h-8 text-blue-500 group-hover:text-purple-500 transition-colors" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full blur-[2px] animate-pulse opacity-50" />
        </div>
        <h1 className="text-xl font-black tracking-tighter uppercase group-hover:tracking-[0.1em] transition-all duration-500">EmpireHQ</h1>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase text-white/40 font-mono tracking-widest">Tasks Completed (24h)</span>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500" />
            <span className="text-lg font-bold font-mono">{tasks}</span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase text-white/40 font-mono tracking-widest">API Cost (24h)</span>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-500" />
            <span className="text-lg font-bold font-mono">{cost}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
