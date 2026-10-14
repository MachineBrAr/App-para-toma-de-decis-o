import React, { useState } from 'react';
import { Shield, Zap, AlertTriangle, Crosshair, ArrowRight, Layers } from 'lucide-react';
import { OptionAnalysis } from '../types/decision';

interface SwotViewProps {
  options: OptionAnalysis[];
  language: 'pt' | 'en';
}

export const SwotView: React.FC<SwotViewProps> = ({ options, language }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || '');

  const activeOption = options.find((o) => o.id === selectedOptionId) || options[0];

  if (!activeOption) return null;

  const { swot } = activeOption;

  return (
    <div className="space-y-6">
      {/* Option Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div>
          <h3 className="font-semibold text-white text-base flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            {language === 'pt' ? 'Análise SWOT (Matriz FOFA)' : 'SWOT Strategic Matrix'}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {language === 'pt'
              ? 'Mapeamento estratégico de forças internas, fragilidades, oportunidades de mercado e ameaças.'
              : 'Strategic breakdown of internal strengths, weaknesses, external opportunities, and threats.'}
          </p>
        </div>

        {/* Option Tabs */}
        <div className="flex items-center gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedOptionId(opt.id)}
              className={`text-xs px-3.5 py-2 rounded-lg border font-medium transition-all ${
                activeOption.id === opt.id
                  ? 'bg-amber-400 text-zinc-950 font-bold border-amber-400 shadow-sm'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2x2 SWOT Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* STRENGTHS (FORÇAS) */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-emerald-900/40 hover:border-emerald-600/50 transition-all flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">
                  {language === 'pt' ? 'Forças (Strengths)' : 'Strengths'}
                </h4>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                  {language === 'pt' ? 'Fatores Internos Positivos' : 'Internal Positives'}
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              {swot.strengths.length}
            </span>
          </div>

          <ul className="space-y-2.5 flex-1">
            {swot.strengths.map((item, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm text-zinc-200 bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 leading-relaxed flex items-start gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* WEAKNESSES (FRAQUEZAS) */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-red-900/40 hover:border-red-600/50 transition-all flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">
                  {language === 'pt' ? 'Fraquezas (Weaknesses)' : 'Weaknesses'}
                </h4>
                <span className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">
                  {language === 'pt' ? 'Fatores Internos a Mitigar' : 'Internal Fragilities'}
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">
              {swot.weaknesses.length}
            </span>
          </div>

          <ul className="space-y-2.5 flex-1">
            {swot.weaknesses.map((item, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm text-zinc-200 bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 leading-relaxed flex items-start gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* OPPORTUNITIES (OPORTUNIDADES) */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-cyan-900/40 hover:border-cyan-600/50 transition-all flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">
                  {language === 'pt' ? 'Oportunidades (Opportunities)' : 'Opportunities'}
                </h4>
                <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">
                  {language === 'pt' ? 'Fatores Externos Favoráveis' : 'External Upsides'}
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
              {swot.opportunities.length}
            </span>
          </div>

          <ul className="space-y-2.5 flex-1">
            {swot.opportunities.map((item, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm text-zinc-200 bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 leading-relaxed flex items-start gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* THREATS (AMEAÇAS) */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-amber-900/40 hover:border-amber-600/50 transition-all flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Crosshair className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">
                  {language === 'pt' ? 'Ameaças (Threats)' : 'Threats'}
                </h4>
                <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                  {language === 'pt' ? 'Fatores Externos de Risco' : 'External Risks'}
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
              {swot.threats.length}
            </span>
          </div>

          <ul className="space-y-2.5 flex-1">
            {swot.threats.map((item, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm text-zinc-200 bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 leading-relaxed flex items-start gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
