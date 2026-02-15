import React from 'react';
import { Check, Sparkles } from 'lucide-react';

interface TrialProps {
    onUpgrade: (plan: string) => void;
    onClose: () => void;
}

export const Trial: React.FC<TrialProps> = ({ onUpgrade, onClose }) => {
    return (
        <div className="min-h-screen p-6 pb-32 max-w-xl mx-auto space-y-16 flex flex-col items-center text-center">
            {/* Header */}
            <header className="pt-24 space-y-4">
                <h1 className="text-6xl font-serif text-black -tracking-wide">Pro</h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20">Unlock your full potential</p>
            </header>

            {/* Trial Offer */}
            <section className="space-y-2">
                <div className="text-9xl font-serif text-black tracking-tighter">30</div>
                <div className="text-lg font-serif italic text-black/60">Days of Free Access</div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/10">Followed by $12/month subscription</p>
            </section>

            {/* Features */}
            <section className="w-full space-y-8 pt-12">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">— Pro Features —</h2>
                <div className="space-y-4 text-left max-w-xs mx-auto">
                    {[
                        "Deep AI Performance Analysis",
                        "Unlimited Goal Tracking",
                        "Focused Strategy Tools",
                        "Comprehensive History Logs",
                        "Priority Momentum Sync"
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-4 py-3 border-b border-black/[0.03] transition-colors hover:border-black/10">
                            <Check size={14} className="text-emerald-500" />
                            <span className="text-sm font-serif italic text-black/70">{feature}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Action */}
            <section className="w-full pt-12 space-y-6">
                <button
                    onClick={() => onUpgrade('premium')}
                    className="w-full py-5 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-all active:scale-95"
                >
                    Start 30-Day Trial
                </button>
                <button
                    onClick={onClose}
                    className="text-[10px] font-bold uppercase tracking-widest text-black/20 hover:text-black transition-colors"
                >
                    Stay on Free Plan
                </button>
            </section>
        </div>
    );
};
