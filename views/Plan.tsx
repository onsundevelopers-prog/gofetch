import React, { useState } from 'react';
import { Plus, X, Calendar, Lock, Circle, CheckCircle2, Zap, ArrowRight, Star } from 'lucide-react';

interface PlanProps {
  user: any;
  planEvents: any[];
  onUpdatePlan: (events: any[]) => void;
}

export const Plan: React.FC<PlanProps> = ({ user, planEvents = [], onUpdatePlan }) => {
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', type: 'deep-work' });
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

  // Use local state if onUpdatePlan is not provided (for standalone testing or prev compatibility), but prefer props
  const events = planEvents;

  const handleAddStringEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.start) return;
    onUpdatePlan([...events, { ...newEvent, id: Date.now().toString(), completed: false }]);
    setNewEvent({ title: '', start: '', end: '', type: 'deep-work' });
    setIsAdding(false);
  }

  const completedCount = planEvents.filter(e => e.completed).length;
  const totalCount = planEvents.length;
  const momentum = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Find the first uncompleted event to enforce "one at a time"
  const firstUncompletedId = planEvents.find(e => !e.completed)?.id;

  const handleCompleteDay = () => {
    // Navigation or trigger overview
    window.location.hash = '/';
    localStorage.setItem('trigger_overview', 'true');
  };

  return (
    <div className="min-h-screen p-6 pb-32 max-w-xl mx-auto space-y-16">
      {/* Header */}
      <header className="pt-12 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-serif text-black -tracking-wide">Daily Operations</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/20 italic">No Excuses. No Compromises.</p>
          </div>
          {!isLocked && planEvents.length > 0 && (
            <button
              id="lock-plan-button"
              onClick={handleLockPlan}
              className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all transform active:scale-95"
            >
              Lock Schedule
            </button>
          )}
          {isLocked && (
            <div className="flex items-center gap-2 px-6 py-2 border border-black text-black rounded-xl text-[10px] font-bold uppercase tracking-widest">
              Schedule Active
            </div>
          )}
        </div>

        {/* Simple Instructions */}
        <div className="p-4 bg-black/[0.01] border-l-2 border-black/5 flex items-start gap-4">
          <Calendar size={14} className="text-black/20 mt-1" />
          <p className="text-xs font-serif text-black/40 leading-relaxed italic">
            Build your day by adding focus blocks. Once you're satisfied with your plan, lock it in to commit to your day.
          </p>
        </div>

        {/* Momentum Bar - 200M App Feature */}
        {isLocked && totalCount > 0 && (
          <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/20">Daily Momentum</span>
                <p className="text-2xl font-serif">Maximum Potential</p>
              </div>
              <span className="text-4xl font-serif text-black">{Math.round(momentum)}%</span>
            </div>
            <div className="h-3 w-full momentum-bar">
              <div
                className="momentum-fill"
                style={{ width: `${momentum}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Timeline */}
      <div className="space-y-0.5">
        {hours.map(hour => {
          const timeString = `${hour.toString().padStart(2, '0')}:00`;
          const event = events.find(e => e.start === timeString);

          return (
            <div key={hour} className="group flex items-start py-6 border-b border-black/[0.03] transition-colors hover:border-black/5">
              <div className="w-16 pt-0.5 text-[10px] font-bold text-black/20 font-mono tracking-tighter">
                {timeString}
              </div>
              <div className="flex-1 min-h-[1.5rem] relative">
                {event ? (
                  <div className="flex items-center justify-between group-hover:pl-2 transition-all">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          const newEvents = planEvents.map(e =>
                            e.id === event.id ? { ...e, completed: !e.completed } : e
                          );
                          onUpdatePlan(newEvents);
                        }}
                        className={`transition-all ${event.completed ? 'text-emerald-500' :
                          event.id === firstUncompletedId ? 'text-black/40 hover:text-black hover:scale-110' : 'text-black/20 hover:text-black/40'}`}
                      >
                        {event.completed ? <CheckCircle2 size={18} /> :
                          event.id === firstUncompletedId ? <Zap size={18} className="animate-pulse" /> : <Circle size={18} />}
                      </button>
                      <div className={`space-y-1 transition-all ${event.completed ? 'opacity-40 line-through' : ''}`}>
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${event.completed ? 'text-black/20' : 'text-black/40'}`}>{event.type}</span>
                        <h4 className="text-lg font-serif text-black leading-none">{event.title}</h4>
                      </div>
                    </div>
                    {!isLocked && (
                      <button
                        onClick={() => onUpdatePlan(planEvents.filter(e => e.id !== event.id))}
                        className="p-2 text-black/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={14} />
                      </button>
                    )}
                    {isLocked && !event.completed && <Lock size={12} className="text-black/5" />}
                  </div>
                ) : !isLocked ? (
                  <button
                    onClick={() => {
                      setNewEvent({ ...newEvent, start: timeString });
                      setIsAdding(true);
                    }}
                    className="w-full text-left text-[10px] font-bold uppercase tracking-[0.2em] text-black/5 hover:text-black/40 transition-all py-1.5"
                  >
                    + Add activity
                  </button>
                ) : (
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/5 py-1.5 italic">
                    Unallocated
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Done with my Day Button - 200M App Feature */}
      {isLocked && (
        <div className="pt-12 pb-24 border-t border-black/[0.03]">
          <button
            onClick={handleCompleteDay}
            className={`w-full py-8 rounded-[2rem] transition-all duration-700 group relative overflow-hidden flex items-center justify-center gap-6
              ${momentum === 100
                ? 'bg-black text-white shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.3)]'
                : 'bg-black/[0.02] border border-black/5 text-black hover:bg-black hover:text-white'}`}
          >
            <div className="flex flex-col items-start text-left">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Day Conclusion</span>
              <span className="text-2xl font-serif">Secure Day Momentum</span>
            </div>
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />

            {momentum === 100 && (
              <div className="absolute top-4 right-8">
                <Star size={16} fill="currentColor" className="text-emerald-400 animate-bounce" />
              </div>
            )}
          </button>
        </div>
      )}

      {/* Add Objective Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white/95 backdrop-blur-md">
          <div className="w-full max-w-sm space-y-12">
            <header className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">Add to Schedule</span>
              <h3 className="text-4xl font-serif">Time Block</h3>
            </header>

            <form onSubmit={handleAddStringEvent} className="space-y-12">
              <div className="space-y-8">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">Activity</span>
                  <input
                    autoFocus
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Deep Focus / Strategic Review"
                    className="w-full bg-transparent text-2xl font-serif border-none outline-none placeholder:text-black/5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">Classification</span>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                      className="w-full bg-transparent text-sm font-serif border-none outline-none appearance-none cursor-pointer"
                    >
                      <option value="deep-work">Deep Work</option>
                      <option value="logistics">Logistics</option>
                      <option value="recovery">Recovery</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-12">
                <button type="button" onClick={() => setIsAdding(false)} className="text-[10px] font-bold uppercase tracking-widest text-black/30 hover:text-black">Cancel</button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-900 transition-all"
                >
                  Save activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
