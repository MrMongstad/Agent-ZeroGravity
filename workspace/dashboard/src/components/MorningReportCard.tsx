"use client";

import React from 'react';
import { Newspaper, ChevronRight, Activity, Cpu } from 'lucide-react';
import { marked } from 'marked';

interface MorningReportCardProps {
  data?: {
    summary?: string;
    mission_status?: string;
    insights?: string[];
  };
}

export default function MorningReportCard({ data }: MorningReportCardProps) {
  // Mock data for initial dev if state is empty
  const defaultSummary = "# Executive Summary\n- **Claude-Code Integration**: Active and polling.\n- **Vortex Status**: All systems optimized.\n- **Today's Mission**: Building the command center.";

  const summaryHtml = marked.parse(data?.summary || defaultSummary);

  return (
    <div className="glass-panel w-full border-blue-500/20 shadow-blue-900/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Newspaper className="w-5 h-5 text-blue-500" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/50">Morning Report Hub</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
          <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase">Mission Active</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 border-r border-white/5 pr-8">
          <div 
            className="prose prose-invert max-w-none prose-sm text-white/70"
            dangerouslySetInnerHTML={{ __html: summaryHtml }}
          />
        </div>

        <div className="col-span-4 flex flex-col gap-6">
          <div>
            <span className="text-[10px] uppercase text-white/30 font-bold block mb-3">Strategic Intelligence</span>
            <ul className="flex flex-col gap-3">
              {(data?.insights || ["Optimize vortex throughput", "Audit multi-agent handshakes", "Finalize EmpireHQ dashboard"]).map((insight, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                  <ChevronRight className="w-3 h-3 text-blue-500 mt-1" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
             <button className="w-full flex items-center justify-between px-4 py-3 bg-blue-600 hover:bg-blue-500 transition-colors rounded-lg font-bold text-xs uppercase tracking-widest">
                <span>Execute Mission</span>
                <Cpu className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
