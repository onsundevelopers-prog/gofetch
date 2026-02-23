import React, { useState, useEffect } from 'react';
import { Plus, X, Check, Star, SparklesBold as Sparkles } from '../lib/icons';
import { useQuery, useMutation } from 'convex/react';
import { analyzeDay } from '../services/geminiService';
import { DailyOverview } from '../components/DailyOverview';
import { DogBuddy } from '../components/DogBuddy';

interface StandardsProps {
    user: any;
    history: any[];
    goals: any[];
    onUpdateHistory: (history: any[]) => void;
    onUpdatePlan?: (plan: any[]) => void;
    planEvents?: any[];
}

export const Standards: React.FC<StandardsProps> = ({
    user,
    history,
    goals,
    onUpdateHistory,
    onUpdatePlan,
    planEvents = [],
}) => {
    const isConvexSafe = !localStorage.getItem('force_guest_mode');

    // Local state for habits
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
    const [isAddingHabit, setIsAddingHabit] = useState(false);
    const [newHabit, setNewHabit] = useState('');
    const [newHabitQuantity, setNewHabitQuantity] = useState<number>(0);
    const [newHabitUnit, setNewHabitUnit] = useState('');

    const [dailyLog, setDailyLog] = useState('');
    const [energyLevel, setEnergyLevel] = useState<number>(3);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [reportScore, setReportScore] = useState(0);
    const [aiReport, setAiReport] = useState('');
    const [showReport, setShowReport] = useState(false);
    const [showOverview, setShowOverview] = useState(false);

    const habits = (user?.isGuest || !isConvexSafe) ? localHabits : (convexHabits || []);

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
                setIsAddingHabit(false);
            } catch (err) {
                const habit = { _id: `local_${Date.now()}`, ...habitData, completed: false, streak: 0 };
                const updated = [...localHabits, habit];
                setLocalHabits(updated);
                localStorage.setItem(`habits_${user.id}`, JSON.stringify(updated));
                setNewHabit('');
                setIsAddingHabit(false);
            }
        } else {
            const habit = { _id: `local_${Date.now()}`, ...habitData, completed: false, streak: 0 };
            const updated = [...localHabits, habit];
            setLocalHabits(updated);
            localStorage.setItem(`habits_${user.id || 'guest'}`, JSON.stringify(updated));
            setNewHabit('');
            setIsAddingHabit(false);
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
                energyLevel,
                "Steady",
                goals || [],
                habits || []
            );

            setAiReport(result.text);
            setReportScore(result.score);
            setShowReport(true);
            setShowOverview(true);
            localStorage.setItem('overview_shown_date', new Date().toDateString());

            const logEntry = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                reflection: dailyLog,
                score: result.score,
                productivityScore: result.score,
                didTodayCount: result.didTodayCount,
                report: result.text
            };
            onUpdateHistory([logEntry, ...history]);
            if (onUpdatePlan && result.schedule) {
                onUpdatePlan(result.schedule);
            }

            if (!user.isGuest && isConvexSafe) {
                await saveDailyLogMutation({
                    userId: user.id,
                    date: new Date().toISOString().split('T')[0],
                    energy: energyLevel,
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
                        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
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
        <div className="min-h-screen p-6 pb-32 max-w-2xl mx-auto space-y-12 animate-fade-in font-sans">
            <header className="pt-8 flex flex-col items-center text-center space-y-6">
                <DogBuddy mood="thinking" size={140} className="drop-shadow-xl" />
                <div className="space-y-1">
                    <h1 className="text-4xl font-serif text-[var(--text-primary)]">Daily Vitals</h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500/40">
                        Check your signals. Maintain your orbit.
                    </p>
                </div>
            </header>

            {/* Mission Journal */}
            <section id="reflection-section" className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Mission Journal</h2>
                    <span className="text-[10px] font-bold text-blue-500/60 uppercase">Record Signals</span>
                </div>

                <div className="space-y-6 bg-white p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Sparkles size={80} className="text-blue-500" />
                    </div>

                    <textarea
                        value={dailyLog}
                        onChange={(e) => setDailyLog(e.target.value)}
                        placeholder="Buddy is listening! How was your flight today? What did you fetch?"
                        className="w-full bg-transparent border-none outline-none resize-none text-lg leading-relaxed min-h-[140px] placeholder:text-gray-300 text-[var(--text-primary)] font-serif italic"
                    />

                    <div className="flex flex-col gap-6 pt-6 border-t border-gray-50">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Core Energy</span>
                            <div className="flex gap-3">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setEnergyLevel(num)}
                                        className={`w-10 h-10 rounded-2xl text-[10px] font-bold transition-all ${energyLevel === num ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        id="audit-button"
                        onClick={handleLogSubmit}
                        className="w-full py-5 bg-black text-white rounded-3xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
                        disabled={!dailyLog.trim() || isGeneratingReport}
                    >
                        {isGeneratingReport ? 'Processing Signals...' : 'Broadcast Mission Log'}
                    </button>
                </div>
            </section>

            {/* Daily Fetchables */}
            <section id="habits-section" className="space-y-8">
                <div className="flex items-center justify-between px-2">
                    <div className="space-y-1">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Daily Fetchables</h2>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400">The targets you never miss.</p>
                    </div>
                    <button onClick={() => setIsAddingHabit(true)} className="p-3 bg-gray-50 hover:bg-blue-50 rounded-2xl transition-colors">
                        <Plus size={18} className="text-blue-500" />
                    </button>
                </div>

                <div className="space-y-3">
                    {habits.map((habit: any) => (
                        <div key={habit._id} className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all group ${habit.completed ? 'bg-blue-50/20 border-blue-100' : 'bg-white border-gray-50 hover:border-blue-100 shadow-sm'}`}>
                            <button
                                onClick={() => handleToggleHabit(habit._id, habit.completed)}
                                className="flex items-center gap-5 flex-1 text-left"
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${habit.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-100 group-hover:border-blue-200'}`}>
                                    {habit.completed && <Check size={14} className="text-white" />}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <span className={`text-lg font-serif transition-all ${habit.completed ? 'text-gray-300 line-through' : 'text-[var(--text-primary)]'}`}>{habit.text}</span>
                                    {habit.targetQuantity && (
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 h-1.5 bg-gray-50 rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className="h-full bg-blue-500 transition-all duration-700"
                                                    style={{ width: `${Math.min(100, ((habit.quantity || 0) / habit.targetQuantity) * 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-300 tabular-nums">{habit.quantity || 0}/{habit.targetQuantity} {habit.unit}</span>
                                        </div>
                                    )}
                                </div>
                            </button>

                            {habit.targetQuantity && !habit.completed && (
                                <div className="flex items-center gap-2 mr-4 bg-gray-50 rounded-xl px-3 py-2">
                                    <input
                                        type="number"
                                        value={habit.quantity || ''}
                                        placeholder="0"
                                        onChange={(e) => handleUpdateQuantity(habit._id, parseInt(e.target.value) || 0)}
                                        onBlur={() => {
                                            if ((habit.quantity || 0) >= habit.targetQuantity) {
                                                handleToggleHabit(habit._id, false);
                                            }
                                        }}
                                        className="w-10 bg-transparent text-xs font-bold text-center outline-none text-blue-600"
                                    />
                                </div>
                            )}
                            <button onClick={() => handleDeleteHabit(habit._id)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-200 hover:text-red-400 transition-all">
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                    {habits.length === 0 && (
                        <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
                            <p className="text-sm font-serif italic text-gray-300">Your fetch list is empty, Buddy!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Modals */}
            {isAddingHabit && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/95 backdrop-blur-md">
                    <div className="w-full max-w-sm space-y-12 animate-in fade-in zoom-in-95">
                        <header className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-blue-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-500/20">
                                <Plus size={24} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-4xl font-serif">New Target</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Set a new signal for Buddy.</p>
                            </div>
                        </header>
                        <form onSubmit={handleAddHabit} className="space-y-10">
                            <div className="space-y-6">
                                <input
                                    autoFocus
                                    type="text"
                                    value={newHabit}
                                    onChange={(e) => setNewHabit(e.target.value)}
                                    placeholder="What will you fetch?"
                                    className="w-full bg-transparent text-3xl font-serif border-none outline-none placeholder:text-gray-100 text-center"
                                />
                                <div className="flex gap-8 border-t border-gray-50 pt-8 justify-center">
                                    <div className="space-y-2 text-center">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Target Qty</span>
                                        <input
                                            type="number"
                                            value={newHabitQuantity || ''}
                                            onChange={(e) => setNewHabitQuantity(parseInt(e.target.value) || 0)}
                                            placeholder="0"
                                            className="w-20 bg-gray-50 py-3 rounded-xl text-lg font-serif text-center outline-none text-blue-600"
                                        />
                                    </div>
                                    <div className="space-y-2 text-center">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Unit</span>
                                        <input
                                            type="text"
                                            value={newHabitUnit}
                                            onChange={(e) => setNewHabitUnit(e.target.value)}
                                            placeholder="ml/min"
                                            className="w-24 bg-gray-50 py-3 rounded-xl text-lg font-serif text-center outline-none text-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <button type="submit" className="w-full py-5 bg-black text-white rounded-3xl font-bold uppercase tracking-widest shadow-2xl active:scale-[0.98]">Commit Target</button>
                                <button type="button" onClick={() => setIsAddingHabit(false)} className="text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-black transition-colors">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showReport && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/95 backdrop-blur-md">
                    <div className="max-w-sm w-full space-y-10 text-center animate-in fade-in zoom-in-95">
                        <div className="space-y-4">
                            <DogBuddy mood={reportScore >= 80 ? 'excited' : 'happy'} size={120} className="mx-auto" />
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500/40">The Flight Log</span>
                                <div className="flex items-baseline gap-2 justify-center">
                                    <span className="text-8xl font-serif">{reportScore}</span>
                                    <span className="text-2xl font-serif text-gray-200">/ 100</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xl font-serif text-gray-600 italic leading-relaxed">"{aiReport}"</p>
                        <button onClick={() => { setShowReport(false); setDailyLog(''); }} className="w-full py-5 bg-black text-white rounded-3xl font-bold uppercase tracking-widest shadow-2xl active:scale-[0.98]">
                            Acknowledge Mission
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
