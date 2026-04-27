// useGlobalHotkeys.ts — System-wide keyboard shortcuts via Tauri plugin
// Replaces the window.addEventListener approach that fails when app loses focus.

import { useEffect, useRef } from 'react';
import { register, unregisterAll } from '@tauri-apps/plugin-global-shortcut';

type EngineStatus = 'idle' | 'scraping' | 'reading' | 'paused' | 'error';

interface UseGlobalHotkeysOptions {
    status: EngineStatus;
    onScrapeAndRead: () => void;
    onTogglePause: () => void;
    onStop: () => void;
}

/**
 * Registers OS-level global shortcuts that persist across focus changes.
 * 
 * Bindings:
 * - Ctrl+Shift+Space → scrape/read (when idle/error) or pause/resume (when active)
 * - Ctrl+Shift+Escape → stop reading
 * 
 * Note: We use Ctrl+Shift modifiers because bare Space/Escape would conflict
 * with every other app on the system. The old double-space approach was elegant
 * but only worked inside the webview. This is the compromise that actually ships.
 */
export function useGlobalHotkeys({
    status,
    onScrapeAndRead,
    onTogglePause,
    onStop,
}: UseGlobalHotkeysOptions) {
    // Use refs to always have the latest callbacks without re-registering
    const statusRef = useRef(status);
    const onScrapeRef = useRef(onScrapeAndRead);
    const onPauseRef = useRef(onTogglePause);
    const onStopRef = useRef(onStop);

    // Keep refs fresh
    useEffect(() => {
        statusRef.current = status;
        onScrapeRef.current = onScrapeAndRead;
        onPauseRef.current = onTogglePause;
        onStopRef.current = onStop;
    }, [status, onScrapeAndRead, onTogglePause, onStop]);

    useEffect(() => {
        let mounted = true;

        const setupShortcuts = async () => {
            try {
                // Clean slate
                await unregisterAll();

                // Ctrl+Shift+Space → Read or Pause
                await register('CmdOrCtrl+Shift+Space', () => {
                    if (!mounted) return;
                    const s = statusRef.current;
                    if (s === 'idle' || s === 'error') {
                        onScrapeRef.current();
                    } else if (s === 'reading' || s === 'paused') {
                        onPauseRef.current();
                    }
                });

                // Ctrl+Shift+Escape → Stop
                await register('CmdOrCtrl+Shift+Escape', () => {
                    if (!mounted) return;
                    const s = statusRef.current;
                    if (s === 'reading' || s === 'paused' || s === 'scraping') {
                        onStopRef.current();
                    }
                });

                console.log('[SonicV2] Global shortcuts registered: Ctrl+Shift+Space, Ctrl+Shift+Escape');
            } catch (err) {
                console.error('[SonicV2] Failed to register global shortcuts:', err);
            }
        };

        setupShortcuts();

        return () => {
            mounted = false;
            unregisterAll().catch(console.error);
        };
    }, []); // Register once, use refs for state
}
