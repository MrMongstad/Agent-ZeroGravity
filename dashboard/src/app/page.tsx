"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import Header from '@/components/Header';
import MorningReportCard from '@/components/MorningReportCard';
import NeuralBus from '@/components/NeuralBus';
import SystemPulse from '@/components/SystemPulse';
import Financials from '@/components/Financials';
import MercuryTerminal from '@/components/MercuryTerminal';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Home() {
  const [terminalCollapsed, setTerminalCollapsed] = useState(true);
  
  // Polling every 8s as per Architect verdict
  const { data: state, error } = useSWR('/api/state', fetcher, {
    refreshInterval: 8000,
  });

  return (
    <main className="min-h-screen">
      <Header 
        tasks={state?.tasks_24h || 0} 
        cost={state?.cost_24h || "$0.00"} 
      />

      <div className="dashboard-grid">
        {/* Morning Report Hub */}
        <div className="span-12">
          <MorningReportCard data={state?.morning_report} />
        </div>

        {/* Pulse & Intelligence Row */}
        <div className="span-4">
          <SystemPulse servers={state?.mcp_status} />
        </div>
        <div className="span-4">
          <NeuralBus tasks={state?.tasks || []} />
        </div>
        <div className="span-4">
          <Financials burnRates={state?.burn_rates} />
        </div>

        {/* Mercury Terminal */}
        <div className="span-12">
          <MercuryTerminal 
            logs={state?.system_logs || []} 
            isCollapsed={terminalCollapsed}
            onToggle={() => setTerminalCollapsed(!terminalCollapsed)}
          />
        </div>
      </div>
    </main>
  );
}
