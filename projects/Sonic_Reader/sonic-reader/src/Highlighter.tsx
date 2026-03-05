import { useState, useEffect, useRef } from "react";
import { listen } from "@tauri-apps/api/event";

interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface HighlightPayload {
    text: string;
    rects: Rect[];
}

/**
 * Premium Overlay Highlighter
 * Renders a glowing, animated highlight over the text being read aloud.
 * Runs in a dedicated transparent, always-on-top, click-through Tauri window.
 */
export default function Highlighter() {
    const [payload, setPayload] = useState<HighlightPayload>({ text: "", rects: [] });
    const [prevPayload, setPrevPayload] = useState<HighlightPayload>({ text: "", rects: [] });
    const [isTransitioning, setIsTransitioning] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        console.log("Highlighter window initialized. Listening for 'highlight-word'...");
        const unlistenPromise = listen<HighlightPayload>("highlight-word", (event) => {
            console.log("Highlighter received event:", event.payload);
            const incoming = event.payload;

            // Trigger transition animation
            setIsTransitioning(true);
            setPrevPayload(payload);
            setPayload(incoming);

            // Clear transition state after animation completes
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = window.setTimeout(() => {
                setIsTransitioning(false);
                setPrevPayload({ text: "", rects: [] });
            }, 250);
        });

        return () => {
            unlistenPromise.then(unlisten => unlisten());
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [payload]);

    const { text, rects } = payload;

    return (
        <>
            {/* Global Styles for the Highlighter Window */}
            <style>{`
                *, *::before, *::after {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                html, body, #root {
                    background: transparent !important;
                    overflow: hidden;
                    width: 100vw;
                    height: 100vh;
                }

                @keyframes highlight-enter {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes highlight-exit {
                    from {
                        opacity: 1;
                        transform: scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: scale(1.05);
                    }
                }
            `}</style>

            {/* Exiting highlights (previous chunk) */}
            {isTransitioning && prevPayload.rects.map((pos, index) => (
                <div
                    key={`exit-${index}-${pos.x}-${pos.y}`}
                    style={{
                        position: "fixed",
                        left: pos.x - 4,
                        top: pos.y - 2,
                        width: pos.width + 8,
                        height: pos.height + 4,
                        backgroundColor: "rgba(239, 68, 68, 0.4)", // Fading red
                        borderRadius: "4px",
                        pointerEvents: "none",
                        animation: "highlight-exit 0.25s ease-out forwards",
                        zIndex: 9998,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "inherit",
                        fontFamily: "inherit",
                    }}
                >
                    {prevPayload.text}
                </div>
            ))}

            {/* Active highlights (current chunk) */}
            {rects.map((pos, index) => (
                <div
                    key={`active-${index}-${pos.x}-${pos.y}`}
                    style={{
                        position: "fixed",
                        left: pos.x - 4,
                        top: pos.y - 2,
                        width: pos.width + 8,
                        height: pos.height + 4,
                        backgroundColor: "#ef4444", // Solid Red
                        borderRadius: "4px",
                        pointerEvents: "none",
                        zIndex: 9999,
                        animation: "highlight-enter 0.1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                    }}
                >
                    <span style={{
                        color: "white",
                        fontWeight: "900",
                        fontSize: "1.1em", // Slightly larger for pop
                        whiteSpace: "nowrap",
                        fontFamily: "'Inter', sans-serif",
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}>
                        {text}
                    </span>
                </div>
            ))}

        </>
    );
}
