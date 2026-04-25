import { useState } from 'react';
import { X, Volume2, Gauge } from 'lucide-react';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
    const [voiceModel, setVoiceModel] = useState('en_US-lessac-high.onnx');
    const [speed, setSpeed] = useState(1.0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative w-full max-w-md mx-4 p-8 rounded-3xl bg-neutral-900/95 border border-white/5 backdrop-blur-xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-semibold text-white">Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-neutral-400" />
                    </button>
                </div>

                {/* Voice Model */}
                <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-400 mb-3">
                        <Volume2 className="w-4 h-4" /> Voice Model
                    </label>
                    <select
                        id="voice-model-select"
                        name="voice-model"
                        value={voiceModel}
                        onChange={(e) => setVoiceModel(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 text-neutral-200 text-sm font-mono focus:border-indigo-500/50 focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                        <option value="en_US-lessac-high.onnx">Lessac (High Quality)</option>
                        <option value="en_US-lessac-medium.onnx">Lessac (Medium)</option>
                        <option value="en_US-amy-medium.onnx">Amy (Medium)</option>
                        <option value="en_US-ryan-high.onnx">Ryan (High Quality)</option>
                    </select>
                </div>

                {/* Speed */}
                <div className="mb-8">
                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-400 mb-3">
                        <Gauge className="w-4 h-4" /> Reading Speed
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            id="speed-range-input"
                            name="reading-speed"
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={speed}
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                            className="flex-1 h-1.5 rounded-full appearance-none bg-neutral-800 accent-indigo-500 cursor-pointer"
                        />
                        <span className="text-sm font-mono text-indigo-400 w-12 text-right">{speed.toFixed(1)}x</span>
                    </div>
                </div>

                {/* Engine Info */}
                <div className="px-5 py-4 rounded-2xl bg-black/30 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-neutral-500 uppercase tracking-wider">Engine</span>
                        <span className="text-xs font-mono text-emerald-500">Piper TTS</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-neutral-500 uppercase tracking-wider">Scraper</span>
                        <span className="text-xs font-mono text-cyan-500">UIAutomation V2</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-500 uppercase tracking-wider">Sanitizer</span>
                        <span className="text-xs font-mono text-amber-500">5-Stage Pipeline</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
