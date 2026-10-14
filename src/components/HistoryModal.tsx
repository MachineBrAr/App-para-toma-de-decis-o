import React from 'react';
import { X, Clock, Trash2, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { SavedDecision } from '../types/decision';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: SavedDecision[];
  onSelectDecision: (decision: SavedDecision) => void;
  onDeleteDecision: (id: string) => void;
  language: 'pt' | 'en';
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-white text-base">
              {language === 'pt' ? 'Histórico de Decisões Salvas' : 'Saved Decision History'}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
              {savedDecisions.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {savedDecisions.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <FileText className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-sm text-zinc-400">
                {language === 'pt'
                  ? 'Você ainda não salvou nenhuma decisão.'
                  : 'You have no saved decisions yet.'}
              </p>
              <p className="text-xs text-zinc-500">
                {language === 'pt'
                  ? 'Toda decisão analisada é salva automaticamente para consulta futura.'
                  : 'Every analyzed decision is automatically archived here for future reference.'}
              </p>
            </div>
          ) : (
            savedDecisions.map((item) => {
              const formattedDate = new Date(item.createdAt).toLocaleDateString(
                language === 'pt' ? 'pt-BR' : 'en-US',
                {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }
              );

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-all flex items-start justify-between gap-3 group"
                >
                  <div
                    onClick={() => {
                      onSelectDecision(item);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono text-zinc-500">
                        {formattedDate}
                      </span>
                      {item.status === 'decided' ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {language === 'pt' ? 'Decidido' : 'Resolved'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {language === 'pt' ? 'Em Análise' : 'Under Review'}
                        </span>
                      )}
                    </div>

                    <h4 className="font-semibold text-white group-hover:text-amber-400 transition-colors text-sm sm:text-base line-clamp-1">
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span>
                        {language === 'pt' ? 'Recomendado:' : 'Winner:'}{' '}
                        <strong className="text-zinc-200">
                          {item.data.verdict.recommendedOptionName}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>{item.options.length} {language === 'pt' ? 'opções' : 'options'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 self-center">
                    <button
                      onClick={() => onDeleteDecision(item.id)}
                      title={language === 'pt' ? 'Excluir do histórico' : 'Delete from history'}
                      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectDecision(item);
                        onClose();
                      }}
                      className="p-2 text-zinc-400 group-hover:text-amber-400 group-hover:bg-amber-400/10 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
