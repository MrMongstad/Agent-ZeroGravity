/**
 * GhostOverlay Protocol
 * ──────────────────────
 * This component handles the 'Visible but Invisible' strategy.
 * 1. UI-wise: It's an invisible layer or a very subtle ghosting.
 * 2. Scraper-wise: It uses ARIA and OS window flags to ensure 
 *    the uiautomation engine skips this layer entirely.
 */
const GhostOverlay = () => {
    return (
        <div
            id="sonic-ghost-overlay"
            aria-hidden="true"
            role="none"
            className="fixed inset-0 pointer-events-none z-[9999]"
            style={{
                // Webkit / Chrome specific isolation
                WebkitAppRegion: 'none',
                // Guaranteeing no reader picks up text fragments
                userSelect: 'none'
            } as React.CSSProperties & Record<string, string>}
        >
            {/* Visual pulse indicator when scraping is active */}
            <div className="absolute inset-0 border-[4px] border-indigo-500/0 animate-[pulse_4s_infinite] transition-colors duration-1000" />
        </div>
    );
};

export default GhostOverlay;
