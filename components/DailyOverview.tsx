import React from 'react';
import { CheckCircle2, TrendingUp, Zap, Star, ArrowRight, X } from 'lucide-react';
import { DailyRecord, CalendarEvent } from '../types';

interface DailyOverviewProps {
    record: DailyRecord;
    events: CalendarEvent[];
    onClose: () => void;
}

export const DailyOverview: React.FC<DailyOverviewProps> = ({ record, events, onClose }) => {
    const completedEvents = events.filter(e => e.completed);
    const totalEvents = events.length;
    const completionRate = totalEvents > 0 ? Math.round((completedEvents.length / totalEvents) * 100) : 0;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#FDFCFB]/98 backdrop-blur-2xl animate-in fade-in duration-700">
            <div className="w-full max-w-2xl bg-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] rounded-[3rem] border border-black/5 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Audit Header */}
                <div className="p-12 border-b border-black/[0.03] flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600">Confidential Audit</span>
                        <h2 className="text-4xl font-serif text-black -tracking-wide">Executive Summary</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-black/5 rounded-full transition-colors text-black/20 hover:text-black"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-12 space-y-16 scrollbar-none">
                    {/* The Verdict */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${record.didTodayCount ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                                Verdict: {record.didTodayCount ? 'Mission Success' : 'Potential Waste'}
                            </div>
                            <div className="h-px flex-1 bg-black/[0.05]" />
                        </div>

                        <div className="grid grid-cols-2 gap-12">
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">Momentum Realized</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-7xl font-serif tracking-tighter">{record.productivityScore || 0}</span>
                                    <span className="text-sm font-bold text-emerald-600">PTS</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">Operations Secured</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-7xl font-serif tracking-tighter text-black/20">{completionRate}%</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* AI Logic Roast/Audit */}
                    <section className="glass p-10 rounded-[2.5rem] space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                            <Zap size={100} />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">The Audit (Fetch AI)</span>
                            <div className="h-px w-12 bg-black/10" />
                        </div>
                        <p className="text-2xl font-serif leading-relaxed text-black/80 relative z-10 italic">
                            "{record.report || "No analysis generated. Your results speak for themselves."}"
                        </p>
                    </section>

                    {/* Operational Breakdown */}
                    <section className="space-y-8">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">Metric Violations & Wins</span>
                            <span className="text-[10px] font-bold text-black/20">{completedEvents.length}/{totalEvents} Blocks</span>
                        </div>
                        <div className="space-y-3">
                            {events.map((event, i) => (
                                <div key={i} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${event.completed ? 'bg-emerald-50/30 border-emerald-100/50' : 'bg-red-50/10 border-red-100/20 opacity-40'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={event.completed ? 'text-emerald-500' : 'text-red-300'}>
                                            {event.completed ? <CheckCircle2 size={18} /> : <X size={18} />}
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-serif text-black">{event.title}</p>
                                            <p className="text-[8px] font-bold uppercase tracking-widest text-black/20">{event.start}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[8px] font-bold uppercase tracking-widest ${event.completed ? 'text-emerald-600/40' : 'text-red-400/40'}`}>
                                        {event.completed ? 'Verified' : 'Breach'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Audit Footer */}
                <div className="p-12 bg-black/[0.02] border-t border-black/[0.03]">
                    <button
                        onClick={onClose}
                        className="w-full py-6 bg-black text-white rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all flex items-center justify-center gap-4 shadow-xl"
                    >
                        <span>Acknowledge & Close Audit</span>
                        <ArrowRight size={14} />
                    </button>
                    <p className="text-center mt-6 text-[8px] font-bold uppercase tracking-widest text-black/10 italic">
                        "Go Fetch is not a safe space for excuses. It is a command center for results."
                    </p>
                </div>
            </div>
        </div>
    );
};
