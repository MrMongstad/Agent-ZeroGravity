"use client";

import React, { useState } from 'react';
import { Terminal, Maximize2, Minimize2, X, TerminalIcon } from 'lucide-react';

interface FloatingTerminalProps {
  logs?: Array<{ timestamp: string; message: string; type: 'info' | 'error' | 'warn' }>;
}

export default function FloatingTerminal({ logs }: FloatingTerminalProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  const defaultLogs = [
    { timestamp: "01:25:22", message: "Obsidian Pivot initialized", type: "info" },
    { timestamp: "01:26:01", message: "Material Depth [25px] Blur: OK", type: "info" },
    { timestamp: "01:27:44", message: "Nexus Core online at 100%", type: "info" },
    { timestamp: "01:29:10", message: "Wait... Design Architect not satisfied", type: "warn" },
    { timestamp: "01:30:15", message: "REBOOTING: EmpireHQ Obsidian Edition", type: "info" },
  ];

  const currentLogs = logs?.length ? logs : defaultLogs;

  return (
    <div 
      className={`fixed top-24 right-8 w-80 glass-panel shadow-[0_20px_60px_-15px_rgba(0,0,0,1)] border-white/5 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] z-[100] ${
        isMinimized ? 'h-14 translate-y-4 opacity-70 hover:opacity-100' : 'h-[420px]'
      }`}
    >
      <div className="flex items-center justify-between h-8 mb-4">
        <div className="flex items-center gap-3">
          <TerminalIcon className={`w-3 h-3 ${isMinimized ? 'text-blue-500/40' : 'text-blue-400 animate-pulse'}`} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Mercury 2.0</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMinimized(!isMinimized)} className="text-white/20 hover:text-blue-400 transition-colors">
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="h-full pt-4 border-t border-white/5 overflow-y-auto font-mono text-[10px] flex flex-col gap-2 custom-scrollbar">
          {currentLogs.map((log, i) => (
            <div key={i} className="flex gap-3 group px-1">
              <span className="text-white/10 shrink-0">[{log.timestamp}]</span>
              <span className={`break-all ${
                log.type === 'error' ? 'text-red-400' : 
                log.type === 'warn' ? 'text-amber-300' : 
                'text-emerald-400/80 group-hover:text-emerald-400 transition-colors'
              }`}>
                {log.message}
              </span>
            </div>
          ))}
          <div className="mt-auto pb-8 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-blue-500 animate-[pulse_0.8s_infinite] shadow-[0_0_8px_#3b82f6]" />
            <span className="text-white/20 italic">Vortex Stream Initializing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
