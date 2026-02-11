import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

interface PaywallProps {
    onClose: () => void;
    onUpgrade: (plan: string) => void;
}

export const Paywall: React.FC<PaywallProps> = ({ onClose, onUpgrade }) => {
    const [step, setStep] = useState<'hook' | 'trial'>('hook');

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-lg w-full"
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-50 transition-colors z-20"
                >
                    <X size={20} className="text-[var(--text-secondary)]" />
                </button>

                <AnimatePresence mode="wait">
                    {step === 'hook' && (
                        <motion.div
                            key="hook"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-12"
                        >
                            <h2 className="text-3xl font-light mb-4 leading-tight">
                                Unlock your full potential
                            </h2>

                            <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                                Get unlimited AI insights, advanced analytics, and personalized growth plans.
                            </p>

                            <div className="space-y-3 mb-10">
                                {[
                                    "Unlimited AI conversations",
                                    "Advanced analytics dashboard",
                                    "Personalized growth insights",
                                    "Priority support"
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                        <span className="text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setStep('trial')}
                                className="w-full bg-black text-white py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                            >
                                Continue
                                <ArrowRight size={18} />
                            </button>

                            <p className="text-center text-xs text-[var(--text-secondary)] mt-6">
                                Join thousands of mindful users
                            </p>
                        </motion.div>
                    )}

                    {step === 'trial' && (
                        <motion.div
                            key="trial"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-12"
                        >
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-light mb-3">30-Day Free Trial</h3>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    Experience everything. Cancel anytime.
                                </p>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="card flex justify-between items-center">
                                    <div>
                                        <div className="font-medium mb-1">Annual Plan</div>
                                        <div className="text-xs text-[var(--text-secondary)]">$10/month, billed yearly</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs bg-black text-white px-2 py-1 rounded-full mb-1">Best Value</div>
                                        <div className="font-medium">$120</div>
                                    </div>
                                </div>

                                <div className="card flex justify-between items-center opacity-60">
                                    <div>
                                        <div className="font-medium mb-1">Monthly Plan</div>
                                        <div className="text-xs text-[var(--text-secondary)]">Cancel anytime</div>
                                    </div>
                                    <div className="font-medium">$15</div>
                                </div>
                            </div>

                            <button
                                onClick={() => onUpgrade('premium')}
                                className="w-full bg-black text-white py-4 rounded-full font-medium hover:opacity-90 transition-opacity mb-4"
                            >
                                Start 30-Day Free Trial
                            </button>

                            <button
                                onClick={() => setStep('hook')}
                                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors w-full"
                            >
                                Back
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
