import React from 'react';
import { Shield, Sparkles, Trophy } from 'lucide-react';

export const Potential: React.FC<{ user: any; history: any[] }> = ({ user, history }) => {
    const currentMomentum = user?.score || 0;
    const bestMomentum = history.length > 0
        ? Math.max(...history.map(h => h.productivityScore || 0), 85)
        : 85;
    const gap = bestMomentum - currentMomentum;

    return (
        <div className="min-h-screen p-6 pb-32 max-w-xl mx-auto space-y-16 animate-fade-in">
            <header className="pt-12 space-y-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-serif text-black -tracking-wide">Potential</h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/20">The Vision of Your Best Self</p>
                </div>
            </header>

            {/* Hidden Potential */}
            <section className="card space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <Trophy size={120} />
                </div>

                <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20">Hidden Potential</span>
                    <h2 className="text-3xl font-serif">Racing Your Record</h2>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]/60">Current Self</span>
                            <p className="text-4xl font-serif">{currentMomentum}</p>
                        </div>
                        <div className="text-right space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">Your Potential</span>
                            <p className="text-4xl font-serif text-black/20">{bestMomentum}</p>
                        </div>
                    </div>

                    <div className="h-4 w-full bg-black/[0.03] rounded-full overflow-hidden p-1 border border-black/[0.02]">
                        <div
                            className="h-full bg-black rounded-full transition-all duration-[2000ms] shadow-[0_0_20px_rgba(0,0,0,0.1)]"
                            style={{ width: `${Math.min((currentMomentum / bestMomentum) * 100, 100)}%` }}
                        />
                    </div>

                    <p className="text-xs font-serif text-black/40 italic leading-relaxed text-center pt-4">
                        {gap > 0
                            ? `Your hidden potential is ${gap} points ahead. Reclaim your standard.`
                            : `You have surpassed your record. You are now defining a new potential.`}
                    </p>
                </div>
            </section>

            {/* Manifestation Board */}
            <section className="space-y-8">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">The standard</h2>
                <div className="grid grid-cols-1 gap-6">
                    <div className="p-8 border border-black/5 rounded-[2rem] space-y-4 hover:bg-white transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white">
                            <Shield size={20} />
                        </div>
                        <h3 className="text-2xl font-serif">Unshakeable Discipline</h3>
                        <p className="text-sm font-serif text-black/40 leading-relaxed italic">
                            "The ability to do what needs to be done, when it needs to be done, whether you feel like it or not."
                        </p>
                    </div>

                    <div className="p-8 border border-black/5 rounded-[2rem] space-y-4 hover:bg-white transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-white">
                            <Sparkles size={20} />
                        </div>
                        <h3 className="text-2xl font-serif">Focused Intent</h3>
                        <p className="text-sm font-serif text-black/40 leading-relaxed italic">
                            "Eliminating the non-essential to protect the vital. Your potential is hidden in your daily schedule."
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};
