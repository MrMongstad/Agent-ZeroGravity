"use client";

import React, { useEffect, useRef } from 'react';
import { Terminal, ChevronDown, ChevronUp, Command, Terminal as TerminalIcon } from 'lucide-react';

interface MercuryTerminalProps {
  logs?: Array<{ timestamp: string; message: string; type: 'info' | 'error' | 'warn' }>;
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function MercuryTerminal({ logs, isCollapsed, onToggle }: MercuryTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (terminalRef.current && !isCollapsed) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, isCollapsed]);

  const defaultLogs = [
    { timestamp: "01:14:22", message: "Gag Bus Initialized", type: "info" },
    { timestamp: "01:15:02", message: "Claude-Code Handshake: SUCCESS", type: "info" },
    { timestamp: "01:16:44", message: "Neural Bus state synced (8502)", type: "info" },
    { timestamp: "01:17:10", message: "Structural Pivot: PHASE 1 START", type: "warn" },
  ];

  const displayLogs = logs?.length ? logs : defaultLogs;

  return (
    <div className={`glass-panel overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isCollapsed ? 'max-h-[64px]' : 'max-h-[400px]'}`}>
      <div 
        className="flex items-center justify-between cursor-pointer group"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <TerminalIcon className={`w-4 h-4 transition-colors ${isCollapsed ? 'text-white/20' : 'text-blue-500'}`} />
          <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">Mercury Terminal Overlay</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-mono text-white/10 uppercase tracking-tighter">Live Debug Stream</span>
          {isCollapsed ? <ChevronUp className="w-4 h-4 text-white/20" /> : <ChevronDown className="w-4 h-4 text-white/20" />}
        </div>
      </div>

      {!isCollapsed && (
        <div 
          ref={terminalRef}
          className="mt-6 border-t border-white/5 pt-6 flex flex-col gap-2 font-mono text-[11px] overflow-y-auto max-h-[300px] pr-4 custom-scrollbar"
        >
          {displayLogs.map((log, index) => (
            <div key={index} className="flex gap-4 group">
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
          <div className="flex gap-4 mt-2">
             <span className="text-blue-500 animate-pulse">_</span>
             <div className="flex items-center gap-2">
                <Command className="w-3 h-3 text-white/10" />
                <span className="text-white/20">Listening for vortex signals...</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
