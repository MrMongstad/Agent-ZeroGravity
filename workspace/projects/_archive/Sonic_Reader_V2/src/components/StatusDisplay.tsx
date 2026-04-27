import { EngineStatus } from '../types';

interface StatusDisplayProps {
    status: EngineStatus;
    countdown: number | null;
    lastError: string;
    modelWarning?: string;
}

const StatusDisplay = ({ status, countdown, lastError, modelWarning }: StatusDisplayProps) => {
    const statusConfig: Record<EngineStatus, { label: string; color: string; dotClass: string }> = {
        idle:     { label: 'Ready',         color: 'text-emerald-400', dotClass: 'bg-emerald-500' },
        scraping: { label: 'Extracting...', color: 'text-cyan-400',    dotClass: 'bg-cyan-500 animate-pulse-gpu' },
        reading:  { label: 'Reading...',    color: 'text-amber-400',   dotClass: 'bg-amber-400 animate-pulse-gpu' },
        paused:   { label: 'Paused',        color: 'text-amber-400',   dotClass: 'bg-amber-500' },
        error:    { label: 'Failed',        color: 'text-rose-400',    dotClass: 'bg-rose-500' },
    };

    const current = statusConfig[status];

    return (
        <div className="space-y-3">
            <div className="px-5 py-4 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-between">
                <span className="text-sm text-neutral-400">Status</span>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${current.dotClass}`} />
                    <span className={`text-sm font-medium ${current.color}`}>
                        {countdown !== null ? `Move cursor… ${countdown}` : current.label}
                    </span>
                </div>
            </div>

            {lastError && (
                <div className="px-5 py-3 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-sm text-rose-400">
                    {lastError}
                </div>
            )}

            {modelWarning && (
                <div className="px-5 py-3 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-sm text-amber-400 flex items-center gap-2">
                    <span className="text-amber-500">⚠</span>
                    {modelWarning}
                </div>
            )}
        </div>
    );
};

export default StatusDisplay;
