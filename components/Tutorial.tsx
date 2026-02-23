import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, SparklesBold as Sparkles } from '../lib/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { DogBuddy } from './DogBuddy';

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
        title: "Welcome to Antigravity",
        content: "Woof! I'm Buddy. I'm here to help you defy inertia and reach for the stars. Let's start our mission together!",
        path: "/",
        targetId: "momentum-orb-card"
    },
    {
        id: 2,
        title: "The Momentum Orb",
        content: "This orb shows our current flight velocity. High scores mean we're breaking free from gravity!",
        targetId: "momentum-orb-card",
        path: "/"
    },
    {
        id: 3,
        title: "Mission Journal",
        content: "Record your daily flight data here. It helps me calculate our trajectory and prepare tomorrow's flight path.",
        targetId: "reflection-section",
        path: "/standards"
    },
    {
        id: 4,
        title: "Calculate Trajectory",
        content: "Click 'Check Score' once you've logged your journal. I'll audit our progress and award micro-wins!",
        targetId: "audit-button",
        path: "/standards"
    },
    {
        id: 5,
        title: "Flight Path",
        content: "Once we check our score, your hourly schedule for tomorrow is ready here. Stick to the coordinates!",
        targetId: "lock-plan-button",
        path: "/plan"
    },
    {
        id: 6,
        title: "Daily Vitals",
        content: "These are our non-negotiables. Check them off as we fetch them. Small wins lead to big missions!",
        targetId: "habits-section",
        path: "/standards"
    },
    {
        id: 7,
        title: "Primary Targets",
        content: "These are your cosmic goals. We bridge the gap between where we are and where we want to be.",
        targetId: "goals-container",
        path: "/goals"
    },
    {
        id: 8,
        title: "Ready for Lift-off",
        content: "You're all set, Buddy! Remember: Journal -> Audit -> Follow Path. Let's go and defy gravity!",
        path: "/"
    }
];

export const Tutorial: React.FC<{ userId?: string }> = ({ userId }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const storageKey = userId ? `tutorial_completed_${userId}` : 'tutorial_completed_guest';

    useEffect(() => {
        const lastVersion = localStorage.getItem('tutorial_version');
        const currentVersion = '3.0'; // Rebranded version

        if (lastVersion !== currentVersion) {
            localStorage.setItem('tutorial_version', currentVersion);
            setCurrentStepIndex(0);
        } else {
            const isCompleted = localStorage.getItem(storageKey);
            if (!isCompleted) {
                setCurrentStepIndex(0);
            }
        }

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
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    setTargetRect(null);
                }
            } else {
                setTargetRect(null);
            }
        };

        const timeoutId = setTimeout(updatePosition, 500);
        window.addEventListener('scroll', updatePosition);
        window.addEventListener('resize', updatePosition);
        const interval = setInterval(updatePosition, 1000);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('scroll', updatePosition);
            window.removeEventListener('resize', updatePosition);
            clearInterval(interval);
        };
    }, [currentStepIndex, location.pathname]);

    const handleNext = () => {
        if (currentStepIndex === null) return;
        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            handleSkip();
        }
    };

    const handleSkip = () => {
        setCurrentStepIndex(null);
        localStorage.setItem(storageKey, 'true');
    };

    if (currentStepIndex === null || !STEPS[currentStepIndex]) return null;

    const currentStep = STEPS[currentStepIndex];

    return (
        <AnimatePresence>
            {currentStepIndex !== null && STEPS[currentStepIndex] && (
                <div className="fixed inset-0 z-[1000] pointer-events-none flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-[4px] pointer-events-auto"
                        onClick={handleSkip}
                    />

                    <motion.div
                        key={currentStepIndex}
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        style={{
                            position: targetRect ? 'fixed' : 'relative',
                            left: targetRect ? targetRect.left + targetRect.width / 2 : 'auto',
                            top: targetRect ? targetRect.top - 40 : 'auto',
                            transform: targetRect ? 'translate(-50%, -100%)' : 'none',
                        }}
                        className="pointer-events-auto z-10"
                    >
                        <div className="relative w-[22rem] p-10 bg-white rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-blue-50 space-y-8 flex flex-col items-center text-center">
                            <DogBuddy mood={(currentStepIndex === 0 || currentStepIndex === 7) ? 'excited' : 'happy'} size={100} className="drop-shadow-lg" />

                            <header className="flex flex-col items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500/60">Protocol {currentStepIndex + 1} of {STEPS.length}</span>
                            </header>

                            <div className="space-y-4">
                                <h3 className="text-3xl font-serif text-[var(--text-primary)] leading-tight">{currentStep.title}</h3>
                                <p className="text-base font-serif text-gray-500 leading-relaxed italic">"{currentStep.content}"</p>
                            </div>

                            <footer className="flex flex-col gap-6 w-full pt-4">
                                <button
                                    onClick={handleNext}
                                    className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-bold uppercase tracking-widest shadow-2xl shadow-blue-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 hover:bg-blue-700"
                                >
                                    {currentStepIndex === STEPS.length - 1 ? 'Start Mission 🚀' : 'Next Protocol'}
                                    <ChevronRight size={18} />
                                </button>

                                <button
                                    onClick={handleSkip}
                                    className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors py-2"
                                >
                                    Skip Onboarding
                                </button>
                            </footer>

                            {/* Arrow */}
                            {targetRect && (
                                <div
                                    className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[12px]"
                                    style={{
                                        width: 0,
                                        height: 0,
                                        borderLeft: '16px solid transparent',
                                        borderRight: '16px solid transparent',
                                        borderTop: '16px solid white',
                                    }}
                                />
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
    );
};
