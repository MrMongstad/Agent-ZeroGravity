"use client";

import useSWR from 'swr';
import Header from '@/components/Header';
import MorningReportCard from '@/components/MorningReportCard';
import NeuralBus from '@/components/NeuralBus';
import SystemPulse from '@/components/SystemPulse';
import Financials from '@/components/Financials';
import NexusCore from '@/components/NexusCore';
import SpectralGraph from '@/components/SpectralGraph';
import FloatingTerminal from '@/components/FloatingTerminal';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Home() {
  // Polling every 8s as per Architect verdict
  const { data: state, error } = useSWR('/api/state', fetcher, {
    refreshInterval: 8000,
  });

  return (
    <main className="min-h-screen pb-24 relative">
      <Header 
        tasks={state?.tasks_24h || 142} 
        cost={state?.cost_24h || "$18.75"} 
      />

      <div className="dashboard-grid relative">
        {/* Obsidian Center: Morning Report & Neural Nexus */}
        <div className="span-12 flex flex-col md:flex-row gap-6">
           <div className="flex-1">
              <MorningReportCard data={state?.morning_report} />
           </div>
           <div className="w-full md:w-1/3 glass-panel border-purple-500/10 flex items-center justify-center p-0 overflow-hidden group">
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-1 z-10 bg-black/40 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                 <span className="text-[10px] font-black uppercase text-purple-400">Neural Sync Status</span>
                 <span className="text-sm font-mono tracking-tighter text-white/80">99.8% Sync Integrity</span>
              </div>
              <NexusCore />
           </div>
        </div>

        {/* Pulse Module */}
        <div className="span-4 flex flex-col gap-6">
          <SystemPulse servers={state?.mcp_status} />
        </div>

        {/* Intelligence Module */}
        <div className="span-4 flex flex-col gap-6">
          <NeuralBus tasks={state?.tasks || []} />
        </div>

        {/* Analytics & Financials */}
        <div className="span-4 flex flex-col gap-6">
          <div className="glass-panel border-blue-500/10 p-0 flex flex-col overflow-hidden">
             <div className="p-6 pb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-4">Inference Spectral Line</span>
                <Financials burnRates={state?.burn_rates} />
             </div>
             <div className="mt-auto px-6 pb-4">
                <SpectralGraph />
             </div>
          </div>
        </div>

        {/* Mercury Floating UI (Rendered fixed) */}
        <FloatingTerminal logs={state?.system_logs} />
      </div>
    </main>
  );
}
