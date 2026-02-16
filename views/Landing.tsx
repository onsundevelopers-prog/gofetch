import React, { useState } from 'react';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import { ArrowRight, Sparkles, Target, Zap, Clock, ShieldAlert } from 'lucide-react';

interface LandingProps {
  onNext: (mode: 'guest' | 'auth', data?: any) => void;
  onLogin: (user: any) => void;
}

type OnboardingStep = 'welcome' | 'role' | 'pain';

export const Landing: React.FC<LandingProps> = ({ onNext }) => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [onboardingData, setOnboardingData] = useState({
    role: '',
    pain: ''
  });

  const roles = [
    { id: 'founder', label: 'Founder / CEO', icon: <Zap size={18} /> },
    { id: 'creator', label: 'High-Level Creator', icon: <Sparkles size={18} /> },
    { id: 'student', label: 'Aspiring Leader', icon: <Clock size={18} /> },
    { id: 'discipline', label: 'Seeking Elite Discipline', icon: <ShieldAlert size={18} /> },
  ];

  const pains = [
    { id: 'procrastination', label: 'Procrastination', icon: <Target size={18} /> },
    { id: 'chaos', label: 'Lack of Structure', icon: <ShieldAlert size={18} /> },
    { id: 'forgetting', label: 'Failure to Execute', icon: <Clock size={18} /> },
    { id: 'focus', label: 'Struggling to Focus', icon: <Zap size={18} /> },
  ];

  const handleFinish = () => {
    onNext('guest', onboardingData);
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--bg-primary)] relative overflow-hidden">
        {/* Ambient Glow - Muted for Minimalism */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-black/[0.02] rounded-full blur-[100px]" />

        <div className="text-center max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-3">
              <h1 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)] tracking-tight leading-tight">
                Go Fetch.
              </h1>
            </div>

            <div className="space-y-8 max-w-2xl mx-auto">
              <div className="space-y-3">
                <h2 className="text-xl md:text-2xl font-serif italic text-[var(--text-primary)] leading-relaxed">
                  Your potential is an insult.<br />
                  Execution is the only apology.
                </h2>
              </div>

              <div className="p-8 bg-gradient-to-br from-[#F5F1EB] to-[#EDE7DD] rounded-2xl space-y-6 relative overflow-hidden group border border-[var(--border)] shadow-sm">
                {/* Visual Momentum Element */}
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                  <Zap size={160} className="text-[var(--accent)]" />
                </div>

                <p className="text-base md:text-lg font-serif leading-relaxed relative z-10 italic text-[var(--text-primary)]">
                  "Most apps just track what you’ve already done. Go Fetch is different. I’m your coach. We’re here to help you stay consistent and actually make progress. Your best self is waiting on the other side of consistency."
                </p>

                <div className="flex items-center gap-4 pt-4 relative z-10">
                  <div className="h-px w-12 bg-[var(--accent)]/30" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--accent)]">Your Habit Coach</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 max-w-sm mx-auto">
            <button
              onClick={() => setStep('role')}
              className="w-full py-4 text-base group bg-black text-white hover:bg-zinc-800 transition-all rounded-xl flex items-center justify-center gap-3 font-serif italic"
            >
              <span>Begin Questionnaire</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex flex-col items-center gap-6">
              <SignInButton mode="modal">
                <div className="text-center cursor-pointer group">
                  <button className="text-xs font-serif italic text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    Already in the pursuit? Log In
                  </button>
                </div>
              </SignInButton>
              <div className="flex items-center gap-3 opacity-10">
                <div className="h-[1px] w-6 bg-[var(--text-secondary)]" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Forged by Coach</span>
                <div className="h-[1px] w-6 bg-[var(--text-secondary)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'role') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--bg-primary)]">
        <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500/40">Step 1/2</span>
            <h2 className="text-4xl font-serif">Who are you?</h2>
            <p className="text-sm text-black/50 font-serif italic">I need to know who I'm coaching so I can tailor your plan.</p>
          </div>

          <div className="grid gap-3">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setOnboardingData({ ...onboardingData, role: r.id });
                  setStep('pain');
                }}
                className="flex items-center justify-between p-5 bg-white border border-black/5 rounded-2xl text-left hover:border-black hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                    {r.icon}
                  </div>
                  <span className="font-medium">{r.label}</span>
                </div>
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'pain') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--bg-primary)]">
        <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500/40">Step 2/2</span>
            <h2 className="text-4xl font-serif">What is your biggest challenge?</h2>
            <p className="text-sm text-black/50 font-serif italic">Be honest with yourself about your bottlenecks. That's where growth begins.</p>
          </div>

          <div className="grid gap-3">
            {pains.map((p) => (
              <button
                key={p.id}
                onClick={() => setOnboardingData({ ...onboardingData, pain: p.id })}
                className={`flex items-center justify-between p-5 bg-white border rounded-2xl text-left transition-all group ${onboardingData.pain === p.id ? 'border-black shadow-lg ring-1 ring-black/5' : 'border-black/5 hover:border-black'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${onboardingData.pain === p.id ? 'bg-black text-white' : 'bg-black/5 group-hover:bg-black group-hover:text-white'}`}>
                    {p.icon}
                  </div>
                  <span className="font-medium">{p.label}</span>
                </div>
                {onboardingData.pain === p.id && <ArrowRight size={18} />}
              </button>
            ))}
          </div>

          {onboardingData.pain && (
            <div className="space-y-3 pt-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-4 pt-4">
                <div className="text-center space-y-1">
                  <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-red-500/40">No Excuses. No Compromises.</p>
                </div>
                <SignUpButton mode="modal">
                  <button
                    onClick={() => {
                      import('../services/notificationService').then(m => m.NotificationService.requestPermission());
                    }}
                    className="bg-black text-white w-full py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl"
                  >
                    Lock In
                  </button>
                </SignUpButton>
              </div>
              <button
                onClick={() => {
                  import('../services/notificationService').then(m => m.NotificationService.requestPermission());
                  handleFinish();
                }}
                className="w-full py-3 text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          )}

          <button
            onClick={() => setStep('role')}
            className="w-full text-[10px] font-bold uppercase tracking-widest text-black/30 hover:text-black transition-colors flex items-center justify-center gap-2 pt-4"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return null;
};
