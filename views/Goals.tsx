import React, { useState } from 'react';
import { Plus, X, Zap, Check, SparklesBold as Sparkles } from '../lib/icons';
import { UserGoal } from '../types';
import { auditGoal } from '../services/geminiService';
import { DogBuddy } from '../components/DogBuddy';

interface GoalsProps {
  goals: UserGoal[];
  onUpdateGoals: (goals: UserGoal[]) => void;
}

export const Goals: React.FC<GoalsProps> = ({ goals, onUpdateGoals }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [step, setStep] = useState(1);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditFeedback, setAuditFeedback] = useState<{ isSmart: boolean, feedback: string, suggestions: string[] } | null>(null);

  // Questionnaire State
  const [newTitle, setNewTitle] = useState('');
  const [isNumerical, setIsNumerical] = useState(false);
  const [targetNumber, setTargetNumber] = useState(0);
  const [unit, setUnit] = useState('');
  const [newCategory, setNewCategory] = useState<'Health' | 'Career' | 'Personal' | 'Finance'>('Personal');
  const [newTerm, setNewTerm] = useState<'Day' | 'Month' | 'Year'>('Month');

  // SMART State
  const [smartSpecific, setSmartSpecific] = useState('');
  const [smartTimeBound, setSmartTimeBound] = useState('');

  const resetForm = () => {
    setStep(1);
    setNewTitle('');
    setIsNumerical(false);
    setTargetNumber(0);
    setUnit('');
    setSmartSpecific('');
    setSmartTimeBound('');
    setIsAdding(false);
    setAuditFeedback(null);
  };

  const addGoal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTitle) return;

    const goal: any = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCategory,
      term: newTerm,
      targetDate: smartTimeBound || new Date().toISOString().split('T')[0],
      progress: 0,
      specific: smartSpecific,
      isNumerical,
      targetNumber: isNumerical ? targetNumber : undefined,
      currentNumber: isNumerical ? 0 : undefined,
      unit: isNumerical ? unit : undefined
    };

    onUpdateGoals([...goals, goal]);
    resetForm();
  };

  const deleteGoal = (id: string) => {
    onUpdateGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div id="goals-container" className="min-h-screen p-6 pb-32 max-w-2xl mx-auto space-y-12 animate-fade-in font-sans">
      {/* Header */}
      <header className="pt-8 flex flex-col items-center text-center space-y-6">
        <DogBuddy mood="happy" size={140} className="drop-shadow-xl" />
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="space-y-1">
            <h1 className="text-4xl font-serif text-[var(--text-primary)]">Primary Targets</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500/40">Declare your cosmic intentions.</p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="px-8 py-3 bg-blue-500 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus size={14} /> New Target
          </button>
        </div>
      </header>

      {/* Goals List */}
      <div className="space-y-12">
        {goals.map((goal: any) => (
          <div key={goal.id} className="space-y-6 group bg-white p-8 rounded-[3rem] border border-gray-50 shadow-sm hover:border-blue-100 transition-all">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-500/60 bg-blue-50 px-3 py-1 rounded-full">{goal.category}</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300">{goal.term}ly Mission</span>
                </div>
                <h3 className="text-3xl font-serif text-[var(--text-primary)] leading-tight">{goal.title}</h3>
              </div>
              <button onClick={() => deleteGoal(goal.id)} className="p-2 text-gray-100 hover:text-red-400 transition-all">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Phase Completion</span>
                <span className="text-2xl font-serif text-blue-500">{goal.progress}%</span>
              </div>
              <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden shadow-inner p-0.5">
                <div
                  className="h-full bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-1000 ease-out"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>

            {goal.isNumerical && (
              <div className="flex items-center gap-8 pt-4 border-t border-gray-50">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Current Depth</p>
                  <p className="text-2xl font-serif text-[var(--text-primary)]">{goal.currentNumber || 0}</p>
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div className="space-y-1">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Target Altitude</p>
                  <p className="text-2xl font-serif text-[var(--text-primary)]">{goal.targetNumber} <span className="text-sm font-sans font-bold text-gray-300 uppercase ml-1">{goal.unit}</span></p>
                </div>
              </div>
            )}
          </div>
        ))}

        {goals.length === 0 && (
          <div className="py-24 text-center bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[3rem]">
            <p className="text-sm font-serif text-gray-300 italic">The stars are waiting for your coordinates, Buddy!</p>
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/95 backdrop-blur-md">
          <div className="w-full max-w-sm space-y-12 animate-in fade-in zoom-in-95">
            <header className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-500/20">
                <Zap size={24} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Target Matrix: Step {step} of 3</span>
                <h2 className="text-4xl font-serif">{step === 1 ? 'Primary Vision' : step === 2 ? 'Mission Detail' : 'Final Audit'}</h2>
              </div>
            </header>

            <div className="space-y-8 min-h-[300px]">
              {step === 1 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                  <div className="text-center space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Target Identifier</span>
                    <input
                      autoFocus
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="What is the mission?"
                      className="w-full bg-transparent text-3xl font-serif border-none outline-none placeholder:text-gray-100 text-center"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Personal', 'Health', 'Career', 'Finance'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setNewCategory(cat as any)}
                        className={`px-6 py-2 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all ${newCategory === cat ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="text-center space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Mission Parameters</span>
                    <textarea
                      autoFocus
                      value={smartSpecific}
                      onChange={(e) => setSmartSpecific(e.target.value)}
                      placeholder="Describe the target altitude in detail..."
                      className="w-full bg-transparent text-xl font-serif border-none outline-none placeholder:text-gray-100 min-h-[140px] resize-none text-center italic"
                    />
                  </div>

                  <div className="flex flex-col items-center gap-6 p-6 bg-gray-50 rounded-[2rem]">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Numerical Telemetry?</span>
                      <button onClick={() => setIsNumerical(!isNumerical)} className={`w-12 h-6 rounded-full transition-all relative ${isNumerical ? 'bg-blue-500' : 'bg-gray-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${isNumerical ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                    {isNumerical && (
                      <div className="flex gap-4 justify-center">
                        <input type="number" placeholder="Target" onChange={e => setTargetNumber(parseInt(e.target.value))} className="w-20 bg-white shadow-sm p-3 rounded-xl text-lg font-serif text-center outline-none text-blue-600" />
                        <input type="text" placeholder="Unit" onChange={e => setUnit(e.target.value)} className="w-24 bg-white shadow-sm p-3 rounded-xl text-lg font-serif text-center outline-none text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 text-center block">Target Timeframe</span>
                    <div className="flex gap-3 justify-center">
                      {['Day', 'Month', 'Year'].map(t => (
                        <button
                          key={t}
                          onClick={() => setNewTerm(t as any)}
                          className={`flex-1 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${newTerm === t ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}
                        >
                          {t}ly
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Absolute Deadline</span>
                    <input type="date" value={smartTimeBound} onChange={e => setSmartTimeBound(e.target.value)} className="w-full bg-gray-50 p-4 rounded-2xl text-xl font-serif outline-none border-none text-blue-600 text-center" />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <DogBuddy mood={auditFeedback?.isSmart ? 'excited' : 'thinking'} size={100} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500/40">Buddy SMART Telemetry</span>
                  </div>

                  {isAuditing ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-6">
                      <div className="w-12 h-12 border-4 border-blue-50 border-t-blue-500 rounded-full animate-spin" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500/40 animate-pulse">Calculating Trajectory...</p>
                    </div>
                  ) : auditFeedback ? (
                    <div className="space-y-8">
                      <div className={`p-8 rounded-[2.5rem] border ${auditFeedback.isSmart ? 'bg-blue-50/30 border-blue-100' : 'bg-orange-50/30 border-orange-100'}`}>
                        <p className="text-lg font-serif italic text-[var(--text-primary)] leading-relaxed">"{auditFeedback.feedback}"</p>
                      </div>

                      {auditFeedback.suggestions.length > 0 && (
                        <div className="space-y-4 text-left">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 ml-4">Buddy's Advice</span>
                          <div className="space-y-3">
                            {auditFeedback.suggestions.map((s, i) => (
                              <div key={i} className="flex gap-4 p-4 bg-gray-50/50 rounded-2xl text-sm font-serif text-gray-600 italic">
                                <span className="text-blue-500">★</span>
                                {s}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm font-serif text-gray-300 italic">Telemetry failed. Mission at your own risk.</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 pt-12">
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !newTitle}
                  className="w-full py-5 bg-black text-white rounded-3xl font-bold uppercase tracking-widest shadow-2xl active:scale-[0.98] disabled:opacity-50"
                >
                  Confirm Coordinates
                </button>
              ) : step === 3 ? (
                <button
                  onClick={async () => {
                    setStep(4);
                    setIsAuditing(true);
                    const result = await auditGoal(newTitle, smartSpecific);
                    if (result) setAuditFeedback(result);
                    setIsAuditing(false);
                  }}
                  className="w-full py-5 bg-blue-500 text-white rounded-3xl font-bold uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-[0.98]"
                >
                  Run Buddy Audit
                </button>
              ) : (
                <button
                  onClick={() => addGoal()}
                  className="w-full py-5 bg-black text-white rounded-3xl font-bold uppercase tracking-widest shadow-2xl active:scale-[0.98]"
                >
                  Finalize Mission
                </button>
              )}

              <button
                onClick={step > 1 ? () => { setStep(step === 4 ? 3 : step - 1); setAuditFeedback(null); } : resetForm}
                className="text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-black transition-colors"
              >
                {step > 1 ? 'Go Back' : 'Abort Mission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
