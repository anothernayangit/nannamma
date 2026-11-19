import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Music, Volume2, VolumeX } from 'lucide-react';

export const BackgroundMusic: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.65;
    audio.loop = true;

    // Browser policy: start playback on first user interaction anywhere on the screen
    const handleFirstInteraction = () => {
      if (!userInteracted && audio) {
        audio.play().then(() => {
          setIsPlaying(true);
          setUserInteracted(true);
        }).catch((err) => {
          console.warn('Autoplay prevented on first interaction:', err);
        });
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [userInteracted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setUserInteracted(true);

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error('Audio play failed:', err);
      });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 animate-fadeIn">
      <audio
        ref={audioRef}
        src="/mujhse-shaadi-karogi.mp3"
        preload="auto"
      />

      <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-amber-400/40 shadow-xl shadow-emerald-950/30 text-white transition-all hover:border-amber-400/80">
        {/* Animated Disc / Music Note Icon */}
        <div className="relative flex items-center justify-center">
          <div
            className={`w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-600 flex items-center justify-center shadow-md ${
              isPlaying ? 'animate-spin-slow' : ''
            }`}
          >
            <Music className="w-4 h-4 text-white" />
          </div>
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
          )}
        </div>

        {/* Track Title */}
        <div className="hidden sm:flex flex-col text-left pr-1">
          <span className="text-[11px] font-semibold text-amber-300 tracking-wide flex items-center gap-1">
            <span>Mujhse Shaadi Karogi</span>
            {isPlaying && (
              <span className="flex items-end gap-0.5 h-3 ml-1">
                <span className="w-0.5 h-2 bg-amber-400 animate-pulse"></span>
                <span className="w-0.5 h-3 bg-amber-300 animate-bounce"></span>
                <span className="w-0.5 h-1.5 bg-amber-400 animate-pulse"></span>
              </span>
            )}
          </span>
          <span className="text-[10px] text-slate-300">
            {isPlaying ? 'Playing Romantic Track 🎵' : 'Click to Play Song'}
          </span>
        </div>

        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          data-testid="audio-play-button"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          className="p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 active:scale-95 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-amber-300" />}
        </button>

        {/* Mute Button */}
        <button
          type="button"
          onClick={toggleMute}
          data-testid="audio-mute-button"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          className="p-1.5 rounded-xl hover:bg-white/10 active:scale-95 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
