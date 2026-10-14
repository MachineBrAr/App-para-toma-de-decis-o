import React from 'react';
import { Scale, History, PlusCircle, Sparkles, Globe } from 'lucide-react';

interface NavbarProps {
  onNewDecision: () => void;
  onOpenHistory: () => void;
  savedCount: number;
  language: 'pt' | 'en';
  onToggleLanguage: () => void;
  hasActiveDecision: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewDecision,
  onOpenHistory,
  savedCount,
  language,
  onToggleLanguage,
  hasActiveDecision,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onNewDecision}
          className="flex items-center gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-zinc-950 shadow-md shadow-amber-500/10 group-hover:shadow-amber-500/25 transition-all">
            <Scale className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors">
                The Tiebreaker
              </span>
              <span className="px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded">
                AI Decisor
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              {language === 'pt' ? 'Clareza estratégica para escolhas difíceis' : 'Strategic clarity for tough choices'}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switch */}
          <button
            onClick={onToggleLanguage}
            title={language === 'pt' ? 'Mudar para Inglês' : 'Switch to Portuguese'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-semibold uppercase">{language}</span>
          </button>

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">
              {language === 'pt' ? 'Histórico' : 'History'}
            </span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          {/* New Decision Button */}
          {hasActiveDecision && (
            <button
              onClick={onNewDecision}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg shadow-sm shadow-amber-500/20 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{language === 'pt' ? 'Nova Decisão' : 'New Decision'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
