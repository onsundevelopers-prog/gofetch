
import React, { useState } from 'react';
import { CharlieCharacter } from '../constants';
import { ArrowRight, Mail, Lock, User, CheckCircle, ExternalLink, Loader2 } from '../lib/icons';

interface AuthProps {
  onLogin: (user: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) return;
    
    setLoading(true);
    // Simulate API call for Sign Up or Login
    setTimeout(() => {
      setLoading(false);
      if (isSignUp) {
        setVerificationSent(true);
      } else {
        // Direct Login
        onLogin({ 
          name: name || 'User', 
          email, 
          avatarSeed: name || 'Alex', 
          apiKey: process.env.API_KEY || 'default_key' 
        });
      }
    }, 1200);
  };

  const handleSimulateVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      onLogin({ 
        name: name || 'New Fetcher', 
        email, 
        avatarSeed: name || 'Avatar', 
        apiKey: process.env.API_KEY || 'default_key',
        isPro: true, // Verification activates the trial
        trialStartedAt: new Date().toISOString()
      });
      setIsVerifying(false);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin({ 
        name: 'Google User', 
        email: 'user@gmail.com', 
        avatarSeed: 'Google', 
        apiKey: process.env.API_KEY || 'default_key',
        isPro: true
      });
      setLoading(false);
    }, 1000);
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen bg-[#E6DCCF] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500 font-sans">
        <div className="w-full max-w-sm bg-white rounded-[4rem] p-12 shadow-2xl text-center space-y-8 border border-white/50">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 mb-4">
            <CheckCircle className="w-12 h-12" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-serif text-[#1A1A1A]">Verify your pack</h2>
            <p className="text-black/40 font-bold text-sm leading-relaxed px-4">
              We've sent a unique activation link to <span className="text-[#1A1A1A] block underline">{email}</span>
            </p>
          </div>
          
          <div className="p-8 bg-[#E6DCCF]/30 rounded-[2.5rem] space-y-4">
             <p className="text-[10px] font-black uppercase text-black/30 tracking-widest">Simulation Mode</p>
             <button 
               onClick={handleSimulateVerify}
               disabled={isVerifying}
               className="w-full bg-[#1A1A1A] text-white font-black py-5 rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-xl"
             >
               {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ExternalLink className="w-5 h-5" /> Open Magic Link</>}
             </button>
          </div>

          <button onClick={() => setVerificationSent(false)} className="text-xs font-black uppercase tracking-widest text-black/40 hover:text-[#1A1A1A] transition-colors">
            Try a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#E6DCCF] animate-in slide-in-from-bottom duration-700 font-sans">
      <div className="w-full max-w-sm space-y-10">
        <div className="text-center space-y-6">
          <CharlieCharacter className="w-32 h-32 mx-auto floating" />
          <div>
            <h2 className="text-4xl font-serif text-[#1A1A1A]">{isSignUp ? 'New Fetcher' : 'Welcome Back'}</h2>
            <p className="text-black/40 font-bold text-sm mt-2">Gofetch: The OS for tracking habits and growth.</p>
          </div>
        </div>

        <div className="space-y-4">
          <button onClick={handleGoogleLogin} className="w-full bg-white text-[#1A1A1A] font-bold py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform border border-black/5">
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>
          
          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-black/10 flex-1"></div>
            <span className="text-[10px] font-black uppercase text-black/20 tracking-widest">or email</span>
            <div className="h-px bg-black/10 flex-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20" />
                <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="w-full bg-white/80 rounded-[2rem] py-6 pl-14 pr-8 outline-none focus:ring-4 focus:ring-orange-100 transition-all font-bold shadow-sm" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20" />
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full bg-white/80 rounded-[2rem] py-6 pl-14 pr-8 outline-none focus:ring-4 focus:ring-orange-100 transition-all font-bold shadow-sm" />
            </div>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20" />
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full bg-white/80 rounded-[2rem] py-6 pl-14 pr-8 outline-none focus:ring-4 focus:ring-orange-100 transition-all font-bold shadow-sm" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#1A1A1A] text-white font-black py-6 rounded-[2rem] shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 uppercase text-xs tracking-widest">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>{isSignUp ? 'Start 30-Day Trial' : 'Sign In'} <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        </div>
        
        <div className="text-center">
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm font-bold text-black/40 hover:text-[#1A1A1A] transition-colors">
            {isSignUp ? 'Already a member? Sign in' : "New here? Create account"}
          </button>
        </div>
      </div>
    </div>
  );
};
