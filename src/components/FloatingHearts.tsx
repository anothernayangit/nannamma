import React, { useMemo } from 'react';

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  char: string;
}

export const FloatingHearts: React.FC = () => {
  const particles = useMemo<Particle[]>(() => {
    const chars = ['💍', '✨', '💛', '💎', '🌿', '⭐', '🤍'];
    return Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      left: Math.random() * 95,
      top: Math.random() * 90,
      size: Math.random() * 16 + 12,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.45 + 0.2,
      char: chars[Math.floor(Math.random() * chars.length)],
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute select-none animate-float-slow"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            filter: 'drop-shadow(0 2px 4px rgba(16,185,129,0.15))',
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
};
