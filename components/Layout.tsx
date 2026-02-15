import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Target, BarChart2, MessageSquare, Sparkles, Users, LogOut, X, Calendar } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Today' },
  { to: '/plan', icon: Calendar, label: 'Plan' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/potential', icon: Sparkles, label: 'Potential' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
] as const;

export const Layout: React.FC<{
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
  setUser: (user: any) => void;
  onGenerateAvatar: () => void;
  isGeneratingAvatar: boolean;
}> = ({ children, user, onLogout }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="relative min-h-screen">
      <main className="pb-32">
        {children}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/[0.02] backdrop-blur-md border border-black/5 rounded-full z-50">
        <div className="flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              id={`nav-${item.to.replace('/', '') || 'today'}`}
              className={({ isActive }) => `flex items-center justify-center transition-all ${isActive ? 'text-black scale-110' : 'text-black/20 hover:text-black/40'}`}
            >
              <item.icon size={18} strokeWidth={2.5} />
            </NavLink>
          ))}
          <div className="w-px h-4 bg-black/5" />
          <button
            id="nav-settings"
            onClick={() => setShowSettings(true)}
            className="flex items-center justify-center text-black/20 hover:text-black/40 transition-all"
          >
            <Users size={18} strokeWidth={2.5} />
          </button>
        </div>
      </nav>

      {/* Settings Modal - Refined */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/95 backdrop-blur-md">
          <div className="w-full max-w-xs space-y-12">
            <header className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-black text-white rounded-full flex items-center justify-center">
                <Users size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-serif">{user?.name ?? 'Guest User'}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-black/20">{user?.email ?? 'Free Plan'}</p>
              </div>
            </header>

            <div className="grid grid-cols-2 gap-12 border-y border-black/5 py-8">
              <div className="text-center space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-black/20">Momentum</p>
                <p className="text-3xl font-serif">{user?.score || 0}</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-black/20">Streak</p>
                <p className="text-3xl font-serif">{user?.streak || 0}</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  (window as any).restartTutorial?.();
                  setShowSettings(false);
                }}
                className="w-full py-4 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Restart Tutorial
              </button>
              <button
                onClick={onLogout}
                className="w-full py-4 border border-black text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
              >
                Logout
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="w-full text-[10px] font-bold uppercase tracking-widest text-black/20 hover:text-black transition-colors"
              >
                Back to App
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
