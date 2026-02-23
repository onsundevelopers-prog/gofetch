// Refined onboarding experience - Updated 2026-02-16
import React, { useState, useEffect } from 'react';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import { ArrowRight, Sparkles, Target, Zap, Clock, ShieldAlert, Cpu, GraduationCap, Briefcase, Rocket, User, Dumbbell, Coffee, BookOpen, TrendingUp, Heart } from 'lucide-react';

interface LandingProps {
  onNext: (mode: 'guest' | 'auth', data?: any) => void;
  onLogin: (user: any) => void;
}

type OnboardingStep = 'welcome' | 'role' | 'pain';

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

import { DogBuddy } from '../components/DogBuddy';

export const Landing: React.FC<LandingProps> = ({ onNext }) => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [onboardingData, setOnboardingData] = useState({
    role: '',
    pain: ''
  });

  const roles = [
    {
      id: 'business',
      label: 'Building a Business',
      icon: <Rocket size={18} />,
      description: "Ready to launch something amazing? I'll help you navigate the stars and keep your mission on track!"
    },
    {
      id: 'creative',
      label: 'Content & Design',
      icon: <Sparkles size={18} />,
      description: "Creativity can feel like floating in space sometimes. Let's find your orbit and keep the flow consistent!"
    },
    {
      id: 'fitness',
      label: 'Fitness & Health',
      icon: <Dumbbell size={18} />,
      description: "Your body is your spaceship! Let's fuel up and build the strength we need to explore new horizons."
    },
    {
      id: 'learning',
      label: 'Learning & School',
      icon: <BookOpen size={18} />,
      description: "Knowledge is the ultimate power-up. I'll help you gather all the 'treats' of wisdom on your journey!"
    },
    {
      id: 'career',
      label: 'Career Growth',
      icon: <TrendingUp size={18} />,
      description: "Aiming for the stars in your career? Let's chart a path that keeps you rising without the burnout."
    },
    {
      id: 'general',
      label: 'Self-Improvement',
      icon: <Heart size={18} />,
      description: "Just want to be a better explorer today? I'm here to wag my tail for every single step you take!"
    },
  ];

  const pains = [
    { id: 'procrastination', label: 'Heavy Inertia', icon: <Target size={18} /> },
    { id: 'chaos', label: 'Atmospheric Noise', icon: <ShieldAlert size={18} /> },
    { id: 'forgetting', label: 'Lost Signals', icon: <Clock size={18} /> },
    { id: 'focus', label: 'Magnetic Interference', icon: <Zap size={18} /> },
  ];

  const handleFinish = () => {
    onNext('guest', onboardingData);
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--bg-primary)] relative overflow-hidden">
        {/* Soft Cosmic Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/[0.03] rounded-full blur-[100px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/[0.02] rounded-full blur-[100px]" />

        <div className="text-center max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-6">
              <DogBuddy mood="excited" size={240} className="drop-shadow-2xl" />
              <div className="space-y-2">
                <h1 className="text-5xl md:text-7xl font-serif text-[var(--text-primary)] tracking-tight leading-tight">
                  Antigravity.
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-blue-500/60">Defy Your Inertia</p>
              </div>
            </div>

            <div className="space-y-8 max-w-2xl mx-auto">
              <h2 className="text-xl md:text-2xl font-serif italic text-[var(--text-primary)] leading-relaxed">
                Meet Buddy—your loyal companion on the path to high performance. No gravity, just growth.
              </h2>

              <div className="p-10 bg-white/80 backdrop-blur-md rounded-[3rem] space-y-8 relative overflow-hidden group border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <p className="text-lg md:text-xl font-serif leading-relaxed relative z-10 italic text-[var(--text-primary)]">
                  "Woof! Most apps just keep lists. I’m here to keep you flying. We’ll track your fetchable goals, wag for your wins, and help you break free from the weight of procrastination."
                </p>

                <div className="flex items-center justify-center gap-4 pt-4 relative z-10">
                  <div className="h-[2px] w-8 bg-blue-500/20" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-500/50">Your Flight Companion</span>
                  <div className="h-[2px] w-8 bg-blue-500/20" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 max-w-sm mx-auto">
            <button
              onClick={() => setStep('role')}
              className="w-full py-5 text-lg group bg-black text-white hover:bg-zinc-800 transition-all rounded-3xl flex items-center justify-center gap-3 font-serif italic shadow-2xl active:scale-[0.98]"
            >
              <span>Start the Mission</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex flex-col items-center gap-6">
              <SignInButton mode="modal">
                <button className="text-xs font-serif italic text-[var(--text-secondary)] hover:text-blue-500 transition-colors">
                  Already flying? Log In
                </button>
              </SignInButton>
              <div className="flex items-center gap-3 opacity-20">
                <div className="h-[1px] w-12 bg-[var(--text-secondary)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Antigravity Buddy</span>
                <div className="h-[1px] w-12 bg-[var(--text-secondary)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'role') {
    const selectedRole = roles.find(r => r.id === onboardingData.role);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--bg-primary)]">
        <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500/40">Step 1/2</span>
            <h2 className="text-4xl font-serif">Tell me about yourself.</h2>
            <p className="text-sm text-black/50 font-serif italic">I need to know what you're working on so I can create the best plan for you.</p>
          </div>

          <div className="grid gap-3">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setOnboardingData({ ...onboardingData, role: r.id });
                }}
                className={`flex items-center justify-between p-5 bg-white border rounded-2xl text-left transition-all group ${onboardingData.role === r.id ? 'border-black shadow-lg ring-1 ring-black/5' : 'border-black/5 hover:border-black'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${onboardingData.role === r.id ? 'bg-black text-white' : 'bg-black/5 group-hover:bg-black group-hover:text-white'}`}>
                    {r.icon}
                  </div>
                  <span className="font-medium">{r.label}</span>
                </div>
                {onboardingData.role === r.id && <ArrowRight size={18} />}
              </button>
            ))}
          </div>

          {selectedRole && (
            <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-2">
              <div className="p-6 bg-black/[0.02] border border-black/5 rounded-2xl">
                <p className="text-sm font-serif italic text-black/60 leading-relaxed min-h-[48px]">
                  <TypewriterText text={selectedRole.description} />
                </p>
              </div>
              <button
                onClick={() => setStep('pain')}
                className="w-full py-4 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-3"
              >
                <span>Continue</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
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
            <h2 className="text-4xl font-serif">What's holding you back?</h2>
            <p className="text-sm text-black/50 font-serif italic">Be honest about what gets in your way. That's the only way we can fix it.</p>
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
