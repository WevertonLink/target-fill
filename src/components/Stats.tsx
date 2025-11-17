import { X, TrendingUp, Target as TargetIcon, Flame, DollarSign } from 'lucide-react';
import type { UserStats } from '../types';

interface StatsProps {
  stats: UserStats;
  onClose: () => void;
}

export default function Stats({ stats, onClose }: StatsProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-zinc-900 p-4 border-b border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-gold-400" size={24} />
            <h2 className="text-xl font-bold text-gold-400">Estatísticas</h2>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TargetIcon size={20} className="text-gold-400" />
                <span className="text-sm text-zinc-400">Metas Criadas</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.totalGoals}</p>
            </div>

            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-green-400" />
                <span className="text-sm text-zinc-400">Concluídas</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.completedGoals}</p>
            </div>

            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={20} className="text-orange-400" />
                <span className="text-sm text-zinc-400">Sequência</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.currentStreak} dias</p>
            </div>

            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={20} className="text-gold-400" />
                <span className="text-sm text-zinc-400">Total Pago</span>
              </div>
              <p className="text-2xl font-bold text-white">R$ {stats.totalPaid.toFixed(2)}</p>
            </div>
          </div>

          {stats.totalGoals > 0 && (
            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="font-semibold text-gold-400 mb-2">Progresso Geral</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-400">Taxa de Conclusão</span>
                    <span className="text-white">
                      {((stats.completedGoals / stats.totalGoals) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${(stats.completedGoals / stats.totalGoals) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
