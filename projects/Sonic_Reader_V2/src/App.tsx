import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Play, Square, Pause, Settings, Cpu, Zap } from 'lucide-react';
import GhostOverlay from './components/GhostOverlay';

type EngineStatus = 'idle' | 'scraping' | 'reading' | 'paused' | 'error';

interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface TextChunk {
    text: string;
    rects: Rect[];
}

const App = () => {
    const [status, setStatus] = useState<EngineStatus>('idle');
    const [lastError, setLastError] = useState<string>('');
    const [chunkCount, setChunkCount] = useState(0);

    const handleScrapeAndRead = useCallback(async () => {
        try {
            setStatus('scraping');
            setLastError('');

            // 1. Scrape text at cursor position
            const chunks = await invoke<TextChunk[]>('trigger_scrape');

            if (!chunks || chunks.length === 0) {
                setStatus('idle');
                setLastError('No text found at cursor.');
                return;
            }

            setChunkCount(chunks.length);
            setStatus('reading');

            // 2. Start TTS pipeline with scraped chunks
            await invoke('start_reading', { chunks });

        } catch (err: any) {
            setStatus('error');
            setLastError(typeof err === 'string' ? err : err.message || 'Unknown error');
            console.error('[SonicV2]', err);
        }
    }, []);

    const handleStop = useCallback(async () => {
        try {
            await invoke('stop_reading');
            setStatus('idle');
            setChunkCount(0);
        } catch (err) {
            console.error('[SonicV2] Stop error:', err);
        }
    }, []);

    const handleTogglePause = useCallback(async () => {
        try {
            await invoke('toggle_pause');
            setStatus(prev => prev === 'paused' ? 'reading' : 'paused');
        } catch (err) {
            console.error('[SonicV2] Pause error:', err);
        }
    }, []);

    // Global keyboard shortcuts
    useEffect(() => {
        let lastSpaceTime = 0;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === ' ') {
                const now = Date.now();
                if (now - lastSpaceTime < 400) {
                    e.preventDefault();
                    if (status === 'idle' || status === 'error') {
                        handleScrapeAndRead();
                    } else if (status === 'reading' || status === 'paused') {
                        handleTogglePause();
                    }
                }
                lastSpaceTime = now;
            }

            if (e.key === 'Escape') {
                if (status === 'reading' || status === 'paused' || status === 'scraping') {
                    handleStop();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [status, handleScrapeAndRead, handleStop, handleTogglePause]);

    const statusConfig: Record<EngineStatus, { label: string; color: string; dotClass: string }> = {
        idle: { label: 'Ready', color: 'text-neutral-400', dotClass: 'bg-neutral-600' },
        scraping: { label: 'Extracting...', color: 'text-cyan-400', dotClass: 'bg-cyan-500 animate-pulse' },
        reading: { label: 'Reading Aloud', color: 'text-green-400', dotClass: 'bg-green-500 animate-pulse' },
        paused: { label: 'Paused', color: 'text-amber-400', dotClass: 'bg-amber-500' },
        error: { label: 'Error', color: 'text-rose-400', dotClass: 'bg-rose-500' },
    };

    const current = statusConfig[status];

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30">
            <GhostOverlay />

            {/* Ambient Background */}
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
                    <span className="text-xl font-bold tracking-tight text-white/90">
                        Sonic Reader <span className="text-indigo-500">V2</span>
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    {chunkCount > 0 && (
                        <span className="text-xs font-mono text-neutral-500 bg-neutral-900 px-3 py-1 rounded-full border border-white/5">
                            <Zap className="w-3 h-3 inline mr-1 text-amber-500" />{chunkCount} chunks
                        </span>
                    )}
                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors group">
                        <Settings className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                    </button>
                </div>
            </nav>

            {/* Main */}
            <main className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-88px)] px-6">
                <div className="w-full max-w-md p-8 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-xl shadow-2xl">
                    <div className="text-center mb-10">
                        <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-[0.2em] mb-2">
                            Engine Isolation Active
                        </h2>
                        <p className="text-lg text-neutral-300 font-light">Sonic V2 — Phase 2</p>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex justify-center gap-6 mb-10">
                        {status === 'idle' || status === 'error' ? (
                            <button
                                onClick={handleScrapeAndRead}
                                className="w-20 h-20 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 active:scale-95 transition-all duration-300 group"
                            >
                                <Play className="w-8 h-8 fill-current translate-x-1 group-hover:scale-110 transition-transform" />
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleTogglePause}
                                    className="w-16 h-16 flex items-center justify-center rounded-full bg-amber-600 hover:bg-amber-500 text-white shadow-xl active:scale-95 transition-all duration-300"
                                >
                                    <Pause className="w-6 h-6 fill-current" />
                                </button>
                                <button
                                    onClick={handleStop}
                                    className="w-16 h-16 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-white text-neutral-950 shadow-xl active:scale-95 transition-all duration-300"
                                >
                                    <Square className="w-6 h-6 fill-current" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Status Bar */}
                    <div className="space-y-3">
                        <div className="px-5 py-4 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-between">
                            <span className="text-sm text-neutral-400">Status</span>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${current.dotClass}`} />
                                <span className={`text-sm font-medium ${current.color}`}>{current.label}</span>
                            </div>
                        </div>

                        {lastError && (
                            <div className="px-5 py-3 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-sm text-rose-400">
                                {lastError}
                            </div>
                        )}
                    </div>
                </div>

                <p className="mt-8 text-sm text-neutral-600 font-light">
                    <kbd className="px-2 py-1 rounded bg-neutral-900 border border-white/5 text-neutral-400">Double Space</kbd> to read ·
                    <kbd className="px-2 py-1 rounded bg-neutral-900 border border-white/5 text-neutral-400 ml-1">Esc</kbd> to stop
                </p>
            </main>
        </div>
    );
};

export default App;
