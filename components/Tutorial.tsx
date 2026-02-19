
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Sparkles, ArrowDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Step {
    id: number;
    title: string;
    content: string;
    targetId?: string;
    path?: string;
    requiredAction?: string;
}

const STEPS: Step[] = [
    {
        id: 1,
        title: "Welcome to Go Fetch",
        content: "I'm your Coach. I'm here to help you build elite discipline. Let's learn how to use this system to win your day.",
        path: "/",
        targetId: "momentum-score-card"
    },
    {
        id: 2,
        title: "The Momentum Score",
        content: "This shows how consistent you are. Aim for 100! Your score tracks your discipline over time.",
        targetId: "momentum-score-card",
        path: "/"
    },
    {
        id: 3,
        title: "Your Daily Audit",
        content: "CRITICAL: Type what you did today here. This is how I create your schedule. Without your input, there is no plan.",
        targetId: "reflection-section",
        path: "/standards"
    },
    {
        id: 4,
        title: "Check Your Progress",
        content: "After typing your reflection, click 'Check Score'. I will analyze your effort and judge if the day counted.",
        targetId: "audit-button",
        path: "/standards"
    },
    {
        id: 5,
        title: "The Battle Plan",
        content: "Once you audit your day, your hourly schedule for tomorrow appears here. Follow it exactly.",
        targetId: "lock-plan-button",
        path: "/plan"
    },
    {
        id: 6,
        title: "Non-Negotiable Habits",
        content: "Check off your habits as you do them. If you miss one, you must explain why in your reflection.",
        targetId: "habits-section",
        path: "/standards"
    },
    {
        id: 7,
        title: "Long-term Goals",
        content: "Track your vision here. Anchor your daily habits to these outcomes.",
        targetId: "goals-container",
        path: "/goals"
    },
    {
        id: 8,
        title: "Ready to Execute",
        content: "You're all set. Remember: Reflection -> Check Score -> Follow Schedule. Now, go and be great.",
        targetId: "nav-today", // Home icon in nav
        path: "/"
    }
];

