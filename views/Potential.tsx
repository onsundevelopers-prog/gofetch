import React from 'react';
import { Shield, SparklesBold as Sparkles, Trophy, Rocket } from '../lib/icons';
import { DogBuddy } from '../components/DogBuddy';

export const Potential: React.FC<{ user: any; history: any[] }> = ({ user, history }) => {
    const currentMomentum = user?.score || 0;
    const bestMomentum = history.length > 0
        ? Math.max(...history.map(h => h.score || h.productivityScore || 0), 85)
        : 85;
    const gap = bestMomentum - currentMomentum;

    return (
        <div className="min-h-screen p-6 pb-32 max-w-2xl mx-auto space-y-12 animate-fade-in font-sans">
            <header className="pt-8 flex flex-col items-center text-center space-y-6">
                <DogBuddy mood={gap < 10 ? 'excited' : 'thinking'} size={140} className="drop-shadow-xl" />
                <div className="space-y-1">
                    <h1 className="text-4xl font-serif text-[var(--text-primary)]">Zenith</h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500/40">
                        The altitude of your highest potential.
                    </p>
                </div>
            </header>

            {/* Hidden Potential */}
            <section className="space-y-8 bg-white p-10 rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden group">
                <div className="absolute top-[-20%] right-[-10%] p-8 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                    <Rocket size={240} />
                </div>

                <div className="space-y-2 relative">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500/40">The Delta</span>
                    <h2 className="text-3xl font-serif text-[var(--text-primary)]">Current vs. Best</h2>
                </div>

                <div className="space-y-8 relative">
                    <div className="flex justify-between items-end">
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Daily Average</span>
                            <p className="text-5xl font-serif text-[var(--text-primary)]">{currentMomentum}</p>
                        </div>
                        <div className="text-right space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Zenith Peak</span>
                            <p className="text-5xl font-serif text-blue-500/20">{bestMomentum}</p>
                        </div>
                    </div>

                    <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden shadow-inner p-1">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-[2000ms] shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                            style={{ width: `${Math.min((currentMomentum / bestMomentum) * 100, 100)}%` }}
                        />
                    </div>

                    <div className="p-6 bg-blue-50/30 rounded-3xl border border-blue-100/20">
                        <p className="text-sm font-serif text-gray-500 italic leading-relaxed text-center">
                            {gap > 0
                                ? `Buddy sees ${gap} points of untapped energy drifting in space! Let's fire the thrusters and close the gap today.`
                                : `You've reached the ceiling of your current orbit! Time to build a larger spaceship and reach for the next galaxy.`}
                        </p>
                    </div>
                </div>
            </section>

            {/* Manifestation Board */}
            <section className="space-y-8">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Zenith Principles</h2>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="p-10 bg-black text-white rounded-[4rem] space-y-6 hover:scale-[1.02] transition-all group shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Shield size={100} />
                        </div>
                        <div className="w-14 h-14 rounded-3xl bg-white/10 flex items-center justify-center text-white border border-white/10 group-hover:bg-blue-500 transition-colors">
                            <Shield size={22} />
                        </div>
                        <div className="space-y-2 relative">
                            <h3 className="text-3xl font-serif">Deep Integrity</h3>
                            <p className="text-base font-serif text-white/50 leading-relaxed italic">
                                "Keeping your word to yourself is the most powerful signal you can broadcast into the universe."
                            </p>
                        </div>
                    </div>

                    <div className="p-10 bg-white border border-gray-50 rounded-[4rem] space-y-6 hover:border-blue-100 transition-all group shadow-sm flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                            <Sparkles size={22} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-serif text-[var(--text-primary)]">Micro-Victories</h3>
                            <p className="text-base font-serif text-gray-400 leading-relaxed italic">
                                "Big missions are just collections of small successful fetches. Celebrate every single micro-win, Buddy."
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
