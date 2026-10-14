import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, Flame, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OptionAnalysis } from '../types/decision';

interface CoinFlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: OptionAnalysis[];
  language: 'pt' | 'en';
}

export const CoinFlipModal: React.FC<CoinFlipModalProps> = ({
  isOpen,
  onClose,
  options,
  language,
}) => {
  const [selectedA, setSelectedA] = useState<string>(options[0]?.name || 'Opção A');
  const [selectedB, setSelectedB] = useState<string>(options[1]?.name || 'Opção B');
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [flipDegree, setFlipDegree] = useState(0);

  if (!isOpen) return null;

  const handleFlip = () => {
    if (isFlipping) return;

    setIsFlipping(true);
    setResult(null);

    // Pick winner 50/50
    const isWinnerA = Math.random() >= 0.5;
    const winnerName = isWinnerA ? selectedA : selectedB;

    // Spin multiple rotations (e.g. 5 to 7 full rotations plus final face)
    const extraTurns = (5 + Math.floor(Math.random() * 4)) * 360;
    const targetFace = isWinnerA ? 0 : 180;
    const newDegree = flipDegree + extraTurns + targetFace;

    setFlipDegree(newDegree);

    setTimeout(() => {
      setIsFlipping(false);
      setResult(winnerName);

      // Trigger confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#ffffff', '#10b981'],
        });
      } catch (e) {
        // Confetti fallback
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden p-6 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-2">
            <Flame className="w-3.5 h-3.5" />
            <span>{language === 'pt' ? 'O Desempate Físico' : 'The Gut-Check Coin Toss'}</span>
          </div>
          <h3 className="text-xl font-black text-white">
            {language === 'pt' ? 'A Moeda do Desempate' : 'The Tiebreaker Coin'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            {language === 'pt'
              ? 'Quando a moeda estiver no ar, preste atenção no que o seu coração torce para acontecer!'
              : 'While the coin is in the air, notice which outcome your subconscious secretly roots for!'}
          </p>
        </div>

        {/* Option assignments */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="p-2.5 rounded-xl bg-zinc-950 border border-amber-500/30 text-left">
            <div className="text-[10px] uppercase font-bold text-amber-400">
              {language === 'pt' ? 'Cara (Heads)' : 'Heads'}
            </div>
            <div className="text-xs font-semibold text-zinc-200 truncate mt-0.5">
              {selectedA}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-950 border border-amber-500/30 text-left">
            <div className="text-[10px] uppercase font-bold text-amber-400">
              {language === 'pt' ? 'Coroa (Tails)' : 'Tails'}
            </div>
            <div className="text-xs font-semibold text-zinc-200 truncate mt-0.5">
              {selectedB}
            </div>
          </div>
        </div>

        {/* 3D Animated Coin Canvas */}
        <div className="py-6 flex items-center justify-center perspective-[800px]">
          <div
            className={`w-32 h-32 rounded-full relative transition-transform ease-out cursor-pointer shadow-2xl ${
              isFlipping ? 'duration-[1800ms]' : 'duration-300'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${flipDegree}deg) ${isFlipping ? 'scale(1.15)' : 'scale(1)'}`,
            }}
            onClick={handleFlip}
          >
            {/* Front: Cara / Heads */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 border-4 border-amber-300 flex flex-col items-center justify-center text-zinc-950 font-black shadow-inner"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <Award className="w-9 h-9 stroke-[2.5]" />
              <span className="text-[10px] uppercase tracking-widest mt-1 font-extrabold">CARA</span>
            </div>

            {/* Back: Coroa / Tails */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-zinc-800 via-zinc-700 to-zinc-500 border-4 border-amber-400 flex flex-col items-center justify-center text-amber-300 font-black shadow-inner"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <Sparkles className="w-9 h-9" />
              <span className="text-[10px] uppercase tracking-widest mt-1 font-extrabold">COROA</span>
            </div>
          </div>
        </div>

        {/* Result announcement */}
        {result && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/40 animate-in zoom-in-95 duration-200">
            <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
              {language === 'pt' ? 'O Destino Escolheu:' : 'Fate chose:'}
            </span>
            <div className="text-base font-extrabold text-white">{result}</div>
            <p className="text-[11px] text-zinc-300 mt-1 italic">
              {language === 'pt'
                ? 'Ficou aliviado ou decepcionado com o resultado? Sua resposta revela sua verdadeira escolha.'
                : 'Relieved or disappointed? That flash of emotion tells you the true choice.'}
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleFlip}
          disabled={isFlipping}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 text-sm transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isFlipping ? 'animate-spin' : ''}`} />
          <span>
            {isFlipping
              ? language === 'pt' ? 'Moeda no ar...' : 'Flipping...'
              : result
              ? language === 'pt' ? 'Girar Novamente' : 'Flip Again'
              : language === 'pt' ? 'Lançar a Moeda Agora' : 'Flip the Coin Now'}
          </span>
        </button>
      </div>
    </div>
  );
};
