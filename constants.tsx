
import React from 'react';

export const BloomCharacter = ({ className, color = "#FFD482" }: { className?: string; color?: string }) => {
  return (
    <div className={`relative flex items-center justify-center rounded-full overflow-hidden shadow-2xl ${className}`} style={{ background: color }}>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
      <div className="absolute top-1/4 left-1/4 w-full h-full bg-white/30 blur-2xl rounded-full"></div>
      <div className="flex flex-col items-center justify-center relative z-10 scale-[0.85]">
        <div className="flex gap-6 mb-1">
          <div className="w-2 h-2 bg-black/60 rounded-full"></div>
          <div className="w-2 h-2 bg-black/60 rounded-full"></div>
        </div>
        <div className="flex gap-12 absolute -top-1">
          <div className="w-4 h-2 bg-red-400/20 blur-sm rounded-full"></div>
          <div className="w-4 h-2 bg-red-400/20 blur-sm rounded-full"></div>
        </div>
        <div className="mt-3 w-8 h-4 border-b-[4px] border-black/60 rounded-full"></div>
      </div>
    </div>
  );
};

export const CharlieCharacter = ({ className }: { className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      <img src="/logo.png" alt="Charlie" className="w-full h-full object-contain" />
    </div>
  );
};
