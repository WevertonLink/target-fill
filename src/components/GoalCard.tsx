import { useState } from 'react';
import { Edit2, Trash2, Calendar, Tag } from 'lucide-react';
import PaymentInput from './PaymentInput';
import type { Goal } from '../types';

interface GoalCardProps {
  goal: Goal;
  onAddPayment: (goalId: string, amount: string) => void;
  onDelete: (goalId: string) => void;
  onEdit: (goal: Goal) => void;
  onClick: () => void;
}

export default function GoalCard({ goal, onAddPayment, onDelete, onEdit, onClick }: GoalCardProps) {
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
        {goal.imageUrl && (
          <div className="relative h-48 overflow-hidden bg-zinc-800">
            <img 
              src={goal.imageUrl} 
              alt={goal.name}
              className="w-full h-full object-cover"
            />
            {isComplete && (
              <div className="absolute inset-0 bg-gold-500/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-6xl">🎉</span>
              </div>
            )}
          </div>
        )}

        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">{goal.name}</h3>
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
            </div>
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(goal);
                }}
                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(goal.id);
                }}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Progresso</span>
              <span className="font-semibold text-white">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  isComplete ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-gold-500 to-gold-600'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-xs text-zinc-400">Pago</p>
              <p className="text-lg font-bold text-green-400">R$ {totalPaid.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-400">Falta</p>
              <p className="text-lg font-bold text-gold-400">R$ {remaining.toFixed(2)}</p>
            </div>
          </div>

          <button
            onClick={handlePaymentClick}
            disabled={isComplete}
            className={`w-full py-3 rounded-md font-semibold transition-all ${
              isComplete
                ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                : 'bg-gold-500 hover:bg-gold-600 text-black'
            }`}
          >
            {isComplete ? '✓ Meta Concluída' : '💰 Pagar Parcela'}
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
