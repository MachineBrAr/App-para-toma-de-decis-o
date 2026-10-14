import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, HelpCircle, Check, X, Sparkles } from 'lucide-react';

interface VagueItem {
  index: number;
  label: string;
  originalText: string;
  reason: string;
  suggestions: string[];
}

interface VagueOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  vagueItems: VagueItem[];
  onApplyFix: (replacements: Record<number, string>) => void;
  onProceedAnyway: () => void;
  language: 'pt' | 'en';
}

export const VagueOptionModal: React.FC<VagueOptionModalProps> = ({
  isOpen,
  onClose,
  vagueItems,
  onApplyFix,
  onProceedAnyway,
  language,
}) => {
  const [edits, setEdits] = useState<Record<number, string>>(() => {
    const init: Record<number, string> = {};
    vagueItems.forEach((item) => {
      init[item.index] = item.suggestions[0] || '';
    });
    return init;
  });

  if (!isOpen || vagueItems.length === 0) return null;

  const handleSelectSuggestion = (index: number, text: string) => {
    setEdits((prev) => ({ ...prev, [index]: text }));
  };

  const handleCustomChange = (index: number, text: string) => {
    setEdits((prev) => ({ ...prev, [index]: text }));
  };

  const handleSaveAndProceed = () => {
    onApplyFix(edits);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-zinc-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-800 bg-amber-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {language === 'pt' ? 'O Tiebreaker Precisa te Questionar' : 'The Tiebreaker Must Question This Option'}
              </h3>
              <p className="text-xs text-amber-300/90 mt-0.5">
                {language === 'pt'
                  ? 'Identificamos uma opção que expressa dúvida em vez de um caminho concreto.'
                  : 'We noticed an option expressing indecision rather than a concrete path.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          {vagueItems.map((item) => (
            <div key={item.index} className="space-y-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {item.label}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                  {language === 'pt' ? 'Opção Vaga / Inconclusiva' : 'Vague / Inconclusive'}
                </span>
              </div>

              {/* The problematic text */}
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-semibold text-zinc-300 line-through decoration-red-400">
                "{item.originalText}"
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                {language === 'pt'
                  ? 'Dizer "não sei o que fazer" é compreensível, mas uma IA só consegue calcular prós e contras se comparar escolhas com consequências. No fundo, que caminho prático essa dúvida representa?'
                  : 'Saying "I don\'t know what to do" is natural, but calculating pros & cons requires comparing real paths with outcomes. Which practical path does this uncertainty actually represent?'}
              </p>

              {/* Suggestions */}
              <div>
                <span className="text-xs font-semibold text-zinc-400 block mb-2">
                  {language === 'pt' ? '💡 Escolha uma alternativa concreta com 1 clique:' : '💡 Pick a concrete alternative with 1 click:'}
                </span>
                <div className="space-y-2">
                  {item.suggestions.map((sug, i) => {
                    const isSelected = edits[item.index] === sug;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectSuggestion(item.index, sug)}
                        className={`w-full p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-semibold shadow-sm'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                        }`}
                      >
                        <span>{sug}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom rewrite input */}
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">
                  {language === 'pt' ? 'Ou digite sua própria reformulação:' : 'Or type your own rephrased option:'}
                </label>
                <input
                  type="text"
                  value={edits[item.index] || ''}
                  onChange={(e) => handleCustomChange(item.index, e.target.value)}
                  placeholder={language === 'pt' ? 'Ex: Esperar até o próximo trimestre...' : 'e.g., Wait until next quarter...'}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-zinc-800 bg-zinc-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onProceedAnyway}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline decoration-zinc-700"
          >
            {language === 'pt'
              ? 'Manter como está e forçar análise da inércia'
              : 'Keep as-is and force inertia analysis'}
          </button>

          <button
            type="button"
            onClick={handleSaveAndProceed}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'pt' ? 'Atualizar Opção e Continuar' : 'Update Option & Proceed'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
