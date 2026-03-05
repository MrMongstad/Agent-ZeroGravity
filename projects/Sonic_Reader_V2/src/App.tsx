import React, { useEffect, useState } from 'react';
import { Play, Square, Settings, Cpu } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';

const App: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'reading' | 'error'>('idle');
    const [engineLabel, setEngineLabel] = useState('Sonic V2 Engine');

    useEffect(() => {
        invoke<string>('greet', { name: 'Stephan' })
            .then(setEngineLabel)
            .catch(console.error);
    }, []);

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30">
            {/* Background Micro-Animations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/20 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Cpu className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white/90">Sonic Reader <span className="text-indigo-500">V2</span></span>
                </div>
                <div className="flex gap-4">
                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors group">
                        <Settings className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                    </button>
                </div>
            </nav>

            {/* Main UI */}
            <main className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-88px)] px-6">
                <div className="w-full max-w-md p-8 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-xl shadow-2xl">
                    <div className="text-center mb-10">
                        <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-[0.2em] mb-2">Engine Isolation Active</h2>
                        <p className="text-lg text-neutral-300 font-light">{engineLabel}</p>
                    </div>

                    <div className="flex justify-center gap-8 mb-10">
                        {status !== 'reading' ? (
                            <button
                                onClick={() => setStatus('reading')}
                                className="w-20 h-20 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 active:scale-95 transition-all duration-300 group"
                            >
                                <Play className="w-8 h-8 fill-current translate-x-1 group-hover:scale-110 transition-transform" />
                            </button>
                        ) : (
                            <button
                                onClick={() => setStatus('idle')}
                                className="w-20 h-20 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-white text-neutral-950 shadow-xl active:scale-95 transition-all duration-300 group"
                            >
                                <Square className="w-8 h-8 fill-current group-hover:scale-110 transition-transform" />
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="px-5 py-4 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-between">
                            <span className="text-sm text-neutral-400">Status</span>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${status === 'reading' ? 'bg-green-500 animate-pulse' : 'bg-neutral-600'}`} />
                                <span className={`text-sm font-medium ${status === 'reading' ? 'text-green-500' : 'text-neutral-400'}`}>
                                    {status === 'reading' ? 'Extracting Text...' : 'Ready'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-sm text-neutral-600 font-light">
                    Press <kbd className="px-2 py-1 rounded bg-neutral-900 border border-white/5 text-neutral-400">Double Space</kbd> to trigger extraction.
                </p>
            </main>
        </div>
    );
};

export default App;
