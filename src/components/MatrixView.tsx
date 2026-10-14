import React, { useState } from 'react';
import { Award, Info, Sliders, Sparkles, Trophy } from 'lucide-react';
import { ComparisonMatrix, OptionAnalysis } from '../types/decision';

interface MatrixViewProps {
  matrix: ComparisonMatrix;
  options: OptionAnalysis[];
  language: 'pt' | 'en';
}

export const MatrixView: React.FC<MatrixViewProps> = ({
  matrix,
  options,
  language,
}) => {
  // Local state for interactive weights on each criterion
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    matrix.criteria.forEach((c) => {
      initial[c.id] = c.defaultWeight || 1.0;
    });
    return initial;
  });

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleWeightChange = (criterionId: string, newWeight: number) => {
    setWeights((prev) => ({
      ...prev,
      [criterionId]: newWeight,
    }));
  };

  // Find score for option & criterion
  const getScoreData = (optionId: string, criterionId: string) => {
    return matrix.scores.find(
      (s) => s.optionId === optionId && s.criterionId === criterionId
    );
  };

  // Calculate total weighted score for each option
  const optionTotals = options.map((opt) => {
    let totalScore = 0;
    let maxPossible = 0;

    matrix.criteria.forEach((crit) => {
      const weight = weights[crit.id] ?? 1.0;
      const scoreObj = getScoreData(opt.id, crit.id);
      const scoreVal = scoreObj ? scoreObj.score : 5;
      totalScore += scoreVal * weight;
      maxPossible += 10 * weight;
    });

    const percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;

    return {
      id: opt.id,
      name: opt.name,
      totalScore: Number(totalScore.toFixed(1)),
      maxPossible: Number(maxPossible.toFixed(1)),
      percentage,
    };
  });

  // Find highest total score
  const highestTotal = Math.max(...optionTotals.map((o) => o.totalScore));

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    if (score >= 6) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    return 'bg-red-500/20 text-red-300 border-red-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-white text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              {language === 'pt' ? 'Matriz Comparativa Multicritério' : 'Multi-Criteria Comparative Matrix'}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              {language === 'pt'
                ? 'Ajuste os pesos dos critérios abaixo para refletir suas prioridades reais e ver qual opção se destaca.'
                : 'Adjust criterion weights below to reflect your authentic values and reveal the winning option.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <span className="inline-block w-2.5 h-2.5 rounded bg-emerald-500/60" /> 8-10: Alto
            <span className="inline-block w-2.5 h-2.5 rounded bg-amber-500/60 ml-2" /> 6-7: Médio
            <span className="inline-block w-2.5 h-2.5 rounded bg-red-500/60 ml-2" /> 1-5: Baixo
          </div>
        </div>

        {/* Total Score Ranking Bar Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {optionTotals.map((item) => {
            const isWinner = item.totalScore === highestTotal && options.length > 1;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  isWinner
                    ? 'bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'bg-zinc-950 border-zinc-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-zinc-300 line-clamp-1">
                    {item.name}
                  </span>
                  {isWinner && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      {language === 'pt' ? 'Líder' : 'Leader'}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-2xl font-black text-white font-mono">
                    {item.percentage}%
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {item.totalScore} / {item.maxPossible} pts
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isWinner ? 'bg-gradient-to-r from-amber-500 to-amber-300' : 'bg-zinc-600'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Responsive Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-xl">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950">
              <th className="py-4 px-5 text-xs font-bold text-zinc-300 uppercase tracking-wider w-1/3">
                {language === 'pt' ? 'Critério de Avaliação' : 'Evaluation Dimension'}
              </th>
              <th className="py-4 px-4 text-xs font-bold text-zinc-400 uppercase tracking-wider text-center w-28">
                {language === 'pt' ? 'Peso' : 'Weight'}
              </th>
              {options.map((opt) => (
                <th
                  key={opt.id}
                  className="py-4 px-5 text-xs font-bold text-white uppercase tracking-wider text-center"
                >
                  <div className="truncate max-w-[200px] mx-auto">{opt.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80 text-sm">
            {matrix.criteria.map((criterion) => {
              const currentWeight = weights[criterion.id] ?? 1.0;

              return (
                <tr key={criterion.id} className="hover:bg-zinc-800/30 transition-colors">
                  {/* Criterion info */}
                  <td className="py-4 px-5">
                    <div className="font-semibold text-zinc-200 text-sm">{criterion.name}</div>
                    {criterion.description && (
                      <div className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                        {criterion.description}
                      </div>
                    )}
                  </td>

                  {/* Weight Selector */}
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex rounded-lg bg-zinc-950 border border-zinc-800 p-0.5">
                      {[0.5, 1.0, 1.5, 2.0].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => handleWeightChange(criterion.id, w)}
                          title={`${w}x weight`}
                          className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition-colors ${
                            currentWeight === w
                              ? 'bg-amber-400 text-zinc-950 font-black'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          {w}x
                        </button>
                      ))}
                    </div>
                  </td>

                  {/* Option Scores */}
                  {options.map((opt) => {
                    const scoreData = getScoreData(opt.id, criterion.id);
                    const score = scoreData ? scoreData.score : 5;
                    const reason = scoreData?.reason || '';
                    const tooltipKey = `${opt.id}_${criterion.id}`;
                    const isTooltipOpen = activeTooltip === tooltipKey;

                    return (
                      <td key={opt.id} className="py-4 px-5 text-center">
                        <div className="inline-flex flex-col items-center">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveTooltip(isTooltipOpen ? null : tooltipKey)
                            }
                            className={`px-3 py-1.5 rounded-xl border text-sm font-bold flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 ${getScoreBadgeColor(
                              score
                            )}`}
                          >
                            <span>{score}/10</span>
                            <Info className="w-3 h-3 opacity-60" />
                          </button>

                          {/* Justification snippet / popup */}
                          {isTooltipOpen && (
                            <div className="mt-2 p-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-xs text-left text-zinc-300 max-w-[220px] shadow-lg animate-in fade-in duration-150">
                              <span className="font-semibold text-amber-400 block mb-1">
                                {language === 'pt' ? 'Justificativa da IA:' : 'AI Rationale:'}
                              </span>
                              {reason}
                            </div>
                          )}

                          {!isTooltipOpen && reason && (
                            <span className="text-[11px] text-zinc-400 mt-1 max-w-[180px] line-clamp-1">
                              {reason}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
