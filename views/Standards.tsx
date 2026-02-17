import React, { useState, useEffect } from 'react';
import { Plus, X, Check, Activity, Bone, Sparkles, Flame, Zap } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { analyzeDay } from '../services/geminiService';
import { DailyOverview } from '../components/DailyOverview';

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
        <div className="min-h-screen p-6 pb-32 max-w-xl mx-auto space-y-16">
            <header className="pt-12 space-y-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-serif text-black -tracking-wide">Standards</h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">
                        Define the non-negotiables. Execute the mission.
                    </p>
                </div>
            </header>

            {/* Reflection */}
            <section id="reflection-section" className="space-y-6">
                <div className="space-y-1">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/60">Daily Audit</h2>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-black/60 italic">Reflect on your day to calculate your final momentum score.</p>
                </div>
                <div className="space-y-4 bg-black/[0.03] p-6 rounded-[2rem] border border-black/5">
                    <textarea
                        value={dailyLog}
                        onChange={(e) => setDailyLog(e.target.value)}
                        placeholder="Write about what you achieved today. Be honest with yourself."
                        className="w-full bg-transparent border-none outline-none resize-none text-base leading-relaxed min-h-[120px] placeholder:text-black/20 text-black font-serif"
                    />

                    <div className="flex flex-col gap-4 py-4 border-t border-black/[0.05]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">Energy level</span>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setEnergyLevel(num)}
                                        className={`w-8 h-8 rounded-full text-[10px] font-bold transition-all ${energyLevel === num ? 'bg-black text-white' : 'bg-black/5 text-black/40 hover:bg-black/20'}`}
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
                        className="w-full py-4 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50"
                        disabled={!dailyLog.trim() || isGeneratingReport}
                    >
                        {isGeneratingReport ? 'Reflecting...' : 'Save Reflection & Check Score'}
                    </button>
                </div>
            </section>

            {/* Non-Negotiables */}
            <section id="habits-section" className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/60">Non-Negotiables</h2>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-black/40">The standards you do not compromise on.</p>
                    </div>
                    <button onClick={() => setIsAddingHabit(true)} className="p-2 hover:bg-black/5 rounded-lg transition-colors">
                        <Plus size={18} className="text-black/60" />
                    </button>
                </div>

                <div className="space-y-2">
                    {habits.map((habit: any) => (
                        <div key={habit._id} className={`flex items-center justify-between p-4 rounded-xl border transition-all group ${habit.completed ? 'bg-black/[0.02] border-transparent' : 'border-black/5 hover:border-black/20'}`}>
                            <button
                                onClick={() => handleToggleHabit(habit._id, habit.completed)}
                                className="flex items-center gap-4 flex-1 text-left"
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${habit.completed ? 'bg-emerald-500 border-emerald-500' : 'border-black/20 group-hover:border-black/40'}`}>
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
                            <button onClick={() => handleDeleteHabit(habit._id)} className="opacity-0 group-hover:opacity-100 p-1 text-black/30 hover:text-red-500 transition-all">
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                    {habits.length === 0 && (
                        <div className="py-8 text-center border border-dashed border-black/10 rounded-xl">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-black/20 italic">No non-negotiables set.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Modals */}
            {isAddingHabit && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/95 backdrop-blur-md">
                    <div className="w-full max-w-xs space-y-8">
                        <header className="space-y-2">
                            <h3 className="text-3xl font-serif">New Standard</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-black/20">Define your absolute.</p>
                        </header>
                        <form onSubmit={handleAddHabit} className="space-y-8">
                            <div className="space-y-4">
                                <input
                                    autoFocus
                                    type="text"
                                    value={newHabit}
                                    onChange={(e) => setNewHabit(e.target.value)}
                                    placeholder="The Action"
                                    className="w-full bg-transparent text-2xl font-serif border-none outline-none placeholder:text-black/5"
                                />
                                <div className="flex gap-4 border-t border-black/5 pt-4">
                                    <div className="flex-1 space-y-1">
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-black/20">Target Qty</span>
                                        <input
                                            type="number"
                                            value={newHabitQuantity || ''}
                                            onChange={(e) => setNewHabitQuantity(parseInt(e.target.value) || 0)}
                                            placeholder="0"
                                            className="w-full bg-transparent text-sm font-bold outline-none"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-black/20">Unit (e.g. ml)</span>
                                        <input
                                            type="text"
                                            value={newHabitUnit}
                                            onChange={(e) => setNewHabitUnit(e.target.value)}
                                            placeholder="none"
                                            className="w-full bg-transparent text-sm font-bold outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <button type="button" onClick={() => setIsAddingHabit(false)} className="text-[10px] font-bold uppercase tracking-widest text-black/30">Cancel</button>
                                <button type="submit" className="text-[10px] font-bold uppercase tracking-widest text-black">Commit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showReport && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/95 backdrop-blur-md">
                    <div className="max-w-sm w-full space-y-8">
                        <div className="space-y-2 text-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">The Verdict</span>
                            <div className="flex items-baseline gap-4 justify-center">
                                <span className="text-7xl font-serif">{reportScore}</span>
                                <span className="text-xl font-serif text-black/20">/ 100</span>
                            </div>
                        </div>
                        <p className="text-sm font-serif text-black/60 italic leading-relaxed text-center">"{aiReport}"</p>
                        <button onClick={() => { setShowReport(false); setDailyLog(''); }} className="w-full py-4 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-all">
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
