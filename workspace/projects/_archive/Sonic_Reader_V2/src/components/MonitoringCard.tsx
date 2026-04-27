import { ClipboardCheck, Clipboard } from 'lucide-react';

interface MonitoringCardProps {
    clipMonitor: boolean;
    onToggle: () => void;
}

const MonitoringCard = ({ clipMonitor, onToggle }: MonitoringCardProps) => {
    return (
        <div className="mt-6">
            <button
                onClick={onToggle}
                className={`w-full px-5 py-4 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
                    clipMonitor
                        ? 'bg-emerald-950/40 border-emerald-500/30 hover:bg-emerald-950/60'
                        : 'bg-black/30 border-white/5 hover:bg-white/5'
                }`}
            >
                <div className="flex items-center gap-3">
                    {clipMonitor ? (
                        <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                    ) : (
                        <Clipboard className="w-5 h-5 text-neutral-500" />
                    )}
                    <div className="text-left">
                        <span className={`text-sm font-medium block ${clipMonitor ? 'text-emerald-400' : 'text-neutral-300'}`}>
                            Clipboard Monitor
                        </span>
                        <span className="text-xs text-neutral-500">
                            {clipMonitor ? 'Listening for Ctrl+C...' : 'Auto-read copied text'}
                        </span>
                    </div>
                </div>
                <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${
                    clipMonitor ? 'bg-emerald-500' : 'bg-neutral-700'
                }`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
                        clipMonitor ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                </div>
            </button>
        </div>
    );
};

export default MonitoringCard;
