/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Scale,
  Sparkles,
  Layers,
  Sliders,
  TrendingUp,
  Award,
  Share2,
  Printer,
  Copy,
  Check,
  Flame,
  ArrowLeft,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { DecisionForm } from './components/DecisionForm';
import { ProsConsView } from './components/ProsConsView';
import { MatrixView } from './components/MatrixView';
import { SwotView } from './components/SwotView';
import { VerdictView } from './components/VerdictView';
import { CoinFlipModal } from './components/CoinFlipModal';
import { HistoryModal } from './components/HistoryModal';
import { TemplatePickerModal } from './components/TemplatePickerModal';
import {
  DecisionAnalysisResponse,
  SavedDecision,
  TemplateScenario,
  OptionAnalysis,
} from './types/decision';
import {
  getSavedDecisions,
  saveDecisionToHistory,
  updateSavedDecision,
  deleteSavedDecision,
} from './utils/storage';
import { generateMarkdownReport } from './utils/export';

type TabType = 'pros_cons' | 'matrix' | 'swot' | 'verdict';

export default function App() {
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active Decision State
  const [activeTitle, setActiveTitle] = useState('');
  const [activeContext, setActiveContext] = useState('');
  const [activeOptionsList, setActiveOptionsList] = useState<string[]>([]);
  const [activeResult, setActiveResult] = useState<DecisionAnalysisResponse | null>(null);
  const [activeDecisionId, setActiveDecisionId] = useState<string | null>(null);

  // View navigation
  const [activeTab, setActiveTab] = useState<TabType>('verdict');

  // Modals
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCoinFlipOpen, setIsCoinFlipOpen] = useState(false);

  // Storage
  const [savedDecisions, setSavedDecisions] = useState<SavedDecision[]>([]);
  const [copied, setCopied] = useState(false);

  // Initial load of history
  useEffect(() => {
    setSavedDecisions(getSavedDecisions());
  }, []);

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'pt' ? 'en' : 'pt'));
  };

  // Analyze decision with Gemini API
  const handleAnalyze = async (input: {
    title: string;
    context: string;
    options: string[];
    priorities: string[];
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: input.title,
          context: input.context,
          options: input.options,
          priorities: input.priorities,
          language,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Falha ao analisar a decisão com o servidor.');
      }

      const data: DecisionAnalysisResponse = await response.json();

      setActiveTitle(input.title);
      setActiveContext(input.context);
      setActiveOptionsList(input.options);
      setActiveResult(data);
      setActiveTab('verdict');

      // Save to history
      const saved = saveDecisionToHistory({
        title: input.title,
        context: input.context,
        options: input.options,
        language,
        data,
      });

      setActiveDecisionId(saved.id);
      setSavedDecisions(getSavedDecisions());
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err?.message || 'Erro inesperado na análise. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // When user updates pros/cons in child view
  const handleOptionsChange = (updatedOptions: OptionAnalysis[]) => {
    if (!activeResult) return;
    const updated = {
      ...activeResult,
      optionsAnalysis: updatedOptions,
    };
    setActiveResult(updated);

    if (activeDecisionId) {
      const updatedList = updateSavedDecision(activeDecisionId, { data: updated });
      setSavedDecisions(updatedList);
    }
  };

  const handleSelectTemplate = (template: TemplateScenario) => {
    handleAnalyze({
      title: template.title,
      context: template.context,
      options: template.options,
      priorities: template.priorities,
    });
  };

  const handleSelectSavedDecision = (decision: SavedDecision) => {
    setActiveTitle(decision.title);
    setActiveContext(decision.context || '');
    setActiveOptionsList(decision.options);
    setActiveResult(decision.data);
    setActiveDecisionId(decision.id);
    setActiveTab('verdict');
    setError(null);
  };

  const handleDeleteSavedDecision = (id: string) => {
    const updated = deleteSavedDecision(id);
    setSavedDecisions(updated);
    if (activeDecisionId === id) {
      setActiveDecisionId(null);
    }
  };

  const handleNewDecision = () => {
    setActiveResult(null);
    setActiveTitle('');
    setActiveContext('');
    setActiveOptionsList([]);
    setActiveDecisionId(null);
    setError(null);
  };

  const handleCopyMarkdown = () => {
    if (!activeResult) return;
    const md = generateMarkdownReport(activeTitle, activeResult, language);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navigation */}
      <Navbar
        onNewDecision={handleNewDecision}
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedCount={savedDecisions.length}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        hasActiveDecision={!!activeResult}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Error notification banner if any */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold">{language === 'pt' ? 'Atenção:' : 'Error:'}</span>{' '}
              {error}
            </div>
          </div>
        )}

        {/* View 1: No Active Decision - Display Decision Input Form */}
        {!activeResult ? (
          <DecisionForm
            onSubmit={handleAnalyze}
            isLoading={isLoading}
            onOpenTemplates={() => setIsTemplatesOpen(true)}
            language={language}
          />
        ) : (
          /* View 2: Active Decision - Display Analysis Tabs */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header / Dilemma Context Summary */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleNewDecision}
                    className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{language === 'pt' ? 'Voltar / Nova' : 'Back / New'}</span>
                  </button>
                  <span className="text-zinc-600">•</span>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-400">
                    {language === 'pt' ? 'Decisão em Análise' : 'Active Decision'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {activeTitle}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
                  {activeResult.summary}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  onClick={() => handleAnalyze({
                    title: activeTitle,
                    context: activeContext,
                    options: activeOptionsList,
                    priorities: [],
                  })}
                  disabled={isLoading}
                  className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                  title={language === 'pt' ? 'Reanalisar com IA' : 'Re-analyze with AI'}
                >
                  <Sparkles className={`w-3.5 h-3.5 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">
                    {language === 'pt' ? 'Reanalisar' : 'Re-analyze'}
                  </span>
                </button>

                <button
                  onClick={() => setIsCoinFlipOpen(true)}
                  className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  title={language === 'pt' ? 'Moeda do Desempate' : 'Coin Flip'}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">
                    {language === 'pt' ? 'Moeda' : 'Coin'}
                  </span>
                </button>

                <button
                  onClick={handleCopyMarkdown}
                  className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  title={language === 'pt' ? 'Copiar Relatório Markdown' : 'Copy Markdown Report'}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">{language === 'pt' ? 'Copiado!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="hidden sm:inline">
                        {language === 'pt' ? 'Copiar Relatório' : 'Copy'}
                      </span>
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrint}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700/60 text-xs transition-colors shadow-sm"
                  title={language === 'pt' ? 'Imprimir / Salvar PDF' : 'Print / Save PDF'}
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs (All 3 Views + Verdict) */}
            <div className="border-b border-zinc-800">
              <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-px">
                {/* Tab 1: Veredito */}
                <button
                  onClick={() => setActiveTab('verdict')}
                  className={`py-3 px-4 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'verdict'
                      ? 'border-amber-400 text-amber-300 bg-amber-400/10'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                  }`}
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{language === 'pt' ? 'Veredito Decisivo' : 'The Verdict'}</span>
                </button>

                {/* Tab 2: Prós & Contras */}
                <button
                  onClick={() => setActiveTab('pros_cons')}
                  className={`py-3 px-4 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'pros_cons'
                      ? 'border-emerald-400 text-emerald-300 bg-emerald-400/10'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'pt' ? 'Prós & Contras Ponderados' : 'Pros & Cons'}</span>
                </button>

                {/* Tab 3: Tabela Comparativa */}
                <button
                  onClick={() => setActiveTab('matrix')}
                  className={`py-3 px-4 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'matrix'
                      ? 'border-indigo-400 text-indigo-300 bg-indigo-400/10'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                  }`}
                >
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span>{language === 'pt' ? 'Tabela Comparativa' : 'Comparison Matrix'}</span>
                </button>

                {/* Tab 4: Análise SWOT */}
                <button
                  onClick={() => setActiveTab('swot')}
                  className={`py-3 px-4 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'swot'
                      ? 'border-cyan-400 text-cyan-300 bg-cyan-400/10'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                  }`}
                >
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>{language === 'pt' ? 'Análise SWOT (FOFA)' : 'SWOT Analysis'}</span>
                </button>
              </nav>
            </div>

            {/* Active Tab View Body */}
            <div>
              {activeTab === 'verdict' && (
                <VerdictView
                  verdict={activeResult.verdict}
                  decisionTitle={activeTitle}
                  options={activeResult.optionsAnalysis}
                  language={language}
                  onLaunchCoinFlip={() => setIsCoinFlipOpen(true)}
                />
              )}

              {activeTab === 'pros_cons' && (
                <ProsConsView
                  options={activeResult.optionsAnalysis}
                  onOptionsChange={handleOptionsChange}
                  language={language}
                />
              )}

              {activeTab === 'matrix' && (
                <MatrixView
                  matrix={activeResult.comparisonMatrix}
                  options={activeResult.optionsAnalysis}
                  language={language}
                />
              )}

              {activeTab === 'swot' && (
                <SwotView
                  options={activeResult.optionsAnalysis}
                  language={language}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-6 mt-12 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-zinc-400">The Tiebreaker</span>
            <span>—</span>
            <span>
              {language === 'pt' ? 'Tomada de decisão assistida por IA' : 'AI-assisted decision making'}
            </span>
          </div>
          <div className="text-[11px] text-zinc-400">
            {language === 'pt'
              ? 'Prós e contras • Tabela comparativa • Matriz SWOT • Desempate decisivo'
              : 'Pros & Cons • Multi-criteria Matrix • SWOT • Decisive tiebreak'}
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TemplatePickerModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        language={language}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={handleSelectSavedDecision}
        onDeleteDecision={handleDeleteSavedDecision}
        language={language}
      />

      <CoinFlipModal
        isOpen={isCoinFlipOpen}
        onClose={() => setIsCoinFlipOpen(false)}
        options={activeResult?.optionsAnalysis || []}
        language={language}
      />
    </div>
  );
}
