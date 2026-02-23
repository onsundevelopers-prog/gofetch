import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, CartesianGrid } from 'recharts';
import { DailyRecord } from '../types';
import { SparklesBold as Sparkles, BarChart2 } from '../lib/icons';
import { DogBuddy } from '../components/DogBuddy';

interface AnalyticsProps {
  history: DailyRecord[];
  user: any;
}

export const Analytics: React.FC<AnalyticsProps> = ({ history, user }) => {
  const chartData = history.length > 0
    ? [...history].reverse().map(r => ({
      name: r.date && r.date.includes('-') ? r.date.split('-')[2] : '?',
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
    <div className="min-h-screen p-6 pb-32 max-w-2xl mx-auto space-y-12 animate-fade-in font-sans">
      {/* Header */}
      <header className="pt-8 flex flex-col items-center text-center space-y-6">
        <DogBuddy mood="happy" size={140} className="drop-shadow-xl" />
        <div className="space-y-1">
          <h1 className="text-4xl font-serif text-[var(--text-primary)]">Signals</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500/40">Analyzing your flight data.</p>
        </div>
      </header>

      {/* Primary Metrics */}
      <section className="grid grid-cols-2 gap-8 bg-white p-8 rounded-[3rem] border border-gray-50 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <BarChart2 size={120} />
        </div>

        <div className="space-y-2 relative">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">Mean Velocity</span>
          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-serif text-[var(--text-primary)] tracking-tighter">{avgScore}</span>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Stable</span>
          </div>
        </div>
        <div className="text-right space-y-2 relative">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">Next Peak</span>
          <div className="flex items-baseline gap-2 justify-end">
            <span className="text-4xl font-serif text-gray-200">{Math.max(avgScore + 12, 90)}</span>
          </div>
        </div>
      </section>

      {/* Chart */}
      <section className="space-y-8 bg-white p-8 rounded-[3rem] border border-gray-50 shadow-sm">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Momentum Flux</h2>
          <Sparkles size={16} className="text-blue-500/40" />
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="10 10" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9CA3AF' }}
                dy={10}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#3B82F6"
                strokeWidth={4}
                fill="url(#scoreGradient)"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Reflection History */}
      {history.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Flight Archive</h2>
          </div>

          <div className="space-y-4">
            {history.slice(0, 5).map((record, i) => (
              <div key={i} className="flex items-start justify-between p-8 bg-white rounded-[2.5rem] border border-gray-50 hover:border-blue-100 transition-all group shadow-sm">
                <div className="space-y-3 flex-1 pr-8">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500/40">
                      {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-blue-500/20" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500/60 bg-emerald-50 px-2 py-0.5 rounded-full">Verified</span>
                  </div>
                  <p className="text-base font-serif text-gray-500 italic leading-relaxed group-hover:text-[var(--text-primary)] transition-colors">
                    "{record.reflection || "No data logged."}"
                  </p>
                </div>
                <div className="text-4xl font-serif text-gray-100 group-hover:text-blue-500 transition-all duration-500 tabular-nums">
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
