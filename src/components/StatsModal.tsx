import { X, Target, TrendingUp, DollarSign, Award, Calendar, Zap } from 'lucide-react';
import type { Goal } from '../types';

interface StatsModalProps {
  goals: Goal[];
  onClose: () => void;
}

export default function StatsModal({ goals, onClose }: StatsModalProps) {
  // Cálculos de estatísticas
  const totalGoals = goals.length;

  const completedGoals = goals.filter(g => {
    const totalPaid = g.payments.reduce((sum, p) => sum + p.amount, 0);
    return totalPaid >= g.targetAmount;
  }).length;

  const activeGoals = totalGoals - completedGoals;

  const totalInvested = goals.reduce((sum, g) => {
    return sum + g.payments.reduce((pSum, p) => pSum + p.amount, 0);
  }, 0);

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);

  const averageProgress = totalGoals > 0
    ? (totalInvested / totalTarget) * 100
    : 0;

  // Meta mais próxima de completar
  const nearestGoal = goals
    .filter(g => {
      const totalPaid = g.payments.reduce((sum, p) => sum + p.amount, 0);
      return totalPaid < g.targetAmount;
    })
    .sort((a, b) => {
      const progressA = a.payments.reduce((sum, p) => sum + p.amount, 0) / a.targetAmount;
      const progressB = b.payments.reduce((sum, p) => sum + p.amount, 0) / b.targetAmount;
      return progressB - progressA;
    })[0];

  // Meta com prazo mais próximo
  const closestDeadline = goals
    .filter(g => {
      const totalPaid = g.payments.reduce((sum, p) => sum + p.amount, 0);
      return g.deadline && totalPaid < g.targetAmount;
    })
    .sort((a, b) => {
      if (!a.deadline || !b.deadline) return 0;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    })[0];

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-zinc-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-zinc-800 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center border border-gold-500/30">
              <TrendingUp className="text-gold-400" size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Estatísticas Gerais</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {totalGoals === 0 ? (
            <div className="text-center py-8">
              <Target size={48} className="text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500">Nenhuma meta criada ainda</p>
            </div>
          ) : (
            <>
              {/* Resumo Rápido */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-zinc-800 to-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="text-gold-400" size={18} />
                    <p className="text-zinc-400 text-xs font-medium">Total de Metas</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{totalGoals}</p>
                </div>

                <div className="bg-gradient-to-br from-zinc-800 to-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="text-green-400" size={18} />
                    <p className="text-zinc-400 text-xs font-medium">Concluídas</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{completedGoals}</p>
                </div>

                <div className="bg-gradient-to-br from-zinc-800 to-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="text-blue-400" size={18} />
                    <p className="text-zinc-400 text-xs font-medium">Em Progresso</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{activeGoals}</p>
                </div>

                <div className="bg-gradient-to-br from-zinc-800 to-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="text-gold-400" size={18} />
                    <p className="text-zinc-400 text-xs font-medium">Investido</p>
                  </div>
                  <p className="text-lg font-bold text-white">R$ {totalInvested.toFixed(2)}</p>
                </div>
              </div>

              {/* Progresso Médio */}
              <div className="bg-gradient-to-br from-zinc-800 to-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-gold-400" size={18} />
                    <p className="text-sm font-medium text-white">Progresso Médio</p>
                  </div>
                  <p className="text-xl font-bold text-gold-400">{averageProgress.toFixed(1)}%</p>
                </div>
                <div className="w-full bg-zinc-700/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-gold-500 to-gold-600 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(averageProgress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  R$ {totalInvested.toFixed(2)} de R$ {totalTarget.toFixed(2)}
                </p>
              </div>

              {/* Próxima a Completar */}
              {nearestGoal && (
                <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-xl p-4 border border-green-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="text-green-400" size={18} />
                    <p className="text-sm font-medium text-green-300">Próxima a Completar</p>
                  </div>
                  <p className="font-bold text-white mb-1">{nearestGoal.name}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">
                      {((nearestGoal.payments.reduce((sum, p) => sum + p.amount, 0) / nearestGoal.targetAmount) * 100).toFixed(1)}% concluída
                    </span>
                    <span className="text-green-400 font-semibold">
                      Faltam R$ {(nearestGoal.targetAmount - nearestGoal.payments.reduce((sum, p) => sum + p.amount, 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Prazo Mais Próximo */}
              {closestDeadline && (
                <div className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 rounded-xl p-4 border border-orange-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="text-orange-400" size={18} />
                    <p className="text-sm font-medium text-orange-300">Prazo Mais Próximo</p>
                  </div>
                  <p className="font-bold text-white mb-1">{closestDeadline.name}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">
                      Vence em {new Date(closestDeadline.deadline!).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-orange-400 font-semibold">
                      {Math.ceil((new Date(closestDeadline.deadline!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} dias
                    </span>
                  </div>
                </div>
              )}

              {/* Mensagem Motivacional */}
              <div className="bg-gradient-to-br from-gold-900/20 to-gold-800/10 rounded-xl p-4 border border-gold-700/30 text-center">
                <p className="text-sm text-gold-300 font-medium">
                  {completedGoals === 0 && activeGoals > 0 && "Continue investindo! Você está no caminho certo 💪"}
                  {completedGoals > 0 && completedGoals === totalGoals && "Parabéns! Todas as metas concluídas! 🎉"}
                  {completedGoals > 0 && completedGoals < totalGoals && `Você já completou ${completedGoals} meta${completedGoals > 1 ? 's' : ''}! Continue assim! ✨`}
                  {totalGoals === 0 && "Crie sua primeira meta e comece sua jornada! 🎯"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 p-4">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-bold py-3 rounded-xl transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
