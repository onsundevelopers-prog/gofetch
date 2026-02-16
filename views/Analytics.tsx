import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, CartesianGrid } from 'recharts';
import { DailyRecord } from '../types';
import { Lock } from 'lucide-react';

interface AnalyticsProps {
  history: DailyRecord[];
  user: any;
}

export const Analytics: React.FC<AnalyticsProps> = ({ history, user }) => {
  const chartData = history.length > 0
    ? [...history].reverse().map(r => ({
      name: r.date.split('-')[2],
      score: r.score || r.productivityScore || 0
    }))
    : Array.from({ length: 7 }, (_, i) => ({
      name: String(i + 1),
      score: 0
    }));

  const avgScore = history.length > 0
    ? Math.round(history.reduce((acc, r) => acc + (r.score || r.productivityScore || 0), 0) / history.length)
    : 0;

  return (
    <div className="min-h-screen p-6 pb-32 max-w-xl mx-auto space-y-16">
      {/* Header */}
      <header className="pt-12 space-y-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif text-black -tracking-wide">Trends</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/20">Your progress over time</p>
        </div>

        {/* Simple Instructions */}
        <div className="p-4 bg-black/[0.01] border-l-2 border-black/5">
          <p className="text-xs font-serif text-black/40 leading-relaxed italic">
            Analyze your momentum flux to see where you're excelling and where you can improve.
          </p>
        </div>
      </header>

      {/* Primary Metrics */}
      <section className="grid grid-cols-2 gap-12 border-b border-black/5 pb-12">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20">Average Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-serif text-black tracking-tighter">{avgScore}</span>
            <span className="text-xs font-bold text-[var(--accent)]">Stable</span>
          </div>
        </div>
        <div className="text-right space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/20">Potential Target</span>
          <div className="flex items-baseline gap-2 justify-end">
            <span className="text-3xl font-serif text-black/30">{Math.max(avgScore + 15, 88)}</span>
          </div>
        </div>
      </section>

      {/* Chart */}
      <section className="space-y-8">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 text-center">Growth Chart</h2>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#000" stopOpacity={0.03} />
                  <stop offset="100%" stopColor="#000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#000" vertical={false} strokeOpacity={0.05} />
              <XAxis
                dataKey="name"
                stroke="transparent"
                tick={{ fontSize: 9, fontWeight: 'bold', fill: 'rgba(0,0,0,0.2)' }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#000"
                strokeWidth={2}
                fill="url(#scoreGradient)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Reflection History */}
      {history.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">Past Reflections</h2>
          <div className="space-y-4">
            {history.slice(0, 5).map((record, i) => (
              <div key={i} className="flex items-start justify-between py-6 border-b border-black/[0.03] group">
                <div className="space-y-2 flex-1 pr-8">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/20">
                      {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600/60">Verified</span>
                  </div>
                  <p className="text-sm font-serif text-black/60 italic leading-relaxed group-hover:text-black transition-colors">
                    "{record.reflection || "No data logged."}"
                  </p>
                </div>
                <div className="text-2xl font-serif text-black/10 group-hover:text-black transition-colors">
                  {record.score || record.productivityScore}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
