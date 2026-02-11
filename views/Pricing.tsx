
import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Zap, Crown, Loader2 } from '../lib/icons';

const PLANS = [
  { 
    name: 'Free', price: '$0', 
    features: ['Daily tracking', 'Basic Charley AI suggestions', 'Limited goals (2)', 'Weekly summary'],
    color: 'bg-white', buttonText: 'Current Plan' 
  },
  { 
    name: 'Pro', price: '$12', 
    features: ['ElevenLabs Voice Interactions', 'Mirror Mode reflections', 'Unlimited Goals', 'Calendar Routine Sync', '30-Day Free Trial'],
    color: 'bg-[#1A1A1A]', buttonText: 'Start 30-Day Trial'
  }
];

export const Pricing: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isAlreadyPro, setIsAlreadyPro] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('habithive_user') || '{}');
    if (user.isPro) setIsAlreadyPro(true);
  }, []);

  const handleSubscribe = (name: string) => {
    if (name === 'Free' || isAlreadyPro) return;
    setLoading(name);
    setTimeout(() => {
      const user = JSON.parse(localStorage.getItem('habithive_user') || '{}');
      const updatedUser = { ...user, isPro: true, trialStarted: true };
      localStorage.setItem('habithive_user', JSON.stringify(updatedUser));
      
      setSuccess(true);
      setIsAlreadyPro(true);
      setLoading(null);
      
      // Auto-hide success message
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#E6DCCF] p-8 pb-40 animate-in fade-in duration-700 space-y-12 font-sans">
      <header className="pt-10 text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-white text-orange-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm mb-4">
          <Sparkles className="w-4 h-4" /> Reach Your Potential
        </div>
        <h2 className="text-5xl font-serif text-[#1A1A1A]">Level Up</h2>
        <p className="text-black/40 font-bold text-sm italic">Unlock the full power of Charley AI.</p>
      </header>

      {success && (
        <div className="bg-green-500 text-white p-6 rounded-[2rem] font-bold text-center animate-in slide-in-from-top duration-500 shadow-xl">
          Woof! You are now a Pro Fetcher! Enjoy your 30-day trial.
        </div>
      )}

      <div className="space-y-6">
        {PLANS.map((plan) => {
          const isProPlan = plan.name === 'Pro';
          const isButtonDisabled = loading === plan.name || (isProPlan && isAlreadyPro) || (!isProPlan && !isAlreadyPro);
          
          return (
            <div key={plan.name} className={`${isProPlan ? 'bg-[#1A1A1A] text-white' : 'bg-white text-slate-900'} rounded-[3rem] p-10 border border-black/5 flex flex-col shadow-xl relative overflow-hidden transition-transform hover:scale-[1.01]`}>
              {isProPlan && <div className="absolute top-8 right-8 text-orange-400"><Crown className="w-8 h-8 rotate-12" /></div>}
              <h3 className="text-2xl font-serif">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-serif">{plan.price}</span>
                <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">/mo</span>
              </div>
              <ul className="mt-8 space-y-5 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex gap-4 text-sm font-bold opacity-80">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isProPlan ? 'bg-white/10 text-[#FFB352]' : 'bg-orange-100 text-orange-500'}`}>
                      <Check className="w-4 h-4" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleSubscribe(plan.name)}
                disabled={isButtonDisabled}
                className={`mt-10 w-full py-6 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${isProPlan ? 'bg-[#FFB352] text-white' : 'bg-[#E6DCCF]/20 text-slate-800 cursor-default'}`}
              >
                {loading === plan.name ? <Loader2 className="w-5 h-5 animate-spin" /> : (isProPlan && isAlreadyPro ? 'Trial Active' : plan.buttonText)}
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-[3rem] p-10 border border-black/5 text-center space-y-6 shadow-sm">
         <Zap className="w-10 h-10 text-orange-400 mx-auto" />
         <h3 className="text-2xl font-serif text-slate-900">Gofetch for Teams</h3>
         <p className="text-black/40 font-bold text-sm leading-relaxed">Collective growth for startups and squads. Real-time dashboards for group wins.</p>
         <button className="bg-[#1A1A1A] text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.05] transition-transform">Contact Sales</button>
      </div>
    </div>
  );
};
