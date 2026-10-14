import React from 'react';
import { X, Sparkles, Briefcase, Landmark, Rocket, UserCheck, ArrowRight } from 'lucide-react';
import { TemplateScenario } from '../types/decision';
import { TEMPLATES_PT, TEMPLATES_EN } from '../data/templates';

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: TemplateScenario) => void;
  language: 'pt' | 'en';
}

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  language,
}) => {
  if (!isOpen) return null;

  const templates = language === 'pt' ? TEMPLATES_PT : TEMPLATES_EN;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'carreira':
        return <Briefcase className="w-4 h-4 text-amber-400" />;
      case 'financas':
        return <Landmark className="w-4 h-4 text-emerald-400" />;
      case 'negocios':
        return <Rocket className="w-4 h-4 text-indigo-400" />;
      default:
        return <UserCheck className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-white text-base">
              {language === 'pt' ? 'Cenários e Dilemas Prontos' : 'Ready Dilemma Scenarios'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3">
          <p className="text-xs text-zinc-400 mb-2">
            {language === 'pt' 
              ? 'Selecione um cenário realista abaixo para preencher o formulário instantaneamente e ver o Tiebreaker em ação:'
              : 'Choose a real-world scenario below to populate the form and witness The Tiebreaker in action:'}
          </p>
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => {
                onSelectTemplate(tpl);
                onClose();
              }}
              className="p-4 rounded-xl bg-zinc-950/60 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-amber-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-zinc-900 border border-zinc-800 inline-flex">
                      {getCategoryIcon(tpl.category)}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                      {tpl.category}
                    </span>
                  </div>
                  <h4 className="font-medium text-white group-hover:text-amber-400 transition-colors text-sm sm:text-base">
                    {tpl.title}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {tpl.description}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {tpl.options.map((opt, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800"
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-zinc-900 text-zinc-400 group-hover:text-amber-400 group-hover:bg-amber-400/10 transition-colors self-center">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
