
import React, { useState, useEffect } from 'react';
import { X, Music, Wind, Droplets } from '../lib/icons';
import { Action } from '../types';

interface RoutineProps {
  actions: Action[];
  onComplete: (actions: Action[]) => void;
  onClose: () => void;
}

export const Routine: React.FC<RoutineProps> = ({ actions: initialActions, onComplete, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const currentAction = initialActions[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return (
      <span className="text-4xl font-serif text-[#1A1A1A]">
        {mins} <span className="text-lg opacity-30">min</span> {secs} <span className="text-lg opacity-30">s</span>
      </span>
    );
  };

  const handleNext = () => {
    if (currentIndex === initialActions.length - 1) {
      onComplete(initialActions.map(a => ({ ...a, completed: true })));
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#E6DCCF] flex flex-col items-center p-8 animate-in slide-in-from-bottom duration-500 font-sans">
      <header className="w-full flex justify-between items-center mb-12">
         <button onClick={onClose} className="p-3 bg-white rounded-full shadow-sm"><X className="w-5 h-5 text-slate-400" /></button>
         <h2 className="text-xl font-serif tracking-tight">{currentAction.text}</h2>
         <div className="w-10"></div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <div className="relative w-64 h-64">
           <div className="absolute inset-0 bg-white/40 blur-3xl rounded-full animate-pulse"></div>
           <div className="w-48 h-48 mx-auto bg-[#FFB352] rounded-full border-4 border-white shadow-2xl flex flex-col items-center justify-center p-4 relative z-10">
               <div className="flex gap-10">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
               </div>
               <div className="mt-4 w-12 h-6 border-b-4 border-white rounded-full"></div>
           </div>
        </div>

        <div className="text-center space-y-2">
           {formatTime(timer)}
           <p className="text-[10px] font-black uppercase text-black/30 tracking-widest mt-4">Focusing on your bloom</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
           {[
             { label: 'Ambient sounds active', icon: Music },
             { label: 'Rhythmic breathing cycle', icon: Wind },
             { label: 'Stay hydrated', icon: Droplets }
           ].map((tip, i) => (
             <div key={i} className="bg-white/60 backdrop-blur-md p-5 rounded-[2rem] border border-black/5 flex items-center gap-4 text-sm font-bold shadow-sm">
                <tip.icon className="w-5 h-5 text-[#FFB352]" />
                {tip.label}
             </div>
           ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="mt-12 w-full max-w-sm bg-[#1A1A1A] text-white font-black py-6 rounded-full shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-widest"
      >
        {currentIndex === initialActions.length - 1 ? 'Finish Routine' : 'Next Step'}
      </button>
    </div>
  );
};
