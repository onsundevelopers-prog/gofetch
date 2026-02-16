import React from 'react';
import { Shield, Sparkles, Trophy } from 'lucide-react';

export const Potential: React.FC<{ user: any; history: any[] }> = ({ user, history }) => {
    const currentMomentum = user?.score || 0;
    const bestMomentum = history.length > 0
        ? Math.max(...history.map(h => h.score || h.productivityScore || 0), 85)
        : 85;
    const gap = bestMomentum - currentMomentum;

    return (
        <div className="min-h-screen p-6 pb-32 max-w-xl mx-auto space-y-16 animate-fade-in">
            <header className="pt-12 space-y-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-serif text-black -tracking-wide">Standard</h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500">The Delta Between You and Success</p>
                </div>
            </header>

            {/* Hidden Potential */}
            <section className="card space-y-8 relative overflow-hidden bg-white/50 backdrop-blur-xl border-black/5">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <Trophy size={120} />
                </div>

                <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20">The Gap</span>
                    <h2 className="text-3xl font-serif">Reality vs. Intention</h2>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">Current Output</span>
                            <p className="text-4xl font-serif">{currentMomentum}</p>
                        </div>
                        <div className="text-right space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-red-500/60">The Standard</span>
                            <p className="text-4xl font-serif text-black/20">{bestMomentum}</p>
                        </div>
                    </div>

                    <div className="h-6 w-full bg-black/[0.03] rounded-full overflow-hidden p-1.5 border border-black/5">
                        <div
                            className="h-full bg-black rounded-full transition-all duration-[2000ms] shadow-[0_0_20px_rgba(0,0,0,0.2)]"
                            style={{ width: `${Math.min((currentMomentum / bestMomentum) * 100, 100)}%` }}
                        />
                    </div>

                    <p className="text-sm font-serif text-black/60 italic leading-relaxed text-center pt-4">
                        {gap > 0
                            ? `You're currently breathing ${gap} points of air that belongs to your better self. Stop negotiating and close the gap.`
                            : `You've hit the ceiling. Now build a new floor. The standard just went up.`}
                    </p>
                </div>
            </section>

            {/* Manifestation Board */}
            <section className="space-y-8">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">Non-Negotiables</h2>
                <div className="grid grid-cols-1 gap-6">
                    <div className="p-8 bg-black text-white rounded-[2rem] space-y-4 hover:scale-[1.02] transition-all group shadow-2xl">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10">
                            <Shield size={20} />
                        </div>
                        <h3 className="text-2xl font-serif">Brutal Integrity</h3>
                        <p className="text-sm font-serif text-white/60 leading-relaxed italic">
                            "Doing exactly what you said you would do, long after the mood you said it in has left you."
                        </p>
                    </div>

                    <div className="p-8 border border-black/5 rounded-[2rem] space-y-4 bg-white hover:bg-zinc-50 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white">
                            <Sparkles size={20} />
                        </div>
                        <h3 className="text-2xl font-serif">Obsessive Focus</h3>
                        <p className="text-sm font-serif text-black/40 leading-relaxed italic">
                            "Your calendar is your character. If it isn't in the schedule, it doesn't exist. Protect the vision."
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};
