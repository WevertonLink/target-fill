import { useState } from 'react';
import { X, Plus, Trash2, ToggleLeft, ToggleRight, Zap } from 'lucide-react';
import type { Goal } from '../types';

interface AutoRule {
  id: string;
  bankSource: string;
  transactionType: 'CREDIT' | 'DEBIT' | 'SAVINGS' | 'INVESTMENT' | 'OTHER';
  categoryKeyword?: string;
  targetGoalId: string;
  enabled: boolean;
}

interface AutoRulesModalProps {
  goals: Goal[];
  rules: AutoRule[];
  onAddRule: (rule: Omit<AutoRule, 'id'>) => void;
  onRemoveRule: (ruleId: string) => void;
  onToggleRule: (ruleId: string) => void;
  onClose: () => void;
}

const BANK_OPTIONS = [
  { value: 'all', label: 'Todos os bancos' },
  { value: 'Nubank', label: 'Nubank' },
  { value: 'Mercado Pago', label: 'Mercado Pago' },
  { value: 'Inter', label: 'Inter' },
  { value: 'C6 Bank', label: 'C6 Bank' },
  { value: 'Bradesco', label: 'Bradesco' },
  { value: 'Banco do Brasil', label: 'Banco do Brasil' },
  { value: 'Itaú', label: 'Itaú' },
  { value: 'Santander', label: 'Santander' },
  { value: 'PicPay', label: 'PicPay' },
  { value: 'Neon', label: 'Neon' },
  { value: 'Next', label: 'Next' }
];

const TRANSACTION_TYPES = [
  { value: 'CREDIT', label: 'Recebimentos (PIX, TED, etc)' },
  { value: 'DEBIT', label: 'Gastos (Compras, pagamentos)' },
  { value: 'SAVINGS', label: 'Depósitos em caixinhas' },
  { value: 'INVESTMENT', label: 'Rendimentos' }
];

export default function AutoRulesModal({
  goals,
  rules,
  onAddRule,
  onRemoveRule,
  onToggleRule,
  onClose
}: AutoRulesModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState({
    bankSource: 'all',
    transactionType: 'CREDIT' as const,
    categoryKeyword: '',
    targetGoalId: '',
    enabled: true
  });

  const handleAddRule = () => {
    if (!newRule.targetGoalId) return;

    onAddRule(newRule);
    setNewRule({
      bankSource: 'all',
      transactionType: 'CREDIT',
      categoryKeyword: '',
      targetGoalId: '',
      enabled: true
    });
    setShowAddForm(false);
  };

  const getGoalName = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    return goal?.name || 'Meta removida';
  };

  const getBankLabel = (bankValue: string) => {
    return BANK_OPTIONS.find(b => b.value === bankValue)?.label || bankValue;
  };

  const getTypeLabel = (typeValue: string) => {
    return TRANSACTION_TYPES.find(t => t.value === typeValue)?.label || typeValue;
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden border border-zinc-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 p-4 border-b border-zinc-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="text-gold-400" size={24} />
              <h2 className="text-xl font-bold text-white">Regras Automáticas</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-md transition-colors"
            >
              <X size={20} className="text-zinc-400" />
            </button>
          </div>
          <p className="text-sm text-zinc-400 mt-2">
            Configure transações para atualizar metas automaticamente
          </p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Lista de regras */}
          {rules.length === 0 ? (
            <div className="text-center py-8 bg-zinc-800 rounded-lg border border-zinc-700">
              <Zap className="text-zinc-600 mx-auto mb-3" size={48} />
              <p className="text-zinc-400">Nenhuma regra configurada</p>
              <p className="text-zinc-500 text-sm mt-1">
                Adicione regras para automatizar suas atualizações
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {rules.map(rule => (
                <div
                  key={rule.id}
                  className={`bg-zinc-800 border ${
                    rule.enabled ? 'border-zinc-700' : 'border-zinc-800'
                  } rounded-lg p-3 ${rule.enabled ? '' : 'opacity-50'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gold-400">
                          {getBankLabel(rule.bankSource)}
                        </span>
                        <span className="text-zinc-600">→</span>
                        <span className="text-sm text-zinc-300">
                          {getGoalName(rule.targetGoalId)}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        {getTypeLabel(rule.transactionType)}
                        {rule.categoryKeyword && ` • Filtro: "${rule.categoryKeyword}"`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleRule(rule.id)}
                        className="p-2 hover:bg-zinc-700 rounded-md transition-colors"
                        title={rule.enabled ? 'Desativar' : 'Ativar'}
                      >
                        {rule.enabled ? (
                          <ToggleRight className="text-gold-400" size={20} />
                        ) : (
                          <ToggleLeft className="text-zinc-600" size={20} />
                        )}
                      </button>
                      <button
                        onClick={() => onRemoveRule(rule.id)}
                        className="p-2 hover:bg-red-900/30 rounded-md transition-colors"
                        title="Remover"
                      >
                        <Trash2 className="text-red-400" size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botão adicionar */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-medium py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Nova Regra
            </button>
          )}

          {/* Formulário de nova regra */}
          {showAddForm && (
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-white mb-3">Nova Regra</h3>

              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-300">
                  Banco
                </label>
                <select
                  value={newRule.bankSource}
                  onChange={(e) => setNewRule({ ...newRule, bankSource: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                >
                  {BANK_OPTIONS.map(bank => (
                    <option key={bank.value} value={bank.value}>
                      {bank.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-300">
                  Tipo de Transação
                </label>
                <select
                  value={newRule.transactionType}
                  onChange={(e) => setNewRule({
                    ...newRule,
                    transactionType: e.target.value as any
                  })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                >
                  {TRANSACTION_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-300">
                  Filtro por palavra-chave (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: iFood, Uber, Salário..."
                  value={newRule.categoryKeyword}
                  onChange={(e) => setNewRule({ ...newRule, categoryKeyword: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Deixe vazio para aplicar a todas as transações do tipo
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-300">
                  Meta de Destino
                </label>
                <select
                  value={newRule.targetGoalId}
                  onChange={(e) => setNewRule({ ...newRule, targetGoalId: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="">Selecione uma meta...</option>
                  {goals.map(goal => (
                    <option key={goal.id} value={goal.id}>
                      {goal.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-2 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddRule}
                  disabled={!newRule.targetGoalId}
                  className="flex-1 bg-gold-500 hover:bg-gold-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-semibold py-2 rounded-md transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-800 border-t border-zinc-700">
          <button
            onClick={onClose}
            className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3 rounded-md transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
