import { useState } from 'react';
import { Edit2, Trash2, Calendar, Tag, Target } from 'lucide-react';
import PaymentInput from './PaymentInput';
import type { Goal } from '../types';

interface GoalCardProps {
  goal: Goal;
  onAddPayment: (goalId: string, amount: string) => void;
  onDelete: (goalId: string) => void;
  onEdit: (goal: Goal) => void;
  onClick: () => void;
  compact?: boolean;
}

export default function GoalCard({ goal, onAddPayment, onDelete, onEdit, onClick, compact = false }: GoalCardProps) {
  const [showPaymentInput, setShowPaymentInput] = useState(false);
  
  const totalPaid = goal.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remaining = goal.targetAmount - totalPaid;
  const progress = (totalPaid / goal.targetAmount) * 100;
  const isComplete = progress >= 100;

  const handlePaymentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isComplete) {
      setShowPaymentInput(true);
    }
  };

  const handleConfirmPayment = (amount: string) => {
    onAddPayment(goal.id, amount);
    setShowPaymentInput(false);
  };

  const daysUntilDeadline = goal.deadline 
    ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const isOverdue = daysUntilDeadline !== null && daysUntilDeadline < 0;
  const isUrgent = daysUntilDeadline !== null && daysUntilDeadline > 0 && daysUntilDeadline <= 7;

  return (
    <>
      <div
        onClick={onClick}
        className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-gold-500 transition-all cursor-pointer"
      >
        <div className={`relative ${compact ? 'h-32' : 'h-48'} overflow-hidden bg-zinc-800`}>
          {goal.imageUrl ? (
            <img
              src={goal.imageUrl}
              alt={goal.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
              <Target size={compact ? 48 : 64} className="text-zinc-700" strokeWidth={1.5} />
            </div>
          )}
          {isComplete && (
            <div className="absolute inset-0 bg-gold-500/20 backdrop-blur-sm flex items-center justify-center">
              <span className={compact ? 'text-4xl' : 'text-6xl'}>🎉</span>
            </div>
          )}
        </div>

        <div className={compact ? 'p-2' : 'p-4'}>
          <div className={`flex justify-between items-start ${compact ? 'mb-2' : 'mb-3'}`}>
            <div className="flex-1">
              <h3 className={`${compact ? 'text-base' : 'text-xl'} font-bold text-white ${compact ? 'mb-0.5' : 'mb-1'}`}>{goal.name}</h3>
              {!compact && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {goal.category && (
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Tag size={12} />
                      {goal.category}
                    </span>
                  )}
                  {goal.deadline && (
                    <span className={`flex items-center gap-1 ${
                      isOverdue ? 'text-red-400' : isUrgent ? 'text-yellow-400' : 'text-zinc-400'
                    }`}>
                      <Calendar size={12} />
                      {isOverdue ? 'Atrasado' : isUrgent ? `${daysUntilDeadline}d restantes` : new Date(goal.deadline).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              )}
            </div>
            {!compact && (
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(goal);
                  }}
                  className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors"
                  aria-label="Editar meta"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(goal.id);
                  }}
                  className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                  aria-label="Excluir meta"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>

          <div className={`space-y-${compact ? '1' : '2'} ${compact ? 'mb-2' : 'mb-4'}`}>
            <div className={`flex justify-between ${compact ? 'text-xs' : 'text-sm'}`}>
              <span className="text-zinc-400">Progresso</span>
              <span className="font-semibold text-white">{progress.toFixed(1)}%</span>
            </div>
            <div className={`w-full bg-zinc-800 rounded-full ${compact ? 'h-2' : 'h-3'} overflow-hidden`}>
              <div
                className={`h-full transition-all duration-500 ${
                  isComplete ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-gold-500 to-gold-600'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          <div className={`grid grid-cols-2 ${compact ? 'gap-2 mb-2' : 'gap-3 mb-4'}`}>
            <div className={`bg-green-500/10 rounded-lg ${compact ? 'p-2' : 'p-3'} border border-green-500/20`}>
              <p className={`${compact ? 'text-[10px]' : 'text-xs'} text-green-400/70 mb-0.5`}>Dedicado</p>
              <p className={`${compact ? 'text-sm' : 'text-lg'} font-bold text-green-400`}>
                R$ {compact ? totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className={`bg-gold-500/10 rounded-lg ${compact ? 'p-2' : 'p-3'} border border-gold-500/20`}>
              <p className={`${compact ? 'text-[10px]' : 'text-xs'} text-gold-400/70 mb-0.5`}>Falta</p>
              <p className={`${compact ? 'text-sm' : 'text-lg'} font-bold text-gold-400`}>
                R$ {compact ? remaining.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {!compact && !isComplete && remaining > 0 && (
            <div className="mb-3 text-center">
              <p className="text-sm text-zinc-400">
                Meta: <span className="text-white font-semibold">R$ {goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </p>
            </div>
          )}

          <button
            onClick={handlePaymentClick}
            disabled={isComplete}
            className={`w-full ${compact ? 'min-h-[40px] py-2 px-3 text-sm' : 'min-h-[48px] py-3 px-4'} rounded-md font-semibold transition-all ${
              isComplete
                ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                : 'bg-gold-500 hover:bg-gold-600 text-black active:scale-95'
            }`}
            aria-label={isComplete ? 'Meta concluída' : 'Dedicar valor'}
          >
            {isComplete ? '✓ Concluída' : (compact ? 'Dedicar' : '💰 Dedicar Valor')}
          </button>
        </div>
      </div>

      {showPaymentInput && (
        <PaymentInput
          goalName={goal.name}
          remaining={remaining}
          onConfirm={handleConfirmPayment}
          onCancel={() => setShowPaymentInput(false)}
        />
      )}
    </>
  );
}
