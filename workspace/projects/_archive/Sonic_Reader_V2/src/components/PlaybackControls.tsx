import { Play, Pause, Square } from 'lucide-react';
import { EngineStatus } from '../types';

interface PlaybackControlsProps {
    status: EngineStatus;
    onPlay: () => void;
    onPause: () => void;
    onStop: () => void;
}

const PlaybackControls = ({ status, onPlay, onPause, onStop }: PlaybackControlsProps) => {
    return (
        <div className="flex justify-center gap-6 mb-10">
            {status === 'idle' || status === 'error' ? (
                <button
                    onClick={onPlay}
                    className="w-20 h-20 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 active:scale-95 transition-all duration-300 group"
                >
                    <Play className="w-8 h-8 fill-current translate-x-1 group-hover:scale-110 transition-transform" />
                </button>
            ) : (
                <>
                    <button
                        onClick={onPause}
                        className="w-16 h-16 flex items-center justify-center rounded-full bg-amber-600 hover:bg-amber-500 text-white shadow-xl active:scale-95 transition-all duration-300"
                    >
                        <Pause className="w-6 h-6 fill-current" />
                    </button>
                    <button
                        onClick={onStop}
                        className="w-16 h-16 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-white text-neutral-950 shadow-xl active:scale-95 transition-all duration-300"
                    >
                        <Square className="w-6 h-6 fill-current" />
                    </button>
                </>
            )}
        </div>
    );
};

export default PlaybackControls;
