import { Target, TrendingUp, Trophy } from 'lucide-react';

interface EmptyStateProps {
  onCreateClick: () => void;
  onViewGoalsClick?: () => void;
  onStatsClick?: () => void;
  onAchievementsClick?: () => void;
}

export default function EmptyState({ 
  onCreateClick, 
  onViewGoalsClick,
  onStatsClick,
  onAchievementsClick 
}: EmptyStateProps) {
  return (
    <div className="h-[calc(100vh-160px)] flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-md w-full text-center flex flex-col justify-center">
        {/* Logo do App */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Glow animado de fundo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-56 h-56 bg-gradient-to-r from-gold-500/20 via-gold-400/30 to-gold-500/20 rounded-full blur-3xl animate-pulse"
                 style={{ animationDuration: '3s' }} />
          </div>

          {/* Logo Image Container com integração aprimorada */}
          <div className="relative w-48 h-48 flex items-center justify-center rounded-3xl overflow-hidden"
               style={{
                 background: 'radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)'
               }}>
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-transparent to-gold-500/5 backdrop-blur-[1px]" />
            <img
              src="/logo-welcome.png"
              alt="Target-Fill Logo"
              className="relative w-full h-full object-contain animate-fade-in"
              style={{
                filter: 'drop-shadow(0 4px 20px rgba(255, 215, 0, 0.25)) contrast(1.1)',
                mixBlendMode: 'screen'
              }}
            />
          </div>
        </div>

        {/* Title com gradiente animado */}
        <div className="mb-2">
          <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-gold-300 via-gold-500 via-gold-400 to-gold-300 bg-clip-text text-transparent animate-gradient-x"
              style={{ backgroundSize: '200% auto' }}>
            Transforme seus sonhos em realidade
          </h2>
        </div>
        
        <p className="text-zinc-400 text-base mb-6 leading-relaxed">
          Crie metas, acompanhe progresso e <span className="text-gold-400 font-semibold">conquiste seus objetivos</span>
        </p>

        {/* Botões com ícones diferentes */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button 
            onClick={onViewGoalsClick}
            disabled={!onViewGoalsClick}
            className="bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700/50 rounded-xl p-3 flex flex-col items-center gap-2 hover:border-gold-500/50 transition-all hover:scale-105 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center border border-gold-500/30 group-hover:border-gold-500/50 transition-all">
              <Target className="text-gold-400 group-hover:scale-110 transition-transform" size={20} strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <p className="font-bold text-white text-xs leading-tight">Ver Metas</p>
              <p className="text-zinc-500 text-[10px] leading-tight">Criadas</p>
            </div>
          </button>

          <button 
            onClick={onStatsClick}
            disabled={!onStatsClick}
            className="bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700/50 rounded-xl p-3 flex flex-col items-center gap-2 hover:border-gold-500/50 transition-all hover:scale-105 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center border border-gold-500/30 group-hover:border-gold-500/50 transition-all">
              <TrendingUp className="text-gold-400 group-hover:scale-110 transition-transform" size={20} strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <p className="font-bold text-white text-xs leading-tight">Estatísticas</p>
              <p className="text-zinc-500 text-[10px] leading-tight">Geral</p>
            </div>
          </button>

          <button 
            onClick={onAchievementsClick}
            disabled={!onAchievementsClick}
            className="bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700/50 rounded-xl p-3 flex flex-col items-center gap-2 hover:border-gold-500/50 transition-all hover:scale-105 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center border border-gold-500/30 group-hover:border-gold-500/50 transition-all">
              <Trophy className="text-gold-400 group-hover:scale-110 transition-transform" size={20} strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <p className="font-bold text-white text-xs leading-tight">Conquistas</p>
              <p className="text-zinc-500 text-[10px] leading-tight">Desbloqueadas</p>
            </div>
          </button>
        </div>

        {/* CTA Button Premium */}
        <button
          onClick={onCreateClick}
          className="w-full bg-gradient-to-r from-gold-500 via-gold-600 to-gold-500 hover:from-gold-600 hover:via-gold-700 hover:to-gold-600 text-black font-bold py-4 px-6 rounded-xl shadow-2xl shadow-gold-500/50 hover:shadow-gold-600/70 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 relative overflow-hidden group"
        >
          {/* Brilho animado */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          <Target size={22} strokeWidth={2.5} className="relative z-10" />
          <span className="text-lg relative z-10">Criar Primeira Meta</span>
        </button>

        {/* Subtitle */}
        <p className="mt-4 text-zinc-600 text-xs flex items-center justify-center gap-2">
          <span className="text-sm">🔒</span>
          <span>Seus dados ficam seguros no seu dispositivo</span>
        </p>
      </div>
    </div>
  );
}
