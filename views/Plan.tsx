import React, { useState } from 'react';
import { Plus, X, Lock, Circle, Zap, ArrowRight, Calendar, SparklesBold as Sparkles } from '../lib/icons';
import { DogBuddy } from '../components/DogBuddy';

interface PlanProps {
  user: any;
  planEvents: any[];
  onUpdatePlan: (events: any[]) => void;
}

export const Plan: React.FC<PlanProps> = ({ user, planEvents = [], onUpdatePlan }) => {
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', type: 'mission' });
  const [isAdding, setIsAdding] = useState(false);
  const [isLocked, setIsLocked] = useState(() => {
    const saved = localStorage.getItem('plan_locked_today');
    const date = localStorage.getItem('plan_locked_date');
    const today = new Date().toISOString().split('T')[0];
    return saved === 'true' && date === today;
  });

  const handleLockPlan = () => {
    if (planEvents.length === 0) return;
    setIsLocked(true);
    localStorage.setItem('plan_locked_today', 'true');
    localStorage.setItem('plan_locked_date', new Date().toISOString().split('T')[0]);
  };

  const hours = Array.from({ length: 14 }, (_, i) => i + 6); // 6am to 8pm
  const events = planEvents;

  const handleAddStringEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.start) return;
    onUpdatePlan([...events, { ...newEvent, id: Date.now().toString(), completed: false, type: newEvent.type.toUpperCase() }]);
    setNewEvent({ title: '', start: '', end: '', type: 'mission' });
    setIsAdding(false);
  }

  const completedCount = planEvents.filter(e => e.completed).length;
  const totalCount = planEvents.length;
  const momentum = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const firstUncompletedId = planEvents.find(e => !e.completed)?.id;

  const handleCompleteDay = () => {
    window.location.hash = '/';
    localStorage.setItem('trigger_overview', 'true');
  };

  return (
    <div className="min-h-screen p-6 pb-32 max-w-2xl mx-auto space-y-12 animate-fade-in font-sans">
      {/* Header */}
      <header className="pt-8 flex flex-col items-center text-center space-y-6">
        <DogBuddy mood={momentum === 100 ? 'excited' : 'happy'} size={140} className="drop-shadow-xl" />
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="space-y-1">
            <h1 className="text-4xl font-serif text-[var(--text-primary)]">Flight Path</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500/40">Your daily orbit is calculated.</p>
          </div>

          {!isLocked && planEvents.length > 0 && (
            <button
              onClick={handleLockPlan}
              className="px-8 py-3 bg-blue-500 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all active:scale-95"
            >
              Lock Orbit
            </button>
          )}
          {isLocked && (
            <div className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Target Lock: Active
            </div>
          )}
        </div>

        {/* Orbit Momentum */}
        {isLocked && totalCount > 0 && (
          <div className="w-full space-y-4 pt-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex justify-between items-end px-2">
              <div className="text-left space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">Daily Trajectory</span>
                <p className="text-xl font-serif text-[var(--text-primary)]">Orbit Stability</p>
              </div>
              <span className="text-4xl font-serif text-blue-500">{Math.round(momentum)}%</span>
            </div>
            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden shadow-inner p-0.5">
              <div
                className="h-full bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${momentum}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Timeline */}
      <div className="space-y-1 relative">
        <div className="absolute left-[2.25rem] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-100 to-transparent" />

        {hours.map(hour => {
          const timeString = `${hour.toString().padStart(2, '0')}:00`;
          const event = events.find(e => e.start === timeString);
          const isActive = event && event.id === firstUncompletedId;

          return (
            <div key={hour} className="group flex items-center py-5 transition-all relative">
              <div className="w-16 text-[10px] font-bold text-gray-300 font-mono tabular-nums">
                {timeString}
              </div>

              <div className="flex-1 min-h-[3rem] ml-4">
                {event ? (
                  <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${event.completed ? 'bg-gray-50/50 border-transparent opacity-60' : isActive ? 'bg-white border-blue-100 shadow-xl shadow-blue-500/5 -translate-y-0.5' : 'bg-white border-gray-50 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          const newEvents = planEvents.map(e =>
                            e.id === event.id ? { ...e, completed: !e.completed } : e
                          );
                          onUpdatePlan(newEvents);
                        }}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${event.completed ? 'bg-emerald-500 text-white' : isActive ? 'bg-blue-50 text-blue-500 ring-4 ring-blue-500/5' : 'bg-gray-50 text-gray-300 hover:bg-gray-100'}`}
                      >
                        {event.completed ? <Check size={14} /> : isActive ? <Zap size={14} className="animate-pulse" /> : <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />}
                      </button>
                      <div className="space-y-0.5">
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${event.completed ? 'text-gray-300' : 'text-blue-500/40'}`}>{event.type}</span>
                        <h4 className={`text-lg font-serif ${event.completed ? 'text-gray-400 line-through' : 'text-[var(--text-primary)]'}`}>{event.title}</h4>
                      </div>
                    </div>

                    {!isLocked && (
                      <button
                        onClick={() => onUpdatePlan(planEvents.filter(e => e.id !== event.id))}
                        className="p-2 text-gray-100 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ) : !isLocked ? (
                  <button
                    onClick={() => {
                      setNewEvent({ ...newEvent, start: timeString });
                      setIsAdding(true);
                    }}
                    className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-200 hover:border-blue-100 hover:text-blue-500 transition-all"
                  >
                    <Plus size={14} /> Assign Mission
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl border border-dotted border-gray-50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center opacity-20">
                      <Sparkles size={14} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-100 italic">Clear Orbit Segment</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Done with my Day Button */}
      {isLocked && (
        <div className="pt-12 pb-24 border-t border-gray-50">
          <button
            onClick={handleCompleteDay}
            className={`w-full py-8 rounded-[3rem] transition-all duration-700 group relative overflow-hidden flex items-center justify-center gap-6 shadow-2xl active:scale-[0.98]
              ${momentum === 100
                ? 'bg-black text-white'
                : 'bg-white border border-gray-100 text-black hover:bg-black hover:text-white'}`}
          >
            <div className="flex flex-col items-start text-left">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Flight Conclusion</span>
              <span className="text-2xl font-serif">Secure Flight Path</span>
            </div>
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />

            {momentum === 100 && (
              <div className="absolute top-4 right-8">
                <Sparkles size={20} className="text-blue-400 animate-bounce" />
              </div>
            )}
          </button>
        </div>
      )}

      {/* Add Time Block Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/95 backdrop-blur-md">
          <div className="w-full max-w-sm space-y-12 animate-in fade-in zoom-in-95">
            <header className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-500/20">
                <Calendar size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-4xl font-serif">Mission Block</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Set a specific target for {newEvent.start}</p>
              </div>
            </header>

            <form onSubmit={handleAddStringEvent} className="space-y-10">
              <div className="space-y-8">
                <div className="space-y-2 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Mission Name</span>
                  <input
                    autoFocus
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Fetch Deep Work"
                    className="w-full bg-transparent text-3xl font-serif border-none outline-none placeholder:text-gray-100 text-center"
                  />
                </div>

                <div className="space-y-2 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Classification</span>
                  <div className="flex gap-2 justify-center">
                    {['mission', 'logistics', 'recovery'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewEvent({ ...newEvent, type })}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${newEvent.type === type ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button type="submit" className="w-full py-5 bg-black text-white rounded-3xl font-bold uppercase tracking-widest shadow-2xl active:scale-[0.98]">Assign to Orbit</button>
                <button type="button" onClick={() => setIsAdding(false)} className="text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-black transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Check = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
