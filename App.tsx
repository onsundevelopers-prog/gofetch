
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { Layout } from './components/Layout';
import { Landing } from './views/Landing';
import { Dashboard } from './views/Dashboard';
import { Chat } from './views/Chat';
import { Goals } from './views/Goals';
import { Analytics } from './views/Analytics';
import { Trial } from './views/Trial';
import { Plan } from './views/Plan';
import { Potential } from './views/Potential';
import { Tutorial } from './components/Tutorial';
import { useNotifications } from './hooks/useNotifications';
import { useGuiltMechanic } from './hooks/useGuiltMechanic';



import { useUser, useAuth, SignedOut, SignedIn } from '@clerk/clerk-react';
import { useQuery, useMutation } from 'convex/react';
import { Paywall } from './components/Paywall';
import { generateAIAvatar } from './services/avatarService';

const App: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useAuth();
  const isConvexSafe = !localStorage.getItem('force_guest_mode');

  // Safe Convex Queries - Using string based names for ultimate stability
  const convexUser = useQuery("users:getPreferences" as any, (user && isConvexSafe) ? { userId: user.id } : "skip");
  const stats = useQuery("users:getStats" as any, (user && isConvexSafe) ? { userId: user.id } : "skip");
  const convexUserData = useQuery("users:getUser" as any, (user && isConvexSafe) ? { userId: user.id } : "skip");
  const updateAvatarMutation = useMutation("users:updateAvatar" as any);

  const [showPaywall, setShowPaywall] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [guestUser, setGuestUser] = useState<any>(null);

  // Stabilize appUser to prevent re-render loops
  const appUser = useMemo(() => {
    if (guestUser) return guestUser;
    if (!user) return null;

    // Check trial from Convex data
    const isPremium = convexUserData?.isPremium || false;
    const trialEndsAt = convexUserData?.trialEndsAt;
    const daysLeft = trialEndsAt ? Math.ceil((trialEndsAt - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

    return {
      id: user.id,
      name: user.fullName || user.firstName || 'Explorer',
      email: user.primaryEmailAddress?.emailAddress,
      avatarSeed: convexUser?.avatarUrl || user.imageUrl,
      isGuest: false,
      isPremium,
      trialEndsAt,
      daysLeft,
      onboardingMessage: convexUserData?.onboardingMessage,
      score: convexUserData?.score || stats?.score || 0,
      streak: convexUserData?.streak || stats?.streak || 0
    };
  }, [user?.id, user?.fullName, user?.firstName, user?.imageUrl, convexUser?.avatarUrl, stats?.score, stats?.streak, convexUserData, guestUser]);


  const storeUserMutation = useMutation("users:storeUser" as any);

  useEffect(() => {
    if (isSignedIn && user) {
      storeUserMutation({
        userId: user.id,
        name: user.fullName || user.firstName || "Explorer",
        email: user.primaryEmailAddress?.emailAddress || "",
        picture: user.imageUrl,
      });
    }
  }, [isSignedIn, user?.id]);


  const handleGenerateAvatar = async () => {
    if (!user) return;
    setIsGeneratingAvatar(true);
    try {
      const newUrl = await generateAIAvatar("chill");
      await updateAvatarMutation({ userId: user.id, avatarUrl: newUrl });
    } catch (e) {
      console.error("Avatar generation failed", e);
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  // State for Goals and History with local persistence
  const [goals, setGoals] = useState<any[]>(() => {
    const saved = localStorage.getItem('user_goals');
    return saved ? JSON.parse(saved) : [];
  });
  const [history, setHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('user_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [planEvents, setPlanEvents] = useState<any[]>(() => {
    const saved = localStorage.getItem('user_plan');
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch Poke System: Notify user based on their plan
  useNotifications(planEvents);
  useGuiltMechanic();

  useEffect(() => {
    // Attempt permission request on first global interaction to bypass browser blocks
    const handleFirstInteraction = () => {
      import('./services/notificationService').then(m => m.NotificationService.requestPermission());
      document.removeEventListener('click', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    return () => document.removeEventListener('click', handleFirstInteraction);
  }, []);

  useEffect(() => {
    localStorage.setItem('user_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('user_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('user_plan', JSON.stringify(planEvents));
  }, [planEvents]);

  const handleUpdateGoals = (newGoals: any[]) => setGoals(newGoals);
  const handleUpdateHistory = (newHistory: any[]) => setHistory(newHistory);
  const handleUpdatePlan = (newPlan: any[]) => {
    const planWithIds = newPlan.map(item => ({
      ...item,
      id: item.id || item._id || `op_${item.start}_${Math.random().toString(36).substr(2, 5)}`
    }));
    setPlanEvents(planWithIds);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container min-h-screen bg-[var(--bg-primary)]">
        {appUser ? (
          <Layout
            user={appUser}
            onLogout={() => {
              if (appUser.isGuest) {
                setGuestUser(null);
              } else {
                signOut();
              }
            }}
            setUser={() => { }}
            onGenerateAvatar={handleGenerateAvatar}
            isGeneratingAvatar={isGeneratingAvatar}
          >
            <Routes>
              <Route path="/" element={<Dashboard user={appUser} history={history} onUpdateHistory={handleUpdateHistory} goals={goals} onUpdatePlan={handleUpdatePlan} planEvents={planEvents} />} />
              <Route path="/goals" element={<Goals goals={goals} onUpdateGoals={handleUpdateGoals} />} />
              <Route path="/potential" element={<Potential user={appUser} history={history} />} />
              <Route path="/plan" element={<Plan user={appUser} planEvents={planEvents} onUpdatePlan={handleUpdatePlan} />} />
              <Route path="/analytics" element={<Analytics history={history} user={appUser} />} />
              <Route path="/chat" element={<Chat user={appUser} goals={goals} />} />
              <Route path="/trial" element={<Trial onUpgrade={(plan) => { console.log(`Upgrading to ${plan}`); setShowPaywall(false); }} onClose={() => { }} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Tutorial />
          </Layout>
        ) : (
          <Routes>
            <Route path="/" element={<Landing onNext={async (mode, data) => {
              if (mode === 'guest') {
                setIsGeneratingAvatar(true); // Reusing loading state
                try {
                  const { generateInitialPlan } = await import('./services/geminiService');
                  const initial = await generateInitialPlan(data?.role || 'user', data?.pain || 'growth');

                  // Save habits and plan immediately for the guest
                  const guestHabits = initial.habits.map((h: string) => ({
                    _id: `initial_${Math.random()}`,
                    text: h,
                    completed: false,
                    streak: 0,
                    target: 1
                  }));

                  localStorage.setItem('habits_guest', JSON.stringify(guestHabits));
                  localStorage.setItem('user_plan', JSON.stringify(initial.schedule));

                  setGuestUser({
                    id: 'guest',
                    name: 'Guest Explorer',
                    isGuest: true,
                    isPremium: true,
                    score: 0,
                    streak: 0,
                    onboardingMessage: initial.message
                  });
                } catch (e) {
                  console.error("Failed to generate initial plan", e);
                  setGuestUser({
                    id: 'guest',
                    name: 'Guest Explorer',
                    isGuest: true,
                    isPremium: false,
                    score: 0,
                    streak: 0
                  });
                } finally {
                  setIsGeneratingAvatar(false);
                }
              }
            }} onLogin={() => { }} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}

        {showPaywall && (
          <Paywall
            onClose={() => setShowPaywall(false)}
            onUpgrade={(plan) => {
              console.log(`Upgrading to ${plan}`);
              setShowPaywall(false);
            }}
          />
        )}
      </div>
    </Router>
  );
};

export default App;
