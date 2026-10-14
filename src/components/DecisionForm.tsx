import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
  Lightbulb,
  Compass,
  AlertTriangle,
  HelpCircle,
  Wand2,
} from 'lucide-react';
import { validateOptionText } from '../utils/validation';
import { VagueOptionModal } from './VagueOptionModal';

interface DecisionFormProps {
  onSubmit: (data: {
    title: string;
    context: string;
    options: string[];
    priorities: string[];
  }) => void;
  isLoading: boolean;
  onOpenTemplates: () => void;
  language: 'pt' | 'en';
}

const COMMON_PRIORITIES_PT = [
  'Crescimento Profissional',
  'Segurança Financeira',
  'Paz Mental / Menos Estresse',
  'Tempo com Família',
  'Autonomia & Liberdade',
  'Retorno Financeiro Imediato',
  'Impacto a Longo Prazo',
  'Facilidade de Reverter',
];

const COMMON_PRIORITIES_EN = [
  'Career Growth',
  'Financial Security',
  'Peace of Mind & Low Stress',
  'Family Time',
  'Autonomy & Freedom',
  'Immediate High Income',
  'Long-Term Upside',
  'Reversibility',
];

export const DecisionForm: React.FC<DecisionFormProps> = ({
  onSubmit,
  isLoading,
  onOpenTemplates,
  language,
}) => {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [customPriority, setCustomPriority] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSuggestingOptions, setIsSuggestingOptions] = useState(false);

  // Vague options interrogation modal state
  const [vagueModalOpen, setVagueModalOpen] = useState(false);
  const [vagueItems, setVagueItems] = useState<
    Array<{
      index: number;
      label: string;
      originalText: string;
      reason: string;
      suggestions: string[];
    }>
  >([]);

  const prioritiesList = language === 'pt' ? COMMON_PRIORITIES_PT : COMMON_PRIORITIES_EN;

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const togglePriority = (p: string) => {
    if (selectedPriorities.includes(p)) {
      setSelectedPriorities(selectedPriorities.filter((item) => item !== p));
    } else {
      setSelectedPriorities([...selectedPriorities, p]);
    }
  };

  const handleAddCustomPriority = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPriority.trim() && !selectedPriorities.includes(customPriority.trim())) {
      setSelectedPriorities([...selectedPriorities, customPriority.trim()]);
      setCustomPriority('');
    }
  };

  // Suggest options via AI
  const handleSuggestOptions = async () => {
    if (!title.trim() || isSuggestingOptions) return;
    setIsSuggestingOptions(true);
    try {
      const res = await fetch('/api/suggest-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), context: context.trim(), language }),
      });
      const data = await res.json();
      if (Array.isArray(data.options) && data.options.length >= 2) {
        setOptions(data.options);
      }
    } catch (err) {
      console.error('Error suggesting options:', err);
    } finally {
      setIsSuggestingOptions(false);
    }
  };

  const executeSubmission = (currentOptions: string[]) => {
    const cleanedOptions = currentOptions.map((opt, idx) => {
      if (opt.trim()) return opt.trim();
      return language === 'pt' ? `Opção ${String.fromCharCode(65 + idx)}` : `Option ${String.fromCharCode(65 + idx)}`;
    });

    onSubmit({
      title: title.trim(),
      context: context.trim(),
      options: cleanedOptions,
      priorities: selectedPriorities,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Detect vague or non-satisfactory options (e.g. "Não sei o que fazer")
    const detectedVague: typeof vagueItems = [];
    options.forEach((opt, index) => {
      const validation = validateOptionText(opt, language);
      if (validation.isVague) {
        detectedVague.push({
          index,
          label: language === 'pt' ? `Opção ${String.fromCharCode(65 + index)}` : `Option ${String.fromCharCode(65 + index)}`,
          originalText: opt,
          reason: validation.reason || '',
          suggestions: validation.suggestions,
        });
      }
    });

    if (detectedVague.length > 0) {
      setVagueItems(detectedVague);
      setVagueModalOpen(true);
      return;
    }

    executeSubmission(options);
  };

  // When user applies fixes from VagueOptionModal
  const handleApplyVagueFixes = (replacements: Record<number, string>) => {
    const updated = [...options];
    Object.entries(replacements).forEach(([idxStr, newText]) => {
      const idx = Number(idxStr);
      if (newText.trim()) {
        updated[idx] = newText.trim();
      }
    });
    setOptions(updated);
    setVagueModalOpen(false);
    executeSubmission(updated);
  };

  const handleProceedAnyway = () => {
    setVagueModalOpen(false);
    executeSubmission(options);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Hero Header */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>
            {language === 'pt' ? 'O Assistente Estratégico de Decisões' : 'Strategic AI Decision System'}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          {language === 'pt' ? (
            <>
              Precisa tomar uma decisão? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                Deixe a IA desempatar.
              </span>
            </>
          ) : (
            <>
              Torn between two choices? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                Let AI break the tie.
              </span>
            </>
          )}
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          {language === 'pt'
            ? 'Insira o seu dilema e receba instantaneamente prós e contras ponderados, matriz comparativa multicritério, análise SWOT completa e o veredito decisivo.'
            : 'Enter your dilemma to instantly receive weighted pros & cons, a multi-criteria matrix, an exhaustive SWOT breakdown, and the decisive verdict.'}
        </p>

        {/* Template Prompt Trigger */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onOpenTemplates}
            className="inline-flex items-center gap-2 text-xs font-medium text-amber-400 hover:text-amber-300 bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'pt' ? 'Ou explore exemplos reais prontos' : 'Or explore ready-to-use dilemma templates'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Form Box */}
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden backdrop-blur-sm"
      >
        <div className="space-y-6">
          {/* Decision Title */}
          <div>
            <label className="block text-sm font-semibold text-zinc-200 mb-2">
              {language === 'pt' ? 'Qual é a decisão que você precisa tomar?' : 'What decision do you need to make?'}
              <span className="text-amber-400 ml-1">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                language === 'pt'
                  ? 'Ex: Devo aceitar a nova oferta de trabalho ou continuar na empresa atual?'
                  : 'e.g., Should I accept the startup job offer or stay at my current corporate position?'
              }
              className="w-full px-4 py-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-base focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
          </div>

          {/* Options to compare */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-zinc-200">
                {language === 'pt' ? 'Opções a serem avaliadas' : 'Options to evaluate'}
              </label>
              <div className="flex items-center gap-2">
                {title.trim().length > 3 && (
                  <button
                    type="button"
                    onClick={handleSuggestOptions}
                    disabled={isSuggestingOptions}
                    className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold px-2 py-0.5 rounded bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 transition-colors disabled:opacity-50"
                  >
                    <Wand2 className={`w-3 h-3 ${isSuggestingOptions ? 'animate-spin' : ''}`} />
                    <span>
                      {isSuggestingOptions
                        ? language === 'pt' ? 'Sugerindo...' : 'Suggesting...'
                        : language === 'pt' ? '✨ Sugerir Opções com IA' : '✨ Suggest Options with AI'}
                    </span>
                  </button>
                )}
                <span className="text-xs text-zinc-500">
                  {options.length} {language === 'pt' ? 'opções' : 'options'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {options.map((opt, idx) => {
                const validation = validateOptionText(opt, language);

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60 flex items-center justify-center text-xs font-bold shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={
                          idx === 0
                            ? language === 'pt' ? 'Opção A (ex: Aceitar nova proposta)' : 'Option A (e.g., Accept offer)'
                            : idx === 1
                            ? language === 'pt' ? 'Opção B (ex: Permanecer na empresa)' : 'Option B (e.g., Stay in role)'
                            : language === 'pt' ? `Opção ${String.fromCharCode(65 + idx)}` : `Option ${String.fromCharCode(65 + idx)}`
                        }
                        className={`flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-950 border text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all ${
                          validation.isVague
                            ? 'border-amber-500/70 focus:ring-amber-500/50'
                            : 'border-zinc-800 focus:ring-amber-500/40 focus:border-amber-500'
                        }`}
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(idx)}
                          title={language === 'pt' ? 'Remover opção' : 'Remove option'}
                          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800/80 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Inline Interrogation Alert for Vague / Non-satisfactory options */}
                    {validation.isVague && (
                      <div className="ml-9 p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs animate-in fade-in duration-200">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div className="space-y-1.5 flex-1">
                            <div className="font-semibold text-amber-300 flex items-center justify-between">
                              <span>
                                {language === 'pt' ? 'O Tiebreaker te indaga:' : 'The Tiebreaker questions this option:'}
                              </span>
                              <span className="text-[10px] uppercase font-bold text-amber-400/80">
                                {language === 'pt' ? 'Opção Inconclusiva' : 'Vague Path'}
                              </span>
                            </div>
                            <p className="text-zinc-300 leading-relaxed">
                              {validation.reason}
                            </p>
                            <div className="pt-1">
                              <span className="text-[11px] text-zinc-400 block mb-1 font-medium">
                                {language === 'pt' ? 'Clique para transformar em um caminho concreto:' : 'Click to convert into an actionable path:'}
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {validation.suggestions.map((sug, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleOptionChange(idx, sug)}
                                    className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-amber-400/20 text-zinc-200 hover:text-amber-300 border border-zinc-700/80 hover:border-amber-400/50 transition-colors text-left font-medium"
                                  >
                                    + {sug}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {options.length < 5 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 py-1.5 px-3 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'pt' ? 'Adicionar outra opção' : 'Add another option'}</span>
              </button>
            )}
          </div>

          {/* Toggle for Advanced Context & Priorities */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {showAdvanced
                  ? language === 'pt' ? 'Ocultar contexto adicional & prioridades' : 'Hide additional context & priorities'
                  : language === 'pt' ? 'Adicionar contexto pessoal & prioridades (Recomendado)' : 'Add personal context & priorities (Recommended)'}
              </span>
            </button>
          </div>

          {showAdvanced && (
            <div className="space-y-5 pt-3 border-t border-zinc-800/80 animate-in fade-in duration-200">
              {/* Context textarea */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  {language === 'pt' ? 'Contexto pessoal, prazos ou sentimentos atuais' : 'Personal context, timelines, or gut feelings'}
                </label>
                <textarea
                  rows={3}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder={
                    language === 'pt'
                      ? 'Ex: Tenho 6 meses de reserva financeira; minha principal preocupação é o estresse com filho recém-nascido, mas o salário é 40% maior.'
                      : 'e.g., I have 6 months emergency fund; main worry is high pressure with a newborn, but salary is 40% higher.'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all resize-y"
                />
              </div>

              {/* Priorities Tag Chips */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  {language === 'pt' ? 'O que mais importa para você nesta decisão?' : 'What matters most to you in this choice?'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {prioritiesList.map((p) => {
                    const isSelected = selectedPriorities.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => togglePriority(p)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 font-medium'
                            : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {p}
                      </button>
                    );
                  })}
                </div>

                {/* Add custom priority */}
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={customPriority}
                    onChange={(e) => setCustomPriority(e.target.value)}
                    placeholder={language === 'pt' ? 'Outra prioridade personalizada...' : 'Other custom priority...'}
                    className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500 w-60"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomPriority}
                    className="px-2.5 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors"
                  >
                    {language === 'pt' ? 'Adicionar' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="w-full py-4 px-6 rounded-xl font-bold text-zinc-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-105 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-base transition-all"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>
                    {language === 'pt' ? 'Calculando Prós, Contras & Análise SWOT...' : 'Computing Pros, Cons & SWOT Analysis...'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 fill-zinc-950" />
                  <span>
                    {language === 'pt' ? 'Analisar e Desempatar com IA' : 'Analyze & Break the Tie with AI'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-zinc-500 mt-2">
              {language === 'pt'
                ? 'Gera lista de prós & contras ponderados, matriz comparativa e análise SWOT com IA.'
                : 'Generates weighted pros & cons, comparative matrix, and SWOT breakdown powered by AI.'}
            </p>
          </div>
        </div>
      </form>

      {/* Vague Option Interrogation Modal */}
      <VagueOptionModal
        isOpen={vagueModalOpen}
        onClose={() => setVagueModalOpen(false)}
        vagueItems={vagueItems}
        onApplyFix={handleApplyVagueFixes}
        onProceedAnyway={handleProceedAnyway}
        language={language}
      />
    </div>
  );
};
