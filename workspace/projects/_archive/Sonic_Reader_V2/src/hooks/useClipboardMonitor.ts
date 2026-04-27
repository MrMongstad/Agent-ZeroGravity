import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { EngineStatus } from '../types';

export function useClipboardMonitor(
    setStatus: (status: EngineStatus) => void,
    setChunkCount: (count: number) => void
) {
    const [clipMonitor, setClipMonitor] = useState(false);

    // Sync clipboard monitor state from backend on mount
    useEffect(() => {
        invoke<boolean>('get_clipboard_monitor_status').then(setClipMonitor).catch(console.error);

        const unlisten1 = listen<boolean>('clipboard-monitor-status', (event) => {
            setClipMonitor(event.payload);
        });
        const unlisten2 = listen<number>('clipboard-text-detected', (event) => {
            setStatus('reading');
            setChunkCount(1);
        });

        return () => {
            unlisten1.then(fn => fn());
            unlisten2.then(fn => fn());
        };
    }, [setStatus, setChunkCount]);

    const handleToggleClipboard = useCallback(async () => {
        try {
            if (clipMonitor) {
                await invoke('stop_clipboard_monitor');
                setClipMonitor(false);
            } else {
                await invoke('start_clipboard_monitor');
                setClipMonitor(true);
            }
        } catch (err) {
            console.error('[SonicV2] Clipboard monitor error:', err);
        }
    }, [clipMonitor]);

    return {
        clipMonitor,
        handleToggleClipboard,
    };
}
