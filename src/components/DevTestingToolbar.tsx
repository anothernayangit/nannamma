import React, { useState } from 'react';
import { Sliders, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface DevTestingToolbarProps {
  onSetCount: (count: number) => Promise<void>;
}

export const DevTestingToolbar: React.FC<DevTestingToolbarProps> = ({ onSetCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePreset = async (target: number) => {
    try {
      setLoading(true);
      await onSetCount(target);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-20 w-full max-w-xl mx-auto my-4 text-xs">
      <div className="bg-white/80 backdrop-blur-md border border-emerald-200/90 rounded-2xl p-3 shadow-xs">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between font-semibold text-emerald-900 hover:text-emerald-950 cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-600" />
            <span>Developer Test Presets (Every 10th Milestone)</span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isOpen && (
          <div className="mt-3 pt-3 border-t border-emerald-100 flex flex-wrap gap-2 animate-fadeIn">
            <button
              disabled={loading}
              onClick={() => handlePreset(9)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-medium transition cursor-pointer"
            >
              Set Count to 9 (Test +1 to 10)
            </button>
            <button
              disabled={loading}
              onClick={() => handlePreset(19)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-medium transition cursor-pointer"
            >
              Set Count to 19 (Test +1 to 20)
            </button>
            <button
              disabled={loading}
              onClick={() => handlePreset(28)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-medium transition cursor-pointer"
            >
              Set Count to 28 (Test +2 to 30)
            </button>
            <button
              disabled={loading}
              onClick={() => handlePreset(79)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-medium transition cursor-pointer"
            >
              Set Count to 79 (Test +1 to 80)
            </button>
            <button
              disabled={loading}
              onClick={() => handlePreset(89)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-medium transition cursor-pointer"
            >
              Set Count to 89 (Test +1 to 90 randomised)
            </button>
            <button
              disabled={loading}
              onClick={() => handlePreset(0)}
              className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-700 font-medium transition flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset to 0</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
