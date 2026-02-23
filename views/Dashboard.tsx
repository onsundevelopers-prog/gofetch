import React, { useState, useEffect, useMemo } from 'react';
import { SparklesBold as Sparkles, Star, ArrowRight, Check } from '../lib/icons';
import { DogBuddy } from '../components/DogBuddy';
import { motion, AnimatePresence } from 'framer-motion';
import { DailyOverview } from '../components/DailyOverview';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  // Determine Buddy's mood based on score
  const buddyMood = useMemo(() => {
    if (user?.score >= 80) return 'excited';
    if (user?.score >= 60) return 'happy';
    if (!user?.score || (user?.score === 0 && history.length === 0)) return 'happy';
    if (user?.score < 40) return 'thinking';
    return 'happy';
  }, [user?.score, history.length]);

  useEffect(() => {
    const checkDayDone = () => {
      const now = new Date();
      if (now.getHours() >= 21) {
        const lastShown = localStorage.getItem('overview_shown_date');
        const today = now.toDateString();
        if (lastShown !== today && history.length > 0) {
          setShowOverview(true);
          localStorage.setItem('overview_shown_date', today);
        }
      }
    };
    checkDayDone();
    const interval = setInterval(checkDayDone, 60000);
    return () => clearInterval(interval);
  }, [history]);

  const handleManualTrigger = () => {
    setShowOverview(true);
  };

  const handleToggleEvent = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdatePlan) return;
    const newEvents = planEvents.map(ev =>
      ev.id === eventId ? { ...ev, completed: !ev.completed } : ev
    );
    onUpdatePlan(newEvents);
  };

  return (
    <div className="min-h-screen p-6 pb-32 max-w-2xl mx-auto space-y-12 animate-fade-in font-sans">
      {/* Header & Buddy Section */}
      <header className="pt-8 flex flex-col items-center text-center space-y-6">
        <div className="relative group cursor-pointer" onClick={handleManualTrigger} id="buddy-mascot-trigger">
          <DogBuddy mood={buddyMood} size={180} className="drop-shadow-2xl hover:scale-105 transition-transform" />
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute -top-4 -right-12 bg-white px-4 py-2 rounded-2xl shadow-xl border border-blue-500/10 text-[10px] font-bold uppercase tracking-widest text-blue-600"
          >
            {user?.score >= 80 ? "Flying High! 🚀" : "Let's Fetch! 🦴"}
          </motion.div>
        </div>

        <div className="space-y-1">
          <h1 className="text-4xl font-serif text-[var(--text-primary)]">Mission Control</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500/40">Ready for Lift-off, {user?.name}?</p>
        </div>
      </header>

      {/* Primary Momentum Orb */}
      <section className="relative p-10 bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white flex flex-col items-center space-y-8 overflow-hidden group" id="momentum-orb-card">
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-50" />

        <div className="space-y-2 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Current Velocity</span>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-7xl font-serif text-[var(--text-primary)] tracking-tighter">{user?.score || 0}</span>
            <span className="text-sm font-bold text-blue-500/50">/100</span>
          </div>
        </div>

        <div className="w-full h-4 bg-gray-50 rounded-full p-1 border border-gray-100 overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${user?.score || 0}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          />
        </div>

        <div className="grid grid-cols-2 w-full gap-4 pt-4">
          <div className="bg-blue-50/50 p-4 rounded-2xl text-center space-y-1">
            <span className="text-[8px] font-bold uppercase tracking-widest text-blue-600">Daily Streak</span>
            <p className="text-2xl font-serif text-blue-900">{user?.streak || 0} Days</p>
          </div>
          <div className="bg-purple-50/50 p-4 rounded-2xl text-center space-y-1">
            <span className="text-[8px] font-bold uppercase tracking-widest text-purple-600">Flight Hours</span>
            <p className="text-2xl font-serif text-purple-900">{((user?.score || 0) * 0.12).toFixed(1)}h</p>
          </div>
        </div>
      </section>

      {/* Mission Schedule */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Today's Flight Path</h2>
          <button
            onClick={() => navigate('/plan')}
            className="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:underline"
            id="edit-flight-path-link"
          >
            Edit Path
          </button>
        </div>

        <div className="space-y-3">
          {planEvents && planEvents.length > 0 ? (
            planEvents.slice(0, 4).map((event, i) => (
              <motion.div
                key={event.id || `plan_${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate('/plan')}
                className={`bg-white p-6 rounded-[2rem] border border-gray-50 flex items-center justify-between hover:border-blue-100 transition-all group shadow-sm cursor-pointer ${event.completed ? 'opacity-60' : ''}`}
                id={`mission-item-${event.id}`}
              >
                <div className="flex items-center gap-5">
                  <button
                    onClick={(e) => handleToggleEvent(event.id, e)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${event.completed ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-300 hover:bg-blue-50 hover:text-blue-500'}`}
                    id={`toggle-mission-${event.id}`}
                  >
                    {event.completed ? <Check size={16} /> : <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />}
                  </button>
                  <div className="h-8 w-[1px] bg-gray-100" />
                  <div>
                    <h3 className={`text-lg font-serif ${event.completed ? 'text-gray-400 line-through' : 'text-[var(--text-primary)]'}`}>{event.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black tabular-nums text-blue-500/40">{event.start}</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">• {event.type || 'Activity'}</span>
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500" />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-10 border-2 border-dashed border-gray-100 rounded-[3rem] text-center space-y-4">
              <p className="text-sm font-serif italic text-gray-400">No signals detected for today yet.</p>
              <button
                onClick={() => navigate('/plan')}
                className="text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:text-blue-700 underline"
                id="map-flight-path-empty-btn"
              >
                Map Flight Path
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Buddy Insight Card */}
      <section className="bg-black text-white p-10 rounded-[3rem] space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Sparkles size={120} />
        </div>
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <Star size={14} className="text-white" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Buddy's Insight</span>
          </div>
          <p className="text-xl font-serif italic leading-relaxed">
            "{(user?.score || 0) >= 80
              ? "Woof! You're soaring through the stratosphere today! Keep that momentum going, and we'll reach our moon target in no time."
              : "Looks like the atmospheric pressure is a bit high today, but don't worry! Every step forward is a victory. Let's fetch one more task!"}"
          </p>
        </div>
      </section>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {showOverview && (
          <DailyOverview
            onClose={() => setShowOverview(false)}
            user={user}
            history={history}
            habits={JSON.parse(localStorage.getItem(user.isGuest ? 'habits_guest' : 'habits') || '[]')}
            onAnalysisComplete={(score, text, schedule) => {
              setReportScore(score);
              setAiReport(text);
              setShowOverview(false);
              setShowReport(true);
              if (schedule && schedule.length > 0) {
                onUpdatePlan?.(schedule);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
