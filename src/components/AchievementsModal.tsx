import { X, Award, Trophy, Star, Sparkles, Target } from 'lucide-react';
import type { Goal } from '../types';

interface AchievementsModalProps {
  goals: Goal[];
  onClose: () => void;
}

export default function AchievementsModal({ goals, onClose }: AchievementsModalProps) {
  // Metas concluídas
  const completedGoals = goals.filter(g => {
    const totalPaid = g.payments.reduce((sum, p) => sum + p.amount, 0);
    return totalPaid >= g.targetAmount;
  });

  // Conquistas baseadas em marcos
  const achievements = [
    {
      id: 'first_goal',
      title: 'Primeira Meta',
      description: 'Criou sua primeira meta',
      icon: Target,
      unlocked: goals.length >= 1,
      color: 'blue'
    },
    {
      id: 'first_complete',
      title: 'Primeira Conquista',
      description: 'Completou sua primeira meta',
      icon: Award,
      unlocked: completedGoals.length >= 1,
      color: 'green'
    },
    {
      id: 'three_goals',
      title: 'Colecionador',
      description: 'Criou 3 ou mais metas',
      icon: Star,
      unlocked: goals.length >= 3,
      color: 'purple'
    },
    {
      id: 'three_complete',
      title: 'Conquistador',
      description: 'Completou 3 metas',
      icon: Trophy,
      unlocked: completedGoals.length >= 3,
      color: 'gold'
    },
    {
      id: 'big_saver',
      title: 'Grande Investidor',
      description: 'Investiu mais de R$ 1.000',
      icon: Sparkles,
      unlocked: goals.reduce((sum, g) => sum + g.payments.reduce((pSum, p) => pSum + p.amount, 0), 0) >= 1000,
      color: 'orange'
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const getColorClasses = (color: string, unlocked: boolean) => {
    if (!unlocked) return 'text-zinc-600 bg-zinc-800/50 border-zinc-700/50';

    const colors: Record<string, string> = {
      blue: 'text-blue-400 bg-blue-900/20 border-blue-700/30',
      green: 'text-green-400 bg-green-900/20 border-green-700/30',
      purple: 'text-purple-400 bg-purple-900/20 border-purple-700/30',
      gold: 'text-gold-400 bg-gold-900/20 border-gold-700/30',
      orange: 'text-orange-400 bg-orange-900/20 border-orange-700/30'
    };
    return colors[color] || colors.gold;
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-zinc-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-zinc-800 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center border border-gold-500/30">
              <Trophy className="text-gold-400" size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Conquistas</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Estatística de Conquistas */}
          <div className="bg-gradient-to-br from-gold-900/20 to-gold-800/10 rounded-xl p-4 border border-gold-700/30 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="text-gold-400" size={24} />
              <p className="text-2xl font-bold text-gold-400">
                {unlockedAchievements.length}/{achievements.length}
              </p>
            </div>
            <p className="text-sm text-zinc-400">Conquistas Desbloqueadas</p>
          </div>

          {/* Conquistas Desbloqueadas */}
          {unlockedAchievements.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gold-400 flex items-center gap-2">
                <Sparkles size={16} />
                Desbloqueadas
              </h3>
              {unlockedAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`rounded-xl p-4 border ${getColorClasses(achievement.color, true)} transition-all hover:scale-[1.02]`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-full ${getColorClasses(achievement.color, true)} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white mb-1">{achievement.title}</h4>
                        <p className="text-xs text-zinc-400">{achievement.description}</p>
                      </div>
                      <div className="text-2xl">✨</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Conquistas Bloqueadas */}
          {lockedAchievements.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-zinc-500 flex items-center gap-2">
                <Award size={16} />
                Bloqueadas
              </h3>
              {lockedAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`rounded-xl p-4 border ${getColorClasses(achievement.color, false)} opacity-50`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center flex-shrink-0">
                        <Icon size={24} className="text-zinc-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-zinc-500 mb-1">{achievement.title}</h4>
                        <p className="text-xs text-zinc-600">{achievement.description}</p>
                      </div>
                      <div className="text-2xl opacity-30">🔒</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Metas Concluídas */}
          {completedGoals.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-green-400 flex items-center gap-2">
                <Award size={16} />
                Metas Concluídas ({completedGoals.length})
              </h3>
              {completedGoals.map((goal) => {
                const totalPaid = goal.payments.reduce((sum, p) => sum + p.amount, 0);
                return (
                  <div
                    key={goal.id}
                    className="bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-xl p-4 border border-green-700/30"
                  >
                    <div className="flex items-start gap-3">
                      {goal.imageUrl && (
                        <img
                          src={goal.imageUrl}
                          alt={goal.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white mb-1 truncate">{goal.name}</h4>
                        <p className="text-xs text-green-400 font-semibold">
                          R$ {totalPaid.toFixed(2)} investidos
                        </p>
                        {goal.category && (
                          <p className="text-xs text-zinc-500 mt-1">{goal.category}</p>
                        )}
                      </div>
                      <div className="text-2xl">🏆</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {completedGoals.length === 0 && (
            <div className="text-center py-8">
              <Trophy size={48} className="text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm mb-2">Nenhuma meta concluída ainda</p>
              <p className="text-zinc-600 text-xs">Complete sua primeira meta para desbloquear conquistas!</p>
            </div>
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
