import { X, Trophy } from 'lucide-react';
import type { Achievement } from '../types';

interface AchievementsProps {
  achievements: Achievement[];
  onClose: () => void;
}

export default function Achievements({ achievements, onClose }: AchievementsProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-zinc-900 p-4 border-b border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="text-gold-400" size={24} />
            <h2 className="text-xl font-bold text-gold-400">Conquistas</h2>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4 text-center">
            <p className="text-zinc-400">
              {unlockedCount} de {achievements.length} conquistadas
            </p>
            <div className="w-full bg-zinc-800 rounded-full h-2 mt-2">
              <div 
                className="bg-gold-500 h-2 rounded-full transition-all"
                style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  achievement.unlocked
                    ? 'bg-zinc-800 border-gold-600'
                    : 'bg-zinc-900 border-zinc-700 opacity-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${achievement.unlocked ? 'text-gold-400' : 'text-zinc-500'}`}>
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-zinc-400">{achievement.description}</p>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <p className="text-xs text-zinc-600 mt-1">
                        Desbloqueada em {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  {achievement.unlocked && (
                    <div className="text-green-500">✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
