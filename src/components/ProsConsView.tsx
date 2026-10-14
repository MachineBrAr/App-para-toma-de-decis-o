import React, { useState } from 'react';
import { Check, Plus, ShieldAlert, Sparkles, TrendingUp, TrendingDown, Info, Tag } from 'lucide-react';
import { OptionAnalysis, ProItem, ConItem } from '../types/decision';

interface ProsConsViewProps {
  options: OptionAnalysis[];
  onOptionsChange: (updated: OptionAnalysis[]) => void;
  language: 'pt' | 'en';
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  options,
  onOptionsChange,
  language,
}) => {
  const [newProTexts, setNewProTexts] = useState<Record<string, string>>({});
  const [newConTexts, setNewConTexts] = useState<Record<string, string>>({});
  const [activeOptionTab, setActiveOptionTab] = useState<string>(options[0]?.id || '');

  // Toggle item enabled
  const toggleItem = (optionId: string, type: 'pros' | 'cons', itemId: string) => {
    const updated = options.map((opt) => {
      if (opt.id !== optionId) return opt;
      if (type === 'pros') {
        return {
          ...opt,
          pros: opt.pros.map((p) =>
            p.id === itemId ? { ...p, enabled: p.enabled === false ? true : false } : p
          ),
        };
      } else {
        return {
          ...opt,
          cons: opt.cons.map((c) =>
            c.id === itemId ? { ...c, enabled: c.enabled === false ? true : false } : c
          ),
        };
      }
    });
    onOptionsChange(updated);
  };

  // Add custom Pro
  const handleAddCustomPro = (optionId: string) => {
    const text = newProTexts[optionId]?.trim();
    if (!text) return;
    const updated = options.map((opt) => {
      if (opt.id !== optionId) return opt;
      const newPro: ProItem = {
        id: `custom_pro_${Date.now()}`,
        text,
        category: language === 'pt' ? 'Pessoal' : 'Personal',
        weight: 3,
        explanation: language === 'pt' ? 'Adicionado por você' : 'Added by you',
        enabled: true,
      };
      return { ...opt, pros: [...opt.pros, newPro] };
    });
    onOptionsChange(updated);
    setNewProTexts({ ...newProTexts, [optionId]: '' });
  };

  // Add custom Con
  const handleAddCustomCon = (optionId: string) => {
    const text = newConTexts[optionId]?.trim();
    if (!text) return;
    const updated = options.map((opt) => {
      if (opt.id !== optionId) return opt;
      const newCon: ConItem = {
        id: `custom_con_${Date.now()}`,
        text,
        category: language === 'pt' ? 'Pessoal' : 'Personal',
        weight: 3,
        mitigation: language === 'pt' ? 'Avaliar como amenizar' : 'Assess mitigation plan',
        enabled: true,
      };
      return { ...opt, cons: [...opt.cons, newCon] };
    });
    onOptionsChange(updated);
    setNewConTexts({ ...newConTexts, [optionId]: '' });
  };

  // Calculate scores
  const getOptionScores = (opt: OptionAnalysis) => {
    const proSum = opt.pros
      .filter((p) => p.enabled !== false)
      .reduce((acc, p) => acc + (p.weight || 1), 0);
    const conSum = opt.cons
      .filter((c) => c.enabled !== false)
      .reduce((acc, c) => acc + (c.weight || 1), 0);
    const net = proSum - conSum;
    return { proSum, conSum, net };
  };

  // Find winner
  const scoredOptions = options.map((opt) => ({
    ...opt,
    scores: getOptionScores(opt),
  }));
  const bestNetScore = Math.max(...scoredOptions.map((o) => o.scores.net));

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div>
          <h3 className="font-semibold text-white text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {language === 'pt' ? 'Lista Ponderada de Prós & Contras' : 'Weighted Pros & Cons Breakdown'}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {language === 'pt'
              ? 'Clique em qualquer item para ativá-lo/desativá-lo e recalcular o saldo líquido em tempo real.'
              : 'Click any item to toggle it on/off and watch the net balance re-calculate in real time.'}
          </p>
        </div>

        {/* Option quick filter tab for mobile / compact screens */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {options.map((opt, i) => {
            const score = getOptionScores(opt);
            return (
              <button
                key={opt.id}
                onClick={() => setActiveOptionTab(opt.id)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeOptionTab === opt.id || (!activeOptionTab && i === 0)
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 font-semibold'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                <span>{opt.name.length > 20 ? opt.name.substring(0, 20) + '...' : opt.name}</span>
                <span
                  className={`px-1 py-0.2 rounded text-[10px] font-bold ${
                    score.net > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {score.net > 0 ? `+${score.net}` : score.net}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Options Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {options.map((option) => {
          const { proSum, conSum, net } = getOptionScores(option);
          const isWinner = net === bestNetScore && options.length > 1;

          return (
            <div
              key={option.id}
              className={`rounded-2xl border transition-all overflow-hidden flex flex-col bg-zinc-900/90 ${
                isWinner ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : 'border-zinc-800'
              }`}
            >
              {/* Option Title & Net Score Banner */}
              <div className="p-5 border-b border-zinc-800 bg-zinc-950/60 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs uppercase font-bold tracking-wider text-zinc-500">
                      {option.id.toUpperCase()}
                    </span>
                    {isWinner && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                        {language === 'pt' ? 'Maior Saldo' : 'Highest Net'}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-white text-lg">{option.name}</h4>
                </div>

                {/* Score Pill */}
                <div className="text-right shrink-0">
                  <div className="text-xs text-zinc-400 font-medium">
                    {language === 'pt' ? 'Saldo Líquido' : 'Net Score'}
                  </div>
                  <div
                    className={`text-xl font-black ${
                      net > 0 ? 'text-emerald-400' : net < 0 ? 'text-red-400' : 'text-zinc-400'
                    }`}
                  >
                    {net > 0 ? `+${net}` : net}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    +{proSum} / -{conSum}
                  </div>
                </div>
              </div>

              {/* Pros & Cons Columns in this card */}
              <div className="p-5 space-y-6 flex-1">
                {/* PROS SECTION */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{language === 'pt' ? 'Prós (Vantagens)' : 'Pros (Benefits)'}</span>
                      <span className="text-zinc-500 font-mono font-normal">
                        ({option.pros.filter((p) => p.enabled !== false).length})
                      </span>
                    </h5>
                    <span className="text-[11px] font-mono font-semibold text-emerald-400">
                      +{proSum} pts
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {option.pros.map((pro) => {
                      const isEnabled = pro.enabled !== false;
                      return (
                        <div
                          key={pro.id}
                          onClick={() => toggleItem(option.id, 'pros', pro.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            isEnabled
                              ? 'bg-emerald-950/20 border-emerald-800/40 hover:border-emerald-500/50'
                              : 'bg-zinc-950/50 border-zinc-800/60 opacity-40 hover:opacity-70'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div
                              className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                                isEnabled
                                  ? 'bg-emerald-500 text-zinc-950 border-emerald-400'
                                  : 'bg-zinc-800 border-zinc-700 text-transparent'
                              }`}
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`text-sm font-medium ${isEnabled ? 'text-zinc-100' : 'text-zinc-400 line-through'}`}>
                                  {pro.text}
                                </span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 shrink-0">
                                  +{pro.weight} {language === 'pt' ? 'pts' : 'pts'}
                                </span>
                              </div>

                              {pro.explanation && (
                                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                                  {pro.explanation}
                                </p>
                              )}

                              <div className="mt-2 flex items-center gap-1.5">
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium inline-flex items-center gap-1">
                                  <Tag className="w-2.5 h-2.5 text-zinc-400" />
                                  {pro.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add Custom Pro Input */}
                    <div className="pt-1 flex items-center gap-1.5">
                      <input
                        type="text"
                        value={newProTexts[option.id] || ''}
                        onChange={(e) =>
                          setNewProTexts({ ...newProTexts, [option.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddCustomPro(option.id);
                        }}
                        placeholder={language === 'pt' ? '+ Adicionar outro pró...' : '+ Add another pro...'}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddCustomPro(option.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-semibold transition-colors"
                      >
                        {language === 'pt' ? 'Salvar' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* CONS SECTION */}
                <div className="pt-3 border-t border-zinc-800/80">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>{language === 'pt' ? 'Contras (Desvantagens & Riscos)' : 'Cons (Downsides & Risks)'}</span>
                      <span className="text-zinc-500 font-mono font-normal">
                        ({option.cons.filter((c) => c.enabled !== false).length})
                      </span>
                    </h5>
                    <span className="text-[11px] font-mono font-semibold text-red-400">
                      -{conSum} pts
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {option.cons.map((con) => {
                      const isEnabled = con.enabled !== false;
                      return (
                        <div
                          key={con.id}
                          onClick={() => toggleItem(option.id, 'cons', con.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            isEnabled
                              ? 'bg-red-950/20 border-red-800/40 hover:border-red-500/50'
                              : 'bg-zinc-950/50 border-zinc-800/60 opacity-40 hover:opacity-70'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div
                              className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                                isEnabled
                                  ? 'bg-red-500 text-white border-red-400'
                                  : 'bg-zinc-800 border-zinc-700 text-transparent'
                              }`}
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`text-sm font-medium ${isEnabled ? 'text-zinc-100' : 'text-zinc-400 line-through'}`}>
                                  {con.text}
                                </span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 shrink-0">
                                  -{con.weight} {language === 'pt' ? 'pts' : 'pts'}
                                </span>
                              </div>

                              {/* Mitigation Box */}
                              {con.mitigation && (
                                <div className="mt-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-start gap-2">
                                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                  <div className="text-[11px] text-zinc-300 leading-relaxed">
                                    <span className="font-semibold text-amber-300">
                                      {language === 'pt' ? 'Mitigação:' : 'Mitigation:'}{' '}
                                    </span>
                                    {con.mitigation}
                                  </div>
                                </div>
                              )}

                              <div className="mt-2 flex items-center gap-1.5">
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium inline-flex items-center gap-1">
                                  <Tag className="w-2.5 h-2.5 text-zinc-400" />
                                  {con.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add Custom Con Input */}
                    <div className="pt-1 flex items-center gap-1.5">
                      <input
                        type="text"
                        value={newConTexts[option.id] || ''}
                        onChange={(e) =>
                          setNewConTexts({ ...newConTexts, [option.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddCustomCon(option.id);
                        }}
                        placeholder={language === 'pt' ? '+ Adicionar outro contra...' : '+ Add another con...'}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddCustomCon(option.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-semibold transition-colors"
                      >
                        {language === 'pt' ? 'Salvar' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
