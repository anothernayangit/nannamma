import React from 'react';
import { Heart } from 'lucide-react';

export const HeartDivider: React.FC = () => {
  return (
    <div className="relative z-10 w-full max-w-xl mx-auto my-6 flex items-center justify-center">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-amber-200" />
      <div className="mx-4 p-2 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-600 shadow-xs flex items-center justify-center">
        <Heart className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse-slow" />
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-300 to-amber-200" />
    </div>
  );
};
