import React, { useState } from 'react';
import { Plus, X, Zap, Sparkles, Check } from 'lucide-react';
import { UserGoal } from '../types';
import { auditGoal } from '../services/geminiService';

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
  const [smartMeasurable, setSmartMeasurable] = useState('');
  const [smartAchievable, setSmartAchievable] = useState('');
  const [smartRelevant, setSmartRelevant] = useState('');
  const [smartTimeBound, setSmartTimeBound] = useState('');

  const resetForm = () => {
    setStep(1);
    setNewTitle('');
    setIsNumerical(false);
    setTargetNumber(0);
    setUnit('');
    setSmartSpecific('');
    setSmartMeasurable('');
    setSmartAchievable('');
    setSmartRelevant('');
    setSmartTimeBound('');
    setIsAdding(false);
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
      measurable: smartMeasurable,
      achievable: smartAchievable,
      relevant: smartRelevant,
      timeBound: smartTimeBound,
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

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div id="goals-container" className="min-h-screen p-6 pb-32 max-w-xl mx-auto space-y-16">
      {/* Header */}
      <header className="pt-12 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-serif text-black -tracking-wide">Goals</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/20">Declare your long-term intentions</p>
          </div>
          <button
            id="add-goal-button"
            onClick={() => setIsAdding(true)}
            className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all transform active:scale-95"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Simple Instructions */}
        <div className="p-4 bg-black/[0.01] border-l-2 border-black/5 flex items-start gap-4">
          <p className="text-xs font-serif text-black/40 leading-relaxed italic">
            Focus on the long-term. Create specific goals with measurable targets to track your progress over months and years.
          </p>
        </div>
      </header>

      {/* Goals List */}
      <div className="space-y-16">
        {goals.map((goal: any) => (
          <div key={goal.id} className="space-y-6 group">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/20">{goal.category}</span>
                  <div className="w-1 h-1 rounded-full bg-black/5" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/20">{goal.term}ly</span>
                </div>
                <h3 className="text-3xl font-serif text-black leading-tight">{goal.title}</h3>
              </div>
              <button onClick={() => deleteGoal(goal.id)} className="opacity-0 group-hover:opacity-100 p-2 text-black/10 hover:text-red-400 transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/30">Velocity</span>
                <span className="text-sm font-serif">{goal.progress}%</span>
              </div>
              <div className="h-1 w-full bg-black/[0.03] rounded-full overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-1000"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>

            {goal.isNumerical && (
              <div className="flex items-center gap-6 pt-2">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-black/20">Current</p>
                  <p className="text-xl font-serif">{goal.currentNumber || 0}</p>
                </div>
                <div className="w-px h-8 bg-black/5" />
                <div className="space-y-1">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-black/20">Target</p>
                  <p className="text-xl font-serif">{goal.targetNumber} {goal.unit}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {goals.length === 0 && (
          <div className="py-32 text-center border border-dashed border-black/5 rounded-3xl">
            <p className="text-sm font-serif text-black/20 italic">No intentions set. Define your standard.</p>
          </div>
        )}
      </div>

      {/* Add Goal - Simplified Questionnaire */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/95 backdrop-blur-md">
          <div className="w-full max-w-sm space-y-12">
            <header className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">Step {step} of 3</span>
              <h2 className="text-4xl font-serif">{step === 1 ? 'Core Vision' : step === 2 ? 'Details' : 'Finalize'}</h2>
            </header>

            <div className="space-y-8">
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <input
                    autoFocus
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Goal Title"
                    className="w-full bg-transparent text-3xl font-serif border-none outline-none placeholder:text-black/5"
                  />
                  <div className="flex gap-4">
                    {['Personal', 'Health', 'Career', 'Finance'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setNewCategory(cat as any)}
                        className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${newCategory === cat ? 'bg-black text-white' : 'bg-black/5 text-black/30 hover:bg-black/10'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <textarea
                    autoFocus
                    value={smartSpecific}
                    onChange={(e) => setSmartSpecific(e.target.value)}
                    placeholder="Describe the desired outcome in detail."
                    className="w-full bg-transparent text-xl font-serif border-none outline-none placeholder:text-black/10 min-h-[120px] resize-none"
                  />
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">Track with numbers?</span>
                    <button onClick={() => setIsNumerical(!isNumerical)} className={`w-10 h-5 rounded-full transition-all relative ${isNumerical ? 'bg-black' : 'bg-black/10'}`}>
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isNumerical ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                  {isNumerical && (
                    <div className="flex gap-4">
                      <input type="number" placeholder="Value" onChange={e => setTargetNumber(parseInt(e.target.value))} className="w-24 bg-transparent border-b border-black text-xl font-serif outline-none" />
                      <input type="text" placeholder="Unit" onChange={e => setUnit(e.target.value)} className="flex-1 bg-transparent border-b border-black text-xl font-serif outline-none" />
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">Term</span>
                    <div className="flex gap-4">
                      {['Day', 'Month', 'Year'].map(t => (
                        <button
                          key={t}
                          onClick={() => setNewTerm(t as any)}
                          className={`flex-1 py-3 border rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${newTerm === t ? 'border-black bg-black text-white' : 'border-black/5 text-black/30'}`}
                        >
                          {t}ly
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">Deadline</span>
                    <input type="date" value={smartTimeBound} onChange={e => setSmartTimeBound(e.target.value)} className="w-full bg-transparent border-b border-black text-xl font-serif outline-none" />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3">
                    <Zap size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/30">Fetch AI SMART Audit</span>
                  </div>

                  {isAuditing ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4">
                      <div className="w-8 h-8 border-2 border-black/5 border-t-black rounded-full animate-spin" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/20 italic">Auditing Intention...</p>
                    </div>
                  ) : auditFeedback ? (
                    <div className="space-y-6">
                      <div className={`p-6 rounded-2xl border ${auditFeedback.isSmart ? 'bg-emerald-50/30 border-emerald-100' : 'bg-red-50/30 border-red-100'}`}>
                        <p className="text-lg font-serif italic text-black/80">"{auditFeedback.feedback}"</p>
                      </div>

                      {auditFeedback.suggestions.length > 0 && (
                        <div className="space-y-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">Recommendations</span>
                          <div className="space-y-2">
                            {auditFeedback.suggestions.map((s, i) => (
                              <div key={i} className="flex gap-3 text-sm font-serif text-black/60">
                                <span className="text-emerald-500">•</span>
                                {s}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm font-serif text-black/40 italic">Audit failed. Proceed with caution.</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-12">
              {step > 1 ? (
                <button onClick={() => setStep(step - 1)} className="text-[10px] font-bold uppercase tracking-widest text-black/30">Back</button>
              ) : (
                <button onClick={resetForm} className="text-[10px] font-bold uppercase tracking-widest text-black/30">Cancel</button>
              )}

              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !newTitle}
                  className="px-8 py-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-20"
                >
                  Continue
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
                  className="px-8 py-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
                >
                  Run AI Audit
                </button>
              ) : (
                <button
                  onClick={() => addGoal()}
                  className="px-8 py-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
                >
                  Complete Intention
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
