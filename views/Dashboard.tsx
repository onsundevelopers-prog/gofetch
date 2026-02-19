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
  const [showOverview, setShowOverview] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportScore, setReportScore] = useState(0);
  const [aiReport, setAiReport] = useState('');

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

  return (
    <div className="min-h-screen p-6 pb-32 max-w-xl mx-auto space-y-16">
      {/* Header */}
      <header className="pt-12 space-y-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif text-black -tracking-wide">Today</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Premium Teaser - Potential */}
        <div className="glass p-8 rounded-[2rem] space-y-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 cursor-pointer border-none shadow-sm" onClick={() => window.location.hash = '/potential'}>
          <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
            <Sparkles size={120} />
          </div>
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">Unlock High Status</span>
            <h2 className="text-3xl font-serif">Your potential is waiting</h2>
          </div>
          <p className="text-sm font-serif text-black/60 leading-relaxed italic relative z-10">
            Race the ghost of your best self. Set the standard and outrun your past records.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black relative z-10">
            View Potential <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </header>

      {/* Primary Data */}
      <section className="space-y-12">
        <div id="momentum-score-card" className="flex items-baseline justify-between border-b border-black/[0.05] pb-12">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">Daily Momentum</span>
            <div className="flex items-baseline gap-2">
              <span className="text-8xl font-serif text-[var(--text-primary)] tracking-tighter animate-float">{user.score || 0}</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--accent)]">
                  {(() => {
                    const today = new Date().toDateString();
                    const previousRecord = history.find(r => r && r.date && new Date(r.date).toDateString() !== today);
                    const previousScore = previousRecord ? (previousRecord.score || previousRecord.productivityScore || 0) : 0;
                    const diff = (user.score || 0) - previousScore;
                    return `${diff >= 0 ? '+' : ''}${diff}%`;
                  })()}
                </span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-black/40">Growth</span>
              </div>
            </div>
          </div>
          <div className="text-right space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/60">Maximum Potential</span>
            <div className="flex items-baseline gap-2 justify-end">
              <span className="text-4xl font-serif text-[var(--text-secondary)]">{Math.max(user.score + 12, 85)}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">Daily Streak</span>
            <div className="flex items-center gap-2">
              <Flame size={14} className="text-orange-500" />
              <span className="text-sm font-serif font-black">{user.streak} Days Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule-section" className="space-y-8 pt-12 border-t border-black/[0.05]">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/60">Schedule</h2>
            <p className="text-[8px] font-bold uppercase tracking-widest text-black/40">Execute your high-leverage blocks directly.</p>
          </div>
        </div>

        <div className="space-y-4">
          {planEvents.length > 0 ? (
            planEvents.slice(0, 5).map((event: any, index: number) => (
              <div key={event.id || index} className={`flex items-center justify-between p-4 rounded-xl border transition-all group ${event.completed ? 'bg-black/[0.02] border-emerald-500/20' : 'border-black/5 hover:border-black/20'
                }`}>
                <div className="flex items-center gap-4 flex-1">
                  <button
                    onClick={() => {
                      const newPlan = planEvents.map((e, idx) =>
                        (e.id === event.id || (index === idx && !e.id)) ? { ...e, completed: !event.completed } : e
                      );
                      onUpdatePlan?.(newPlan);
                    }}
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${event.completed ? 'bg-emerald-500 border-emerald-500' : 'border-black/20 group-hover:border-black/40'
                      }`}
                  >
                    {event.completed ? (
                      <Check size={12} className="text-white" />
                    ) : (
                      <Zap size={10} className="text-black/20 group-hover:text-black/40" />
                    )}
                  </button>
                  <div className={`space-y-1 ${event.completed ? 'opacity-30 line-through' : ''}`}>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-black/40">
                      {event.start} - {event.type}
                    </span>
                    <h4 className="text-sm font-serif text-black leading-none">{event.title}</h4>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center border border-dashed border-black/5 rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/20 italic">
                No operations planned for today.
              </p>
            </div>
          )}
          <button
            onClick={() => window.location.hash = '/plan'}
            className="w-full py-4 text-[10px] font-bold uppercase tracking-widest text-black/60 hover:text-black transition-colors border border-black/5 rounded-2xl hover:border-black/20"
          >
            View Full Schedule →
          </button>
        </div>
      </section>

      {/* History */}
      {history && history.length > 0 && (
        <section className="pt-12 space-y-8 border-t border-black/[0.05]">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 text-center">Activity History</h2>
          <div className="grid grid-cols-7 gap-1">
            {history.slice(0, 7).reverse().map((entry: any) => (
              <div key={entry.id} className="flex flex-col items-center gap-1 group relative">
                <div className={`w-full aspect-square rounded-sm ${entry.score >= 80 ? 'bg-black' : entry.score >= 50 ? 'bg-black/40' : 'bg-black/10'}`} />
                <span className="text-[8px] font-mono text-black/20">{new Date(entry.date).getDate()}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white/95 backdrop-blur-md">
          <div className="max-w-sm w-full space-y-8">
            <div className="space-y-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">The Verdict</span>
              <div className="flex items-baseline gap-4 justify-center">
                <span className="text-7xl font-serif">{reportScore}</span>
                <span className="text-xl font-serif text-black/20">/ 100</span>
              </div>
            </div>
            <p className="text-sm font-serif text-black/60 italic leading-relaxed text-center">"{aiReport}"</p>
            <button onClick={() => { setShowReport(false); }} className="w-full py-4 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-all">
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
