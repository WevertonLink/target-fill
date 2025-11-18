import { Target, List, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onCreateClick: () => void;
  onViewGoalsClick?: () => void;
  goalsCount?: number;
  onControlClick?: () => void;
  onProgressClick?: () => void;
  onDeadlineClick?: () => void;
}

export default function EmptyState({
  onCreateClick,
  onViewGoalsClick,
  goalsCount = 0,
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="max-w-md w-full text-center px-4">
        {/* Elegant Animated Logo */}
        <div className="relative mb-8">
          {/* Outer glow ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gold-500/5 rounded-full animate-pulse" />
          </div>

          {/* Middle glow ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 bg-gold-500/10 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
          </div>

          {/* Main logo container */}
          <div className="relative flex items-center justify-center">
            {/* Gradient background circle */}
            <div className="w-28 h-28 bg-gradient-to-br from-gold-400 via-gold-500 to-amber-600 rounded-full flex items-center justify-center shadow-2xl shadow-gold-500/40 relative overflow-hidden">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-pulse" />

              {/* Target rings */}
              <div className="relative flex items-center justify-center w-full h-full">
                <div className="absolute w-20 h-20 border-2 border-black/10 rounded-full" />
                <div className="absolute w-14 h-14 border-2 border-black/15 rounded-full" />
                <div className="absolute w-8 h-8 border-2 border-black/20 rounded-full" />

                {/* Center icon */}
                <div className="relative">
                  <Target size={40} className="text-black drop-shadow-lg" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
          {goalsCount > 0 ? 'Bem-vindo de volta!' : 'Comece sua jornada!'}
        </h2>

        <p className="text-zinc-400 mb-6 text-sm">
          {goalsCount > 0
            ? 'Gerencie suas metas e conquiste seus objetivos'
            : 'Transforme seus sonhos em realidade'}
        </p>

        {/* Compact Features Grid */}
        {goalsCount === 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-center">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gold-500/20 flex items-center justify-center">
                <span className="text-gold-400 text-lg">💰</span>
              </div>
              <p className="text-zinc-400 text-xs">Controle</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-center">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gold-500/20 flex items-center justify-center">
                <span className="text-gold-400 text-lg">📈</span>
              </div>
              <p className="text-zinc-400 text-xs">Progresso</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-center">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gold-500/20 flex items-center justify-center">
                <span className="text-gold-400 text-lg">🎯</span>
              </div>
              <p className="text-zinc-400 text-xs">Metas</p>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="space-y-3">
          {goalsCount > 0 && onViewGoalsClick && (
            <button
              onClick={onViewGoalsClick}
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <List size={20} />
              <span>Ver Minhas Metas ({goalsCount})</span>
            </button>
          )}

          <button
            onClick={onCreateClick}
            className={`w-full ${
              goalsCount > 0
                ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                : 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50'
            } font-bold py-3.5 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2`}
          >
            <Sparkles size={20} />
            <span>{goalsCount > 0 ? 'Criar Nova Meta' : 'Criar Primeira Meta'}</span>
          </button>
        </div>

        {/* Compact Subtitle */}
        {goalsCount === 0 && (
          <p className="mt-4 text-zinc-600 text-xs">
            Seus dados ficam seguros no seu dispositivo 🔒
          </p>
        )}
      </div>
    </div>
  );
}
