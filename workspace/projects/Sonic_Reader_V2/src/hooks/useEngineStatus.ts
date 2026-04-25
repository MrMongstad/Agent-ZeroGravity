import { useState, useCallback, useRef, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { EngineStatus, TextChunk } from '../types';

export function useEngineStatus() {
    const [status, setStatus] = useState<EngineStatus>('idle');
    const [lastError, setLastError] = useState<string>('');
    const [chunkCount, setChunkCount] = useState(0);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [modelWarning, setModelWarning] = useState<string>('');
    const abortRef = useRef<AbortController | null>(null);

    // Listen for backend engine events (model fallback, fatal errors)
    useEffect(() => {
        const unlistenFallback = listen<{ requested: string; resolved: string }>(
            'tts:model_fallback',
            (event) => {
                setModelWarning(
                    `Model "${event.payload.requested}" not found — using "${event.payload.resolved}"`
                );
                // Auto-clear after 8 seconds
                setTimeout(() => setModelWarning(''), 8000);
            }
        );

        const unlistenError = listen<{ message: string }>(
            'tts:engine_error',
            (event) => {
                setStatus('error');
                setLastError(event.payload.message);
            }
        );

        return () => {
            unlistenFallback.then(f => f());
            unlistenError.then(f => f());
        };
    }, []);

    const handleScrapeAndRead = useCallback(async () => {
        // Cancel any in-flight countdown/scrape from a previous trigger
        if (abortRef.current) {
            abortRef.current.abort();
        }
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            setLastError('');

            // 3-second countdown so user can move cursor to target text
            for (let i = 3; i > 0; i--) {
                if (controller.signal.aborted) return;
                setCountdown(i);
                setStatus('scraping');
                await new Promise<void>((resolve, reject) => {
                    const timer = setTimeout(resolve, 1000);
                    controller.signal.addEventListener('abort', () => {
                        clearTimeout(timer);
                        reject(new DOMException('Aborted', 'AbortError'));
                    }, { once: true });
                });
            }
            if (controller.signal.aborted) return;
            setCountdown(null);

            // 1. Scrape text at cursor position
            const chunks = await invoke<TextChunk[]>('trigger_scrape');

            if (controller.signal.aborted) return;
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
            // Silently swallow abort errors — they're intentional cancellations
            if (err?.name === 'AbortError' || controller.signal.aborted) {
                return;
            }
            setCountdown(null);
            setStatus('error');
            const raw = typeof err === 'string' ? err : err.message || 'Unknown error';
            const msg = raw.includes('Legacy Window') || raw.includes('No readable text')
                ? 'No readable text found. Use Clipboard Monitor — Ctrl+C any text to read it.'
                : raw;
            setLastError(msg);
            console.error('[SonicV2]', err);
        }
    }, []);

    const handleStop = useCallback(async () => {
        // Abort any in-flight countdown before stopping TTS
        if (abortRef.current) {
            abortRef.current.abort();
            abortRef.current = null;
        }
        try {
            setCountdown(null);
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

    return {
        status,
        setStatus,
        lastError,
        chunkCount,
        setChunkCount,
        countdown,
        modelWarning,
        handleScrapeAndRead,
        handleStop,
        handleTogglePause,
    };
}
