"use client";

import React from 'react';
import { Eye, Network, Brain, Activity } from 'lucide-react';

interface NeuralBusProps {
  tasks?: Array<{ id: string; agent: string; task: string; status: string }>;
}

export default function NeuralBus({ tasks }: NeuralBusProps) {
  const defaultTasks = [
    { id: "1", agent: "Jarvis", task: "Building EmpireHQ", status: "In Progress" },
    { id: "2", agent: "Claude", task: "Vortex Intelligence Auditing", status: "Active" },
    { id: "3", agent: "Cline", task: "Idle polling", status: "Standby" },
  ];

  const displayTasks = tasks?.length ? tasks : defaultTasks;

  return (
    <div className="glass-panel h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-blue-500" />
          <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">Neural Bus Monitor</h2>
        </div>
        <Network className="w-4 h-4 text-white/20 animate-pulse" />
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-4 custom-scrollbar">
        {displayTasks.map((t) => (
          <div key={t.id} className="relative group border-l-2 border-white/5 pl-4 py-2 hover:border-blue-500/40 transition-colors">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-1">{t.agent}</span>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-white/60 font-medium group-hover:text-white/80 transition-colors">{t.task}</span>
              <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border transition-colors ${
                t.status === 'Active' || t.status === 'In Progress' 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                  : 'bg-white/5 text-white/30 border-white/10'
              }`}>
                {t.status}
              </div>
            </div>
            
            {(t.status === 'Active' || t.status === 'In Progress') && (
              <div className="absolute -left-[2px] top-4 w-1 h-2 bg-blue-500 blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
