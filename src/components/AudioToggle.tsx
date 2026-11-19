import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { toggleMute, getMuteState } from '../utils/sound';

export const AudioToggle: React.FC = () => {
  const [muted, setMuted] = useState<boolean>(getMuteState());

  const handleToggle = () => {
    const next = toggleMute();
    setMuted(next);
  };

  return (
    <button
      onClick={handleToggle}
      type="button"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-rose-700 bg-rose-100/70 hover:bg-rose-200/80 transition-all border border-rose-200 shadow-sm backdrop-blur-sm"
      title={muted ? 'Unmute sounds' : 'Mute romantic sounds'}
      aria-label={muted ? 'Unmute romantic sounds' : 'Mute romantic sounds'}
    >
      {muted ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-rose-500" />
          <span>Sound Off</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          <span>Sound On</span>
        </>
      )}
    </button>
  );
};
