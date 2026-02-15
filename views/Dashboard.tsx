import React, { useState, useEffect } from 'react';
import { Plus, X, Sparkles, AlertCircle, CheckCircle2, Flame, Ghost, Zap, ShieldAlert, Clock, Play, Volume2, Activity, Star, ArrowRight, Check, Shield } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { analyzeDay } from '../services/geminiService';
import { DailyOverview } from '../components/DailyOverview';

interface DashboardProps {
  user: any;
  history: any[];
  goals: any[];
  onUpdateHistory: (history: any[]) => void;
  onUpdatePlan?: (plan: any[]) => void;
  planEvents?: any[];
}

export const Dashboard: React.FC<DashboardProps> = ({ user, history, goals, onUpdateHistory, onUpdatePlan, planEvents = [] }) => {
  const isConvexSafe = !localStorage.getItem('force_guest_mode');

  // Local state for guest mode
  const [localHabits, setLocalHabits] = useState<any[]>(() => {
    const userId = user?.id || 'guest';
    const saved = localStorage.getItem(`habits_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Convex Queries & Mutations
  const convexHabits = useQuery("tasks:listHabits" as any, (user && !user.isGuest && isConvexSafe) ? { userId: user.id } : "skip");
  const addHabitMutation = useMutation("tasks:addHabit" as any);
  const toggleHabitMutation = useMutation("tasks:toggleHabit" as any);
  const deleteHabitMutation = useMutation("tasks:deleteHabit" as any);
  const updateTaskQuantityMutation = useMutation("tasks:updateTaskQuantity" as any);
  const saveDailyLogMutation = useMutation("userData:saveDailyLog" as any);
  const saveDailyPlanMutation = useMutation("userData:saveDailyPlan" as any);

  // Component State
  const [isAdding, setIsAdding] = useState(false);
  const [newHabit, setNewHabit] = useState('');
  const [newHabitQuantity, setNewHabitQuantity] = useState<number>(0);
  const [newHabitUnit, setNewHabitUnit] = useState('');

  const [dailyLog, setDailyLog] = useState('');
  const [didTodayCount, setDidTodayCount] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportScore, setReportScore] = useState(0);
  const [aiReport, setAiReport] = useState('');
  const [showOverview, setShowOverview] = useState(false);

  useEffect(() => {
    // Exactly when the day is "done" (after 9 PM) show overview
    const checkDayDone = () => {
      const now = new Date();
      if (now.getHours() >= 21) {
        const lastShown = localStorage.getItem('overview_shown_date');
        const today = now.toDateString();
        if (lastShown !== today && history.length > 0) {
          const todayEntry = history.find(e => new Date(e.date).toDateString() === today);
          if (todayEntry) {
            setShowOverview(true);
            localStorage.setItem('overview_shown_date', today);
          }
        }
      }
    };

    checkDayDone();
    const interval = setInterval(checkDayDone, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [history]);

  useEffect(() => {
    const checkTrigger = () => {
      if (localStorage.getItem('trigger_overview') === 'true') {
        setShowOverview(true);
        localStorage.removeItem('trigger_overview');
      }
    };
    checkTrigger();
  }, []);

  const habits = (user?.isGuest || !isConvexSafe) ? localHabits : (convexHabits || []);

  const pendingHabits = habits.filter((h: any) => !h.completed);
  const finishedHabits = habits.filter((h: any) => h.completed);

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim() || !user) return;

    const habitData = {
      userId: user.id || 'guest',
      text: newHabit,
      target: 1,
      quantity: newHabitQuantity > 0 ? 0 : undefined,
      targetQuantity: newHabitQuantity > 0 ? newHabitQuantity : undefined,
      unit: newHabitUnit || undefined,
    };

    if (!user.isGuest && isConvexSafe) {
      try {
        await addHabitMutation(habitData);
        setNewHabit('');
        setNewHabitQuantity(0);
        setNewHabitUnit('');
        setIsAdding(false);

        // TRIGGER LIFE SCORE AUDIT ON COMMIT
        if (dailyLog.trim()) {
          handleLogSubmit();
        }
      } catch (err) {
        const habit = { _id: `local_${Date.now()}`, ...habitData, completed: false, streak: 0 };
        const updated = [...localHabits, habit];
        setLocalHabits(updated);
        localStorage.setItem(`habits_${user.id}`, JSON.stringify(updated));
        setNewHabit('');
        setIsAdding(false);
        if (dailyLog.trim()) handleLogSubmit();
      }
    } else {
      const habit = { _id: `local_${Date.now()}`, ...habitData, completed: false, streak: 0 };
      const updated = [...localHabits, habit];
      setLocalHabits(updated);
      localStorage.setItem(`habits_${user.id || 'guest'}`, JSON.stringify(updated));
      setNewHabit('');
      setIsAdding(false);
      if (dailyLog.trim()) handleLogSubmit();
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (!user.isGuest && isConvexSafe) {
      try {
        await updateTaskQuantityMutation({ id: id as any, quantity: newQuantity });
      } catch (err) {
        const updated = localHabits.map(h => h._id === id ? { ...h, quantity: newQuantity } : h);
        setLocalHabits(updated);
        localStorage.setItem(`habits_${user.id || 'guest'}`, JSON.stringify(updated));
      }
    } else {
      const updated = localHabits.map(h => h._id === id ? { ...h, quantity: newQuantity } : h);
      setLocalHabits(updated);
      localStorage.setItem(`habits_${user.id || 'guest'}`, JSON.stringify(updated));
    }
  };

  const handleToggleHabit = async (id: string, current: boolean) => {
    if (!user.isGuest && isConvexSafe) {
      try {
        await toggleHabitMutation({ id: id as any });
      } catch (err) {
        const updated = localHabits.map(h => h._id === id ? { ...h, completed: !current } : h);
        setLocalHabits(updated);
        localStorage.setItem(`habits_${user.id || 'guest'}`, JSON.stringify(updated));
      }
    } else {
      const updated = localHabits.map(h => h._id === id ? { ...h, completed: !current } : h);
      setLocalHabits(updated);
      localStorage.setItem(`habits_${user.id || 'guest'}`, JSON.stringify(updated));
    }
  };

  const handleDeleteHabit = async (id: string) => {
    if (!user.isGuest && isConvexSafe) {
      try {
        await deleteHabitMutation({ id: id as any });
      } catch (err) {
        const updated = localHabits.filter(h => h._id !== id);
        setLocalHabits(updated);
        localStorage.setItem(`habits_${user.id || 'guest'}`, JSON.stringify(updated));
      }
    } else {
      const updated = localHabits.filter(h => h._id !== id);
      setLocalHabits(updated);
      localStorage.setItem(`habits_${user.id || 'guest'}`, JSON.stringify(updated));
    }
  };

  const handleLogSubmit = async () => {
    if (!dailyLog.trim() || !user) return;
    setIsGeneratingReport(true);

    try {
      const result = await analyzeDay(
        dailyLog,
        3, // Default energy for now
        "Steady", // Default mood
        goals || [],
        habits || []
      );

      setAiReport(result.text);
      setReportScore(result.score);
      setDidTodayCount(result.didTodayCount);
      setShowReport(true);
      setShowOverview(true);
      localStorage.setItem('overview_shown_date', new Date().toDateString());

      // Save to history locally
      const logEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        reflection: dailyLog,
        score: result.score,
        didTodayCount: result.didTodayCount,
        report: result.text
      };
      onUpdateHistory([logEntry, ...history]);
      if (onUpdatePlan && result.schedule) {
        onUpdatePlan(result.schedule);
      }

      // Save to Convex if possible
      if (!user.isGuest && isConvexSafe) {
        await saveDailyLogMutation({
          userId: user.id,
          date: new Date().toISOString().split('T')[0],
          energy: 3,
          mood: "Steady",
          reflection: dailyLog,
          productivityScore: result.score,
          impactScore: result.score,
          didTodayCount: result.didTodayCount,
          feedback: result.text
        });

        if (result.schedule && result.schedule.length > 0) {
          await saveDailyPlanMutation({
            userId: user.id,
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
            events: result.schedule
          });
        }
      }
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="min-h-screen p-6 pb-32 max-w-xl mx-auto space-y-16">
      {/* Header */}
      <header className="pt-12 space-y-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif text-black -tracking-wide">Today</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/20">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>


        {/* Premium Teaser - Potential */}
        <div className="glass p-8 rounded-[2rem] space-y-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 cursor-pointer border-none" onClick={() => window.location.hash = '/potential'}>
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
            <Sparkles size={120} />
          </div>
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">Unlock High Status</span>
            <h2 className="text-3xl font-serif">Your potential is waiting</h2>
          </div>
          <p className="text-sm font-serif text-black/40 leading-relaxed italic relative z-10">
            Race the ghost of your best self. Set the standard and outrun your past records.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black relative z-10">
            View Potential <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </header>

      {/* Reflection - Moved to Top */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">Daily Reflection</h2>
          <p className="text-[8px] font-bold uppercase tracking-widest text-black/10">Reflect on your day to calculate your final momentum score.</p>
        </div>
        <div className="space-y-4">
          <textarea
            value={dailyLog}
            onChange={(e) => setDailyLog(e.target.value)}
            placeholder="Write about what you achieved today. Be honest with yourself."
            className="w-full bg-transparent border-none outline-none resize-none text-base leading-relaxed min-h-[120px] placeholder:text-black/10 font-serif"
          />
          <button
            onClick={handleLogSubmit}
            className="w-full py-4 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50"
            disabled={!dailyLog.trim() || isGeneratingReport}
          >
            {isGeneratingReport ? 'Reflecting...' : 'Save Reflection & Check Score'}
          </button>
        </div>
      </section>

      {/* Primary Data */}
      <section className="space-y-12">
        <div className="flex items-baseline justify-between border-b border-black/[0.03] pb-12">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20">Daily Momentum</span>
            <div className="flex items-baseline gap-2">
              <span className="text-8xl font-serif text-[var(--text-primary)] tracking-tighter animate-float">{user.score || 0}</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--accent)]">+{Math.min(user.score, 12)}%</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-black/10">Growth</span>
              </div>
            </div>
          </div>
          <div className="text-right space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">Maximum Potential</span>
            <div className="flex items-baseline gap-2 justify-end">
              <span className="text-4xl font-serif text-[var(--text-secondary)]">{Math.max(user.score + 12, 85)}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">Daily Streak</span>
            <span className="text-sm font-serif">{user.streak} Days Active</span>
          </div>
        </div>
      </section>

      {/* Actions (Non-Negotiables) */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">Non-Negotiables</h2>
            <p className="text-[8px] font-bold uppercase tracking-widest text-black/10">The standards you do not compromise on.</p>
          </div>
          <button onClick={() => setIsAdding(true)} className="p-2 hover:bg-black/5 rounded-lg transition-colors">
            <Plus size={18} className="text-black/40" />
          </button>
        </div>

        <div className="space-y-2">
          {habits.map((habit: any) => (
            <div key={habit._id} className={`flex items-center justify-between p-4 rounded-xl border transition-all group ${habit.completed ? 'bg-black/[0.02] border-transparent' : 'border-black/5 hover:border-black/10'}`}>
              <button
                onClick={() => handleToggleHabit(habit._id, habit.completed)}
                className="flex items-center gap-4 flex-1 text-left"
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${habit.completed ? 'bg-emerald-500 border-emerald-500' : 'border-black/10 group-hover:border-black/30'}`}>
                  {habit.completed ? <Check size={12} className="text-white" /> : <div className="w-1.5 h-1.5 bg-black opacity-0 group-hover:opacity-10" />}
                </div>
                <div className="flex-1 space-y-1">
                  <span className={`text-sm font-medium transition-all ${habit.completed ? 'text-black/30 line-through' : 'text-black/80'}`}>{habit.text}</span>
                  {habit.targetQuantity && (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1 bg-black/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--accent)] transition-all duration-500"
                          style={{ width: `${Math.min(100, ((habit.quantity || 0) / habit.targetQuantity) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-black/40">{habit.quantity || 0}/{habit.targetQuantity} {habit.unit}</span>
                    </div>
                  )}
                </div>
              </button>

              {habit.targetQuantity && !habit.completed && (
                <div className="flex items-center gap-2 mr-4 bg-black/5 rounded-lg px-2 py-1">
                  <input
                    type="number"
                    value={habit.quantity || ''}
                    placeholder="Done"
                    onChange={(e) => handleUpdateQuantity(habit._id, parseInt(e.target.value) || 0)}
                    onBlur={() => {
                      if ((habit.quantity || 0) >= habit.targetQuantity) {
                        handleToggleHabit(habit._id, false);
                      }
                    }}
                    className="w-12 bg-transparent text-[10px] font-bold text-center outline-none"
                  />
                  <span className="text-[10px] text-black/20 font-bold">QTY</span>
                </div>
              )}
              <button onClick={() => handleDeleteHabit(habit._id)} className="opacity-0 group-hover:opacity-100 p-1 text-black/20 hover:text-red-400 transition-all">
                <X size={14} />
              </button>
            </div>
          ))}
          {habits.length === 0 && (
            <div className="py-8 text-center border border-dashed border-black/5 rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/10 italic">No non-negotiables set.</p>
            </div>
          )}
        </div>
      </section>

      {/* Schedule (Daily Operations) */}
      <section className="space-y-8 pt-12 border-t border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-secondary)]">Daily Operations</h2>
            <p className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)]/50">Execute your high-leverage blocks directly.</p>
          </div>
        </div>

        <div className="space-y-4">
          {planEvents.length > 0 ? (
            planEvents.slice(0, 5).map((event: any) => (
              <div key={event.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all group ${event.completed ? 'bg-[#F5F1EB] border-[var(--accent)]/20' : 'border-[var(--border)] hover:border-[var(--accent)]/40'
                }`}>
                <div className="flex items-center gap-4 flex-1">
                  <button
                    onClick={() => {
                      const newPlan = planEvents.map(e => e.id === event.id ? { ...e, completed: !event.completed } : e);
                      onUpdatePlan?.(newPlan);
                    }}
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${event.completed ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-[var(--border)] group-hover:border-[var(--accent)]'
                      }`}
                  >
                    {event.completed ? (
                      <CheckCircle2 size={12} className="text-white" />
                    ) : (
                      <Zap size={10} className="text-[var(--text-secondary)]/30 group-hover:text-[var(--accent)]" />
                    )}
                  </button>
                  <div className={`space-y-1 ${event.completed ? 'opacity-50 line-through' : ''}`}>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)]/40">
                      {event.start} - {event.type}
                    </span>
                    <h4 className="text-sm font-serif text-[var(--text-primary)] leading-none">{event.title}</h4>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center border border-dashed border-[var(--border)] rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]/30 italic">
                No operations planned for today.
              </p>
            </div>
          )}
          <button
            onClick={() => window.location.hash = '/plan'}
            className="w-full py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border)] rounded-2xl hover:border-[var(--accent)]/40"
          >
            View Full Schedule →
          </button>
        </div>
      </section>

      {/* History */}
      {history && history.length > 0 && (
        <section className="pt-24 space-y-8">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20 text-center">Activity History</h2>
          <div className="grid grid-cols-7 gap-1">
            {history.slice(0, 7).reverse().map((entry: any) => (
              <div key={entry.id} className="flex flex-col items-center gap-1 group relative">
                <div className={`w-full aspect-square rounded-sm ${entry.score >= 80 ? 'bg-[var(--accent)]' : entry.score >= 50 ? 'bg-[var(--accent)]/30' : 'bg-black/5'}`} />
                <span className="text-[8px] font-mono text-black/10">{new Date(entry.date).getDate()}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modals - Simplified */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white/90 backdrop-blur-sm">
          <div className="w-full max-w-xs space-y-8">
            <input
              autoFocus
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="New Absolute"
              className="w-full bg-transparent text-3xl font-serif border-none outline-none placeholder:text-black/5"
              onKeyDown={(e) => e.key === 'Enter' && handleAddHabit(e as any)}
            />
            <div className="flex justify-between items-center">
              <button onClick={() => setIsAdding(false)} className="text-[10px] font-bold uppercase tracking-widest text-black/30">Cancel</button>
              <button onClick={handleAddHabit} className="text-[10px] font-bold uppercase tracking-widest text-black">Commit</button>
            </div>
          </div>
        </div>
      )}

      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white/95 backdrop-blur-md">
          <div className="max-w-sm w-full space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">The Verdict</span>
              <div className="flex items-baseline gap-4">
                <span className="text-7xl font-serif">{reportScore}</span>
                <span className="text-xl font-serif text-black/20">/ 100</span>
              </div>
            </div>
            <p className="text-sm font-serif text-black/60 italic leading-relaxed">"{aiReport}"</p>
            <button onClick={() => { setShowReport(false); setDailyLog(''); }} className="w-full py-4 border border-black text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
              Acknowledge
            </button>
          </div>
        </div>
      )}
      {showOverview && history[0] && (
        <DailyOverview
          record={history[0]}
          events={planEvents}
          onClose={() => setShowOverview(false)}
        />
      )}
    </div>
  );
};
