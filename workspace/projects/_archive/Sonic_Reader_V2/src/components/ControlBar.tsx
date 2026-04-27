import { Cpu, Zap, Settings } from 'lucide-react';

interface ControlBarProps {
    chunkCount: number;
    onOpenSettings: () => void;
}

const ControlBar = ({ chunkCount, onOpenSettings }: ControlBarProps) => {
    return (
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
                <button onClick={onOpenSettings} className="p-2 hover:bg-white/5 rounded-full transition-colors group">
                    <Settings className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                </button>
            </div>
        </nav>
    );
};

export default ControlBar;