export const Tutorial: React.FC<{ userId?: string }> = ({ userId }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const tutorialRef = useRef<HTMLDivElement>(null);

    const storageKey = userId ? `tutorial_completed_${userId}` : 'tutorial_completed_guest';

    useEffect(() => {
        // Force reset for this update so the user sees the new tutorial content
        const lastVersion = localStorage.getItem('tutorial_version');
        const currentVersion = '2.3'; // New 8-step version with auto-navigation

        if (lastVersion !== currentVersion) {
            localStorage.setItem('tutorial_version', currentVersion);
            // We don't necessarily want to wipe all user tutorial states, 
            // but we want to make sure the current one is triggered if it's the first time for this version.
            setCurrentStepIndex(0);
        } else {
            const isCompleted = localStorage.getItem(storageKey);
            if (!isCompleted) {
                setCurrentStepIndex(0);
            }
        }

        // Expose restart function globally (used in Layout.tsx)
        (window as any).restartTutorial = () => {
            localStorage.removeItem(storageKey);
            setCurrentStepIndex(0);
        };
    }, [userId, storageKey]);

    useEffect(() => {
        if (currentStepIndex === null) return;
        const step = STEPS[currentStepIndex];
        if (step.path && location.pathname !== step.path && !location.pathname.startsWith(step.path)) {
            navigate(step.path);
        }
    }, [currentStepIndex, location.pathname, navigate]);

    useEffect(() => {
        if (currentStepIndex === null) return;
        const step = STEPS[currentStepIndex];

        const updatePosition = () => {
            if (step.targetId) {
                const el = document.getElementById(step.targetId);
                if (el) {
                    setTargetRect(el.getBoundingClientRect());
                    // Auto-scroll the element into view so the tutorial box is visible
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    setTargetRect(null);
                }
            } else {
                setTargetRect(null);
            }
        };

        // Small delay to allow for page transitions and rendering
        const timeoutId = setTimeout(updatePosition, 300); // More generous delay for navigation
        window.addEventListener('scroll', updatePosition);
        window.addEventListener('resize', updatePosition);
        const interval = setInterval(updatePosition, 500);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('scroll', updatePosition);
            window.removeEventListener('resize', updatePosition);
            clearInterval(interval);
        };
    }, [currentStepIndex, location.pathname]);

    const handleNext = () => {
        if (currentStepIndex === null) return;
        if (isStepBlocked()) return; // Don't proceed if blocked

        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            handleSkip();
        }
    };

    const isStepBlocked = () => {
        if (currentStepIndex === null) return false;
        const step = STEPS[currentStepIndex];

        // No steps currently blocked in the updated version
        return false;
    };

    const handleSkip = () => {
        setCurrentStepIndex(null);
        localStorage.setItem(storageKey, 'true');
    };

    if (currentStepIndex === null || !STEPS[currentStepIndex]) {
        // Safety reset if for some reason the index is out of bounds (e.g. after shortening STEPS)
        if (currentStepIndex !== null && currentStepIndex >= STEPS.length) {
            handleSkip();
        }
        return null;
    }

    const currentStep = STEPS[currentStepIndex];

    return (
        <div className="fixed inset-0 z-[1000] pointer-events-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStepIndex}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    style={{
                        position: 'fixed',
                        left: targetRect ? targetRect.left + targetRect.width / 2 : '50%',
                        top: targetRect ? targetRect.top - 20 : '50%',
                        transform: targetRect ? 'translate(-50%, -100%)' : 'translate(-50%, -50%)',
                    }}
                    className="pointer-events-auto"
                >
                    <div className="relative w-80 p-8 glass rounded-[2.5rem] premium-shadow space-y-6">
                        <header className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
                                    <Sparkles size={12} className="text-white" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">Step {currentStepIndex + 1} of {STEPS.length}</span>
                            </div>
                            <button
                                onClick={handleSkip}
                                className="p-1 hover:bg-black/5 rounded-full transition-colors text-black/40 hover:text-black"
                                title="Skip Tutorial"
                            >
                                <X size={14} />
                            </button>
                        </header>

                        <div className="space-y-4">
                            <h3 className="text-2xl font-serif text-black">{currentStep.title}</h3>
                            <p className="text-sm font-serif text-black/60 leading-relaxed italic">"{currentStep.content}"</p>
                        </div>

                        <footer className="flex items-center justify-between pt-4">
                            <button
                                onClick={handleSkip}
                                className="text-[9px] font-bold uppercase tracking-widest text-black/30 hover:text-black transition-colors"
                            >
                                Skip
                            </button>
                            <div className="flex flex-col items-end gap-2">
                                {isStepBlocked() && (
                                    <span className="text-[8px] font-bold text-red-400 uppercase tracking-widest animate-pulse">
                                        Action Required
                                    </span>
                                )}
                                <button
                                    onClick={handleNext}
                                    disabled={isStepBlocked()}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${isStepBlocked()
                                        ? 'bg-black/10 text-black/20 cursor-not-allowed'
                                        : 'bg-black text-white hover:scale-[1.02] active:scale-[0.98]'
                                        }`}
                                >
                                    {currentStepIndex === STEPS.length - 1 ? 'Finish' : 'Continue'}
                                    <ChevronRight size={12} />
                                </button>
                            </div>
                        </footer>

                        {/* Arrow */}
                        {targetRect && (
                            <div
                                className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[8px]"
                                style={{
                                    width: 0,
                                    height: 0,
                                    borderLeft: '12px solid transparent',
                                    borderRight: '12px solid transparent',
                                    borderTop: '12px solid rgba(255, 255, 255, 0.7)',
                                    filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.05))',
                                    backdropFilter: 'blur(24px)'
                                }}
                            />
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Dim Overlay - Subtle */}
            <div className="absolute inset-0 bg-black/[0.02] backdrop-blur-[1px] -z-10" />
        </div>
    );
};
