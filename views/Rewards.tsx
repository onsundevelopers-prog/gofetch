import React, { useState, useEffect } from 'react';
import { Trophy, Award, Flame, Target, Calendar, Zap } from 'lucide-react';
import { Reward } from '../types';

interface RewardsProps {
    user: any;
    history: any[];
}

export const Rewards: React.FC<RewardsProps> = ({ user, history }) => {
    const [rewards, setRewards] = useState<Reward[]>([]);

    useEffect(() => {
        // Calculate rewards based on user activity
        const newRewards: Reward[] = [];
        const now = Date.now();

        // Streak-based rewards
        if (user?.streak >= 3) {
            newRewards.push({
                id: 'streak-3',
                title: '3-Day Streak',
                description: 'Showed up 3 days in a row',
                type: 'streak',
                unlockedAt: now,
                icon: 'flame'
            });
        }
        if (user?.streak >= 7) {
            newRewards.push({
                id: 'streak-7',
                title: 'Week Warrior',
                description: '7 consecutive days of progress',
                type: 'streak',
                unlockedAt: now,
                icon: 'flame'
            });
        }
        if (user?.streak >= 30) {
            newRewards.push({
                id: 'streak-30',
                title: 'Monthly Master',
                description: '30 days of consistent action',
                type: 'streak',
                unlockedAt: now,
                icon: 'flame'
            });
        }

        // Score-based achievements
        if (user?.score >= 100) {
            newRewards.push({
                id: 'score-100',
                title: 'First Century',
                description: 'Reached 100 total points',
                type: 'achievement',
                unlockedAt: now,
                icon: 'trophy'
            });
        }
        if (user?.score >= 500) {
            newRewards.push({
                id: 'score-500',
                title: 'High Achiever',
                description: 'Accumulated 500 points',
                type: 'achievement',
                unlockedAt: now,
                icon: 'trophy'
            });
        }

        // Reflection-based badges
        const reflectionCount = history.filter(r => r.reflection && r.reflection.length > 50).length;
        if (reflectionCount >= 5) {
            newRewards.push({
                id: 'reflection-5',
                title: 'Deep Thinker',
                description: 'Wrote 5 meaningful reflections',
                type: 'badge',
                unlockedAt: now,
                icon: 'award'
            });
        }

        // High impact score days
        const highImpactDays = history.filter(r => r.impactScore >= 80).length;
        if (highImpactDays >= 3) {
            newRewards.push({
                id: 'impact-3',
                title: 'Impact Maker',
                description: '3 days with 80+ Impact Score',
                type: 'achievement',
                unlockedAt: now,
                icon: 'zap'
            });
        }

        setRewards(newRewards);
    }, [user, history]);

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'flame': return <Flame size={32} />;
            case 'trophy': return <Trophy size={32} />;
            case 'award': return <Award size={32} />;
            case 'zap': return <Zap size={32} />;
            case 'target': return <Target size={32} />;
            default: return <Award size={32} />;
        }
    };

    const upcomingRewards = [
        { title: 'Week Warrior', requirement: '7-day streak', current: user?.streak || 0, target: 7, icon: 'flame' },
        { title: 'Monthly Master', requirement: '30-day streak', current: user?.streak || 0, target: 30, icon: 'flame' },
        { title: 'High Achiever', requirement: '500 total points', current: user?.score || 0, target: 500, icon: 'trophy' },
    ].filter(r => r.current < r.target);

    return (
        <div className="min-h-screen p-6 pb-32 max-w-2xl mx-auto">
            {/* Header */}
            <header className="py-12">
                <h1 className="text-5xl font-serif mb-2">Rewards</h1>
                <p className="text-sm text-[var(--text-secondary)]">Celebrate your small wins</p>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-3 mb-12">
                <div className="card text-center">
                    <Trophy size={20} className="mx-auto mb-2 text-[var(--text-secondary)]" />
                    <p className="text-2xl font-serif mb-1">{rewards.length}</p>
                    <p className="text-xs text-[var(--text-secondary)]">Unlocked</p>
                </div>
                <div className="card text-center">
                    <Flame size={20} className="mx-auto mb-2 text-orange-500" />
                    <p className="text-2xl font-serif mb-1">{user?.streak || 0}</p>
                    <p className="text-xs text-[var(--text-secondary)]">Day Streak</p>
                </div>
                <div className="card text-center">
                    <Zap size={20} className="mx-auto mb-2 text-[var(--text-secondary)]" />
                    <p className="text-2xl font-serif mb-1">{user?.score || 0}</p>
                    <p className="text-xs text-[var(--text-secondary)]">Total Score</p>
                </div>
            </div>

            {/* Unlocked Rewards */}
            {rewards.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-base font-medium mb-4">Unlocked</h2>
                    <div className="space-y-3">
                        {rewards.map((reward) => (
                            <div key={reward.id} className="card badge-unlocked">
                                <div className="flex items-start gap-4">
                                    <div className="text-orange-600">
                                        {getIcon(reward.icon)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-medium mb-1">{reward.title}</h3>
                                        <p className="text-sm text-[var(--text-secondary)]">{reward.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Upcoming Rewards */}
            {upcomingRewards.length > 0 && (
                <section>
                    <h2 className="text-base font-medium mb-4">Coming Up</h2>
                    <div className="space-y-3">
                        {upcomingRewards.map((reward, i) => {
                            const progress = (reward.current / reward.target) * 100;
                            return (
                                <div key={i} className="card">
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className="text-[var(--text-secondary)] opacity-40">
                                            {getIcon(reward.icon)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-medium mb-1">{reward.title}</h3>
                                            <p className="text-sm text-[var(--text-secondary)]">{reward.requirement}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-[var(--text-secondary)]">Progress</span>
                                            <span className="font-medium">{reward.current} / {reward.target}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-black transition-all duration-300"
                                                style={{ width: `${Math.min(100, progress)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Empty State */}
            {rewards.length === 0 && (
                <div className="card text-center py-16">
                    <Trophy size={48} className="mx-auto mb-4 text-[var(--text-secondary)] opacity-20" />
                    <h3 className="text-lg font-medium mb-2">No rewards yet</h3>
                    <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
                        Keep showing up and taking action. Your first reward is just around the corner.
                    </p>
                </div>
            )}
        </div>
    );
};
