
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ONBOARDING_STEPS, OnboardingStep } from '../lib/onboardingSteps';
import { X, ChevronRight, Info } from 'lucide-react';

interface OnboardingTutorialProps {
    planEventsCount: number;
    goalsCount: number;
    onComplete: () => void;
    onSkip: () => void;
    isActive: boolean;
    currentStepIndex: number;
    setCurrentStepIndex: (index: number) => void;
}

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({
    planEventsCount,
    goalsCount,
    onComplete,
    onSkip,
    isActive,
    currentStepIndex,
    setCurrentStepIndex
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [bubblePosition, setBubblePosition] = useState({ top: 0, left: 0, opacity: 0 });
    const [arrowSide, setArrowSide] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');
    const bubbleRef = useRef<HTMLDivElement>(null);

    const step = ONBOARDING_STEPS[currentStepIndex];

    useEffect(() => {
        if (!isActive || !step) return;

        // Handle navigation
        if (step.path && location.pathname !== step.path) {
            navigate(step.path);
        }

        // Handle positioning
        const updatePosition = () => {
            if (!step.target) {
                setBubblePosition({ top: window.innerHeight / 2 - 100, left: window.innerWidth / 2 - 150, opacity: 1 });
                return;
            }

            const el = document.querySelector(step.target);
            if (el) {
                const rect = el.getBoundingClientRect();
                const bubble = bubbleRef.current;
                if (!bubble) return;

                const bRect = bubble.getBoundingClientRect();

                let top = rect.top - bRect.height - 20;
                let left = rect.left + rect.width / 2 - bRect.width / 2;
                let side: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

                if (top < 20) {
                    top = rect.bottom + 20;
                    side = 'top';
                }

                // Keep in bounds
                left = Math.max(20, Math.min(window.innerWidth - bRect.width - 20, left));

                setBubblePosition({ top, left, opacity: 1 });
                setArrowSide(side);
            } else {
                // Fallback to center if element not found (e.g. during transition)
                setBubblePosition({ top: window.innerHeight / 2 - 100, left: window.innerWidth / 2 - 150, opacity: 1 });
            }
        };

        const timer = setTimeout(updatePosition, 300); // Wait for navigation/render
        window.addEventListener('resize', updatePosition);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isActive, step, location.pathname, navigate]);

    if (!isActive || !step) return null;

    const isActionRequired = step.requiredAction ? !step.requiredAction({ planEventsCount, goalsCount }) : false;

    const handleContinue = () => {
        if (isActionRequired) return;

        if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="fixed inset-0 z-[200] pointer-events-none">
            {/* Dimmed background only for non-targeted steps or action-required steps */}
            {!step.target && <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />}

            <div
                ref={bubbleRef}
                style={{
                    top: bubblePosition.top,
                    left: bubblePosition.left,
                    opacity: bubblePosition.opacity,
                }}
                className="absolute w-[300px] pointer-events-auto transition-all duration-500 ease-out"
            >
                <div className="relative bg-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-black/5 animate-in fade-in zoom-in duration-300">
                    {/* Arrow */}
                    {step.target && (
                        <div
                            className={`absolute w-4 h-4 bg-white border-black/5 transform rotate-45 
              ${arrowSide === 'bottom' ? 'bottom-[-8px] left-1/2 -translate-x-1/2 border-r border-b' : ''}
              ${arrowSide === 'top' ? 'top-[-8px] left-1/2 -translate-x-1/2 border-l border-t' : ''}
              `}
                        />
                    )}

                    <div className="space-y-4">
                        <header className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-black">
                                    C
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-20">Step {currentStepIndex + 1}/12</span>
                            </div>
                            <button
                                onClick={onSkip}
                                className="p-1 hover:bg-black/5 rounded-full transition-colors opacity-20 hover:opacity-100"
                            >
                                <X size={14} />
                            </button>
                        </header>

                        <div className="space-y-2">
                            <h3 className="text-xl font-serif font-black leading-tight">{step.title}</h3>
                            <p className="text-xs text-black/60 leading-relaxed">{step.description}</p>
                        </div>

                        {isActionRequired && (
                            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-100 animate-pulse">
                                <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] font-bold text-amber-700 leading-tight">
                                    {step.actionHint || 'Action required to continue.'}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col gap-2 pt-2">
                            <button
                                onClick={handleContinue}
                                disabled={isActionRequired}
                                className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2
                  ${isActionRequired
                                        ? 'bg-black/5 text-black/20 cursor-not-allowed'
                                        : 'bg-black text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10'
                                    }`}
                            >
                                {currentStepIndex === ONBOARDING_STEPS.length - 1 ? 'Finish' : 'Continue'}
                                <ChevronRight size={14} />
                            </button>

                            <button
                                onClick={onSkip}
                                className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-black/20 hover:text-black transition-colors"
                            >
                                Skip Tutorial
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
