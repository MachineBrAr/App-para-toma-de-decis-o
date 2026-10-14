import React, { useState } from 'react';
import {
  Award,
  Compass,
  CheckSquare,
  Square,
  HelpCircle,
  EyeOff,
  Send,
  Sparkles,
  HeartHandshake,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { DecisionVerdict, OptionAnalysis } from '../types/decision';

interface VerdictViewProps {
  verdict: DecisionVerdict;
  decisionTitle: string;
  options: OptionAnalysis[];
  language: 'pt' | 'en';
  onLaunchCoinFlip: () => void;
}

export const VerdictView: React.FC<VerdictViewProps> = ({
  verdict,
  decisionTitle,
  options,
  language,
  onLaunchCoinFlip,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [gutAnswer, setGutAnswer] = useState<'relief' | 'regret' | null>(null);

  // Follow-up question state
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [followUpAnswers, setFollowUpAnswers] = useState<{ q: string; a: string }[]>([]);
  const [isAsking, setIsAsking] = useState(false);

  const toggleStep = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepNumber));
    } else {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  const handleAskFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuestion.trim() || isAsking) return;

    const q = followUpQuestion.trim();
    setIsAsking(true);
    try {
      const res = await fetch('/api/ask-tiebreaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decisionTitle,
          currentVerdict: verdict.rationalVerdict,
          question: q,
          language,
        }),
      });
      const data = await res.json();
      if (data.answer) {
        setFollowUpAnswers((prev) => [...prev, { q, a: data.answer }]);
        setFollowUpQuestion('');
      }
    } catch (err) {
      console.error('Error asking follow up:', err);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Supreme Recommendation Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/30 border border-amber-500/40 shadow-2xl relative overflow-hidden">
        {/* Glow decorative element */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-zinc-950 flex items-center justify-center font-bold shadow-lg shadow-amber-400/20">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {language === 'pt' ? 'Recomendação Final da IA' : 'AI Strategic Recommendation'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-semibold">
                  {language === 'pt' ? `Confiança: ${verdict.confidenceLevel}` : `Confidence: ${verdict.confidenceLevel}`}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {verdict.recommendedOptionName}
              </h2>
            </div>
          </div>

          {/* Quick tiebreaker flip button */}
          <button
            onClick={onLaunchCoinFlip}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>{language === 'pt' ? 'Lançar a Moeda do Desempate' : 'Flip the Tiebreaker Coin'}</span>
          </button>
        </div>

        {/* Headline & Rational Verdict */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
            <h4 className="text-sm sm:text-base font-bold text-amber-300 mb-2">
              "{verdict.headline}"
            </h4>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {verdict.rationalVerdict}
            </p>
          </div>

          {/* The Clincher */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3">
            <Compass className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 block mb-1">
                {language === 'pt' ? 'O Ponto Decisivo de Desempate (The Clincher)' : 'The Decisive Clincher'}
              </span>
              <p className="text-sm text-zinc-200 leading-relaxed font-medium">
                {verdict.theClincher}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Gut-Check & Blindspots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gut-Check (O Teste do Alívio) */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HeartHandshake className="w-4 h-4 text-pink-400" />
              <h4 className="font-bold text-white text-base">
                {language === 'pt' ? 'O Teste do Alívio (Instinto Visceral)' : 'The Gut-Check Test'}
              </h4>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              {language === 'pt'
                ? 'A lógica avalia o futuro, mas seu corpo já sabe como se sente no presente.'
                : 'Logic evaluates models, but your nervous system knows how you truly feel right now.'}
            </p>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm font-medium text-zinc-200 italic mb-4">
              "{verdict.gutCheckQuestion}"
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs font-semibold text-zinc-400 block mb-2">
              {language === 'pt' ? 'Se a decisão fosse tomada agora, você sentiria:' : 'If finalized right now, you would feel:'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGutAnswer('relief')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  gutAnswer === 'relief'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {language === 'pt' ? '🌱 Alívio e Clareza' : '🌱 Relief & Clarity'}
              </button>
              <button
                type="button"
                onClick={() => setGutAnswer('regret')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  gutAnswer === 'regret'
                    ? 'bg-red-500/20 border-red-500 text-red-300'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {language === 'pt' ? '⚡ Aperto / Frustração' : '⚡ Hesitation / Regret'}
              </button>
            </div>
            {gutAnswer && (
              <p className="text-[11px] text-amber-300 mt-2 bg-amber-950/30 p-2 rounded-lg border border-amber-800/40">
                {gutAnswer === 'relief'
                  ? language === 'pt'
                    ? 'Excelente sinal: sua intuição profunda está alinhada com a recomendação racional.'
                    : 'Strong signal: your gut intuition aligns with the rational model.'
                  : language === 'pt'
                    ? 'Atenção: sentir aperto indica que você valoriza secretamente outra opção mais do que os números mostram. Revise seus pesos!'
                    : 'Caution: feeling hesitation indicates your subconscious values another option more than the raw score. Revisit your weights!'}
              </p>
            )}
          </div>
        </div>

        {/* Blind Spots & Biases */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <EyeOff className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-white text-base">
              {language === 'pt' ? 'Pontos Cegos & Vieses Cognitivos' : 'Cognitive Blind Spots'}
            </h4>
          </div>
          <p className="text-xs text-zinc-400 mb-4">
            {language === 'pt'
              ? 'Armadilhas mentais comuns (viés de confirmação, aversão à perda) que você pode estar ignorando:'
              : 'Mental traps (loss aversion, sunk cost, confirmation bias) that could distort judgment:'}
          </p>

          <ul className="space-y-2.5">
            {verdict.blindSpots.map((spot, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm text-zinc-300 bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 leading-relaxed flex items-start gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{spot}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Plan */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              {language === 'pt' ? 'Plano de Ação Imediato' : 'Immediate Action Plan'}
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              {language === 'pt'
                ? 'Decisão sem execução é apenas ilusão. Dê os primeiros passos:'
                : 'A decision without execution is just an illusion. Take these immediate steps:'}
            </p>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {completedSteps.length} / {verdict.actionPlan.length} {language === 'pt' ? 'concluídos' : 'done'}
          </span>
        </div>

        <div className="space-y-3">
          {verdict.actionPlan.map((step) => {
            const isDone = completedSteps.includes(step.step);
            return (
              <div
                key={step.step}
                onClick={() => toggleStep(step.step)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-800/50 text-zinc-400 line-through'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-zinc-400">
                    {isDone ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-semibold ${isDone ? 'text-zinc-400' : 'text-white'}`}>
                        {step.step}. {step.title}
                      </span>
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {step.timeline}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${isDone ? 'text-zinc-400' : 'text-zinc-300'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Follow-up question box */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <h4 className="font-bold text-white text-base">
            {language === 'pt' ? 'Ficou alguma dúvida? Pergunte ao Tiebreaker' : 'Have a question? Ask The Tiebreaker'}
          </h4>
        </div>
        <p className="text-xs text-zinc-400 mb-4">
          {language === 'pt'
            ? 'Faça uma pergunta sobre um cenário específico, contraproposta ou receio pessoal.'
            : 'Ask a specific question about counter-offers, trade-offs, or personal doubts.'}
        </p>

        {followUpAnswers.length > 0 && (
          <div className="space-y-3 mb-4">
            {followUpAnswers.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="text-xs font-semibold text-amber-400">Q: {item.q}</div>
                <div className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAskFollowUp} className="flex gap-2">
          <input
            type="text"
            value={followUpQuestion}
            onChange={(e) => setFollowUpQuestion(e.target.value)}
            placeholder={
              language === 'pt'
                ? 'Ex: E se eu receber uma contraproposta salarial, o veredito muda?'
                : 'e.g., What if my boss makes a counter-offer?'
            }
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={isAsking || !followUpQuestion.trim()}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
          >
            {isAsking ? (
              <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'pt' ? 'Perguntar' : 'Ask'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
