import { useState } from 'react';
import { X, TrendingUp, TrendingDown, PiggyBank, DollarSign } from 'lucide-react';
import type { Goal } from '../types';
import type { TransactionData } from '../plugins/notificationListener';

interface TransactionModalProps {
  transaction: TransactionData;
  goals: Goal[];
  suggestedGoalId?: string;
  onConfirm: (goalId: string, amount: number) => void;
  onIgnore: () => void;
  onCreateRule?: (bankSource: string, type: string, goalId: string) => void;
}

export default function TransactionModal({
  transaction,
  goals,
  suggestedGoalId,
  onConfirm,
  onIgnore,
  onCreateRule
}: TransactionModalProps) {
  const [selectedGoalId, setSelectedGoalId] = useState(suggestedGoalId || '');
  const [customAmount, setCustomAmount] = useState(transaction.amount.toString());
  const [createRule, setCreateRule] = useState(false);

  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'CREDIT':
        return <TrendingUp className="text-green-400" size={32} />;
      case 'DEBIT':
        return <TrendingDown className="text-red-400" size={32} />;
      case 'SAVINGS':
        return <PiggyBank className="text-blue-400" size={32} />;
      case 'INVESTMENT':
        return <DollarSign className="text-gold-400" size={32} />;
      default:
        return <DollarSign className="text-zinc-400" size={32} />;
    }
  };

  const getTransactionColor = () => {
    switch (transaction.type) {
      case 'CREDIT':
        return 'text-green-400';
      case 'DEBIT':
        return 'text-red-400';
      case 'SAVINGS':
        return 'text-blue-400';
      case 'INVESTMENT':
        return 'text-gold-400';
      default:
        return 'text-zinc-400';
    }
  };

  const getTransactionLabel = () => {
    switch (transaction.type) {
      case 'CREDIT':
        return 'Recebido';
      case 'DEBIT':
        return 'Gasto';
      case 'SAVINGS':
        return 'Poupança';
      case 'INVESTMENT':
        return 'Rendimento';
      default:
        return 'Transação';
    }
  };

  const handleConfirm = () => {
    if (!selectedGoalId) return;

    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount <= 0) return;

    if (createRule && onCreateRule) {
      onCreateRule(transaction.source, transaction.type, selectedGoalId);
    }

    onConfirm(selectedGoalId, amount);
  };

  // Filtra metas baseado no tipo de transação
  const availableGoals = goals.filter(goal => {
    const totalPaid = goal.payments.reduce((sum, p) => sum + p.amount, 0);
    // Não permite adicionar a metas já concluídas
    return totalPaid < goal.targetAmount;
  });

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-zinc-900 rounded-lg max-w-md w-full border border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 p-4 border-b border-zinc-700">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {getTransactionIcon()}
              <div>
                <h2 className="text-xl font-bold text-white">
                  Transação Detectada
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  {transaction.source} • {transaction.category}
                </p>
              </div>
            </div>
            <button
              onClick={onIgnore}
              className="p-2 hover:bg-zinc-800 rounded-md transition-colors"
              aria-label="Fechar"
            >
              <X size={20} className="text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Valor */}
          <div className="bg-zinc-800 rounded-lg p-4 text-center border border-zinc-700">
            <p className="text-sm text-zinc-400 mb-1">{getTransactionLabel()}</p>
            <p className={`text-3xl font-bold ${getTransactionColor()}`}>
              R$ {transaction.amount.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
            {transaction.description && (
              <p className="text-sm text-zinc-400 mt-2">{transaction.description}</p>
            )}
          </div>

          {/* Ajustar valor */}
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-300">
              Ajustar valor (opcional)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Selecionar meta */}
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-300">
              Adicionar à meta
            </label>
            {availableGoals.length === 0 ? (
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-center">
                <p className="text-zinc-400 text-sm">
                  Nenhuma meta disponível
                </p>
              </div>
            ) : (
              <select
                value={selectedGoalId}
                onChange={(e) => setSelectedGoalId(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-gold-500"
              >
                <option value="">Selecione uma meta...</option>
                {availableGoals.map(goal => {
                  const totalPaid = goal.payments.reduce((sum, p) => sum + p.amount, 0);
                  const remaining = goal.targetAmount - totalPaid;
                  return (
                    <option key={goal.id} value={goal.id}>
                      {goal.name} - Faltam R$ {remaining.toFixed(2)}
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          {/* Criar regra automática */}
          {onCreateRule && selectedGoalId && (
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createRule}
                  onChange={(e) => setCreateRule(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-white">
                    Criar regra automática
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Transações do tipo "{getTransactionLabel()}" do {transaction.source}
                    serão automaticamente adicionadas a esta meta
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Preview da notificação original */}
          <details className="bg-zinc-800 border border-zinc-700 rounded-lg">
            <summary className="p-3 cursor-pointer text-sm text-zinc-400 hover:text-zinc-300">
              Ver notificação original
            </summary>
            <div className="px-3 pb-3 text-xs text-zinc-500 font-mono">
              {transaction.rawText}
            </div>
          </details>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-800 border-t border-zinc-700 flex gap-2">
          <button
            onClick={onIgnore}
            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3 rounded-md transition-colors"
          >
            Ignorar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedGoalId || availableGoals.length === 0}
            className="flex-1 bg-gold-500 hover:bg-gold-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-semibold py-3 rounded-md transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
